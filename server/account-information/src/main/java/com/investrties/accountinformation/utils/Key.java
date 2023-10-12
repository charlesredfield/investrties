package com.investrties.accountinformation.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Key {
    @Value("${KEY}")
    private String secretKey;
    public String getSecretKey() {
        return secretKey;
    }
}
