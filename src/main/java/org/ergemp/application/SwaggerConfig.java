package org.ergemp.application;

import com.google.common.base.Predicates;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.Collections;
import java.util.function.Predicate;

import static springfox.documentation.builders.PathSelectors.regex;

//
//enable swagger documentation
// /v2/api-docs
// /swagger-ui.html
//
@Configuration
@EnableSwagger2
public class SwaggerConfig extends WebMvcConfigurationSupport {

    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(getApiInfo())
                .select()
                //.apis(RequestHandlerSelectors.any())
                //.apis(Predicates.not(RequestHandlerSelectors.basePackage("org.springframework.boot")))
                //.paths(Predicates.not(PathSelectors.regex("/error"))) // Exclude Spring error controllers
                //.apis(RequestHandlerSelectors.basePackage( "org.ergemp.controller"))
                .apis(RequestHandlerSelectors.withClassAnnotation(RestController.class))
                //.paths(regex("/api/person"))
                //.paths(regex(""))
                //.paths(PathSelectors.any())
                .build()
                ;
    }

    private ApiInfo getApiInfo() {
        return new ApiInfo(
                "SPRINGBOOT-BOOT",
                "BOOT PROJECT FOR SPRING BOOT",
                "1.0",
                "TERMS OF SERVICE URL",
                new Contact("ERGEMP","www.ergemp.org","EMAIL"),
                "LICENSE",
                "LICENSE URL",
                Collections.emptyList()
        );
    }
}
