package com.dgsw.dev.diet.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * JPA Auditing 설정
 * BaseTimeEntity의 createdAt, updatedAt 자동 설정을 위해 필요
 */
@Configuration
@EnableJpaAuditing
public class JpaConfig {
}