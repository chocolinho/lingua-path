package com.lulu.englishlearningapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(errors);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> handleDataAccessException(
            DataAccessException ex) {

        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Database operation failed");
    }

    @ExceptionHandler(FeatureLockedException.class)
    public ResponseEntity<Map<String, String>> handleFeatureLockedException(
            FeatureLockedException ex) {

        return error(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(AiTutorException.class)
    public ResponseEntity<Map<String, String>> handleAiTutorException(
            AiTutorException ex) {

        return error(HttpStatus.BAD_GATEWAY, ex.getMessage());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleAuthenticationException(
            AuthenticationException ex) {

        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(
            AccessDeniedException ex) {

        return error(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleUnreadableRequest() {
        return error(HttpStatus.BAD_REQUEST, "Request body is invalid");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex) {

        return error(resolveRuntimeStatus(ex.getMessage()), ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException() {
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error");
    }

    private HttpStatus resolveRuntimeStatus(String message) {
        if (message == null || message.isBlank()) {
            return HttpStatus.BAD_REQUEST;
        }

        String normalizedMessage = message.toLowerCase();

        if (normalizedMessage.contains("invalid email or password")
                || normalizedMessage.contains("authentication is null")) {
            return HttpStatus.UNAUTHORIZED;
        }

        if (normalizedMessage.contains("not found")) {
            return HttpStatus.NOT_FOUND;
        }

        if (normalizedMessage.contains("already exists")) {
            return HttpStatus.CONFLICT;
        }

        if (normalizedMessage.contains("does not belong")) {
            return HttpStatus.FORBIDDEN;
        }

        return HttpStatus.BAD_REQUEST;
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);

        return ResponseEntity
                .status(status)
                .body(error);
    }
}
