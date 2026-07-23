package com.lulu.englishlearningapp.service;

import com.lulu.englishlearningapp.dto.AiTutorRequest;
import com.lulu.englishlearningapp.dto.AiTutorResponse;
import com.lulu.englishlearningapp.exception.AiTutorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriBuilder;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AiTutorService {

    private static final Set<String> ALLOWED_LEVELS = Set.of("A1", "A2", "B1", "B2", "C1", "C2");
    private static final String DEFAULT_LEVEL = "A1";
    private static final String SYSTEM_PROMPT = """
            You are an AI English Tutor for Vietnamese primary school students.
            Use simple English and Vietnamese explanations.
            Keep answers short, friendly, and age-appropriate.
            Support CEFR A1 to C2, but default to A1/A2 unless the learner chooses a higher level.
            Help with vocabulary, grammar, sentence correction, and simple conversation practice.
            Do not answer unsafe, violent, adult, political, or unrelated content.
            When correcting grammar, explain gently and give one better sentence.
            Limit each answer to 4 short sentences.
            """;

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public AiTutorService(
            @Value("${ai.provider.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
            @Value("${ai.provider.api-key:}") String apiKey,
            @Value("${ai.provider.model:gemini-3.1-flash-lite}") String model) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public AiTutorResponse askTutor(AiTutorRequest request) {
        String message = normalizeMessage(request.getMessage());
        String level = normalizeLevel(request.getLevel());
        String topic = normalizeTopic(request.getTopic());

        if (apiKey == null || apiKey.isBlank()) {
            throw new AiTutorException("AI tutor is not configured yet");
        }

        Map<String, Object> payload = buildGeminiPayload(message, level, topic);

        try {
            Map<?, ?> response = restClient.post()
                    .uri(this::buildGeminiUri)
                    .body(payload)
                    .retrieve()
                    .body(Map.class);

            return new AiTutorResponse(extractReply(response));
        } catch (RestClientResponseException ex) {
            throw new AiTutorException(buildGeminiErrorMessage(ex), ex);
        } catch (RestClientException ex) {
            throw new AiTutorException("AI tutor could not answer right now. Please try again.", ex);
        }
    }

    private String normalizeMessage(String message) {
        if (message == null || message.trim().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        return message.trim();
    }

    private String normalizeLevel(String level) {
        if (level == null || level.isBlank()) {
            return DEFAULT_LEVEL;
        }

        String normalizedLevel = level.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_LEVELS.contains(normalizedLevel)) {
            throw new IllegalArgumentException("Level must be one of A1, A2, B1, B2, C1, or C2");
        }

        return normalizedLevel;
    }

    private String normalizeTopic(String topic) {
        if (topic == null || topic.trim().isBlank()) {
            return "No current topic";
        }

        return topic.trim();
    }

    private String buildLearnerPrompt(String message, String level, String topic) {
        return """
                Learner CEFR level: %s
                Current topic: %s
                Learner message: %s
                """.formatted(level, topic, message);
    }

    private URI buildGeminiUri(UriBuilder uriBuilder) {
        return uriBuilder
                .path("/models/{model}:generateContent")
                .queryParam("key", apiKey)
                .build(model);
    }

    private Map<String, Object> buildGeminiPayload(String message, String level, String topic) {
        return Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(Map.of("text", buildLearnerPrompt(message, level, topic)))
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.4,
                        "maxOutputTokens", 550
                )
        );
    }

    private String buildGeminiErrorMessage(RestClientResponseException ex) {
        String responseBody = ex.getResponseBodyAsString();
        String detail = responseBody == null || responseBody.isBlank()
                ? ex.getStatusText()
                : responseBody;

        return "Gemini API error " + ex.getStatusCode().value() + ": " + shorten(detail);
    }

    private String shorten(String value) {
        String normalizedValue = value.replaceAll("\\s+", " ").trim();
        if (normalizedValue.length() <= 320) {
            return normalizedValue;
        }

        return normalizedValue.substring(0, 320) + "...";
    }

    private String extractReply(Map<?, ?> response) {
        if (response == null) {
            throw new AiTutorException("AI tutor returned an empty response");
        }

        Object candidatesValue = response.get("candidates");
        if (!(candidatesValue instanceof List<?> candidates) || candidates.isEmpty()) {
            throw new AiTutorException("AI tutor returned an empty response");
        }

        Object firstCandidateValue = candidates.get(0);
        if (!(firstCandidateValue instanceof Map<?, ?> firstCandidate)) {
            throw new AiTutorException("AI tutor returned an unreadable response");
        }

        Object contentValue = firstCandidate.get("content");
        if (!(contentValue instanceof Map<?, ?> content)) {
            throw new AiTutorException("AI tutor returned an unreadable response");
        }

        Object partsValue = content.get("parts");
        if (!(partsValue instanceof List<?> parts) || parts.isEmpty()) {
            throw new AiTutorException("AI tutor returned an empty response");
        }

        String reply = parts.stream()
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .map(part -> part.get("text"))
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .collect(Collectors.joining("\n"))
                .trim();

        if (reply.isBlank()) {
            throw new AiTutorException("AI tutor returned an empty response");
        }

        return reply;
    }
}
