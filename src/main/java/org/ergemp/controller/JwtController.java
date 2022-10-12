package org.ergemp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.ergemp.component.JwtComponent;
import org.ergemp.model.JwtModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@RestController
@CrossOrigin
public class JwtController {

    @Value("${application.user}")
    String applicationUser;

    @Value("${application.password}")
    String applicationPassword;

    @Autowired
    private JwtComponent jwtComponent;

    @GetMapping("/api/token")
    public ResponseEntity getToken() {
        //ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body(airlineRepository.findAll());

        ResponseEntity retVal = ResponseEntity.status(HttpStatus.OK).body("test");
        return retVal;
    }

    @PostMapping("/api/token")
    public ResponseEntity postToken(@RequestBody String gBody) {

        ResponseEntity retVal = ResponseEntity.status(HttpStatus.BAD_REQUEST).body("bad username/password");

        ObjectMapper mapper = new ObjectMapper();

        try {
            JsonNode userJson = mapper.readTree(gBody);

            byte[] decodedBytes = Base64.getDecoder().decode(userJson.get("password").textValue());
            String decodedPassword = new String(decodedBytes);

            if (applicationPassword.equals(decodedPassword) &&
                applicationUser.equalsIgnoreCase(userJson.get("username").textValue())) {

                JwtModel model = new JwtModel();
                model.setUsername(userJson.get("username").textValue());
                model.setStatus("PASS");
                final String token = jwtComponent.generateToken(model);
                return ResponseEntity.ok(token);

            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return retVal;
    }
}
