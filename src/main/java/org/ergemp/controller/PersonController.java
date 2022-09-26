package org.ergemp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {
    @GetMapping("/api/person")
    public ResponseEntity getToken() {
        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body("OK");
        return retVal;
    }
}
