package com.investrties.accountinformation.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://34.162.99.226:3000", "http://10.0.0.2:3000", "http://10.0.0.2", "http://34.162.99.226") // Only allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*", "application/json", "multipart/form-data", "text/plain")
                .allowCredentials(true)
                .maxAge(3600);
    }
}