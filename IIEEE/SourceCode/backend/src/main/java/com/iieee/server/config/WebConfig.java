package com.iieee.server.config;

import com.iieee.server.config.property.CorsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final CorsProperties corsProperties;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedHeaders(corsProperties.getAllowedHeaders().split(","))
                .allowedHeaders(corsProperties.getAllowedHeaders().split(","))
                .allowedOrigins(corsProperties.getAllowedOrigins().split(","))
                .allowedMethods(corsProperties.getAllowedMethods().split(","))
                .maxAge(3000);
    }
}