package com.lulu.englishlearningapp.exception;

public class AiTutorException extends RuntimeException {

    public AiTutorException(String message) {
        super(message);
    }

    public AiTutorException(String message, Throwable cause) {
        super(message, cause);
    }
}
