package org.ergemp.controller;

import org.ergemp.component.JwtComponent;
import org.ergemp.model.Token;
import org.ergemp.model.User;
import org.ergemp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class AuthenticationController {

    /*
    @Autowired
    private JwtComponent jwtComponent;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/api/token")
    public ResponseEntity getToken(@RequestBody User user) {

        List<User> users = userRepository.findByUsernamePassword(user.getUsername(), user.getPassword());
        if (users.size() == 1 ){
            final String token = jwtComponent.generateToken(user);
            return ResponseEntity.ok(new Token(token));
        }
        else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("INVALID CREDENTIALS");
        }
    }

    @PostMapping("/api/token/validate")
    public ResponseEntity validateToken(@RequestBody Token token) {
        if (jwtComponent.validateToken(token.getToken())){
            return ResponseEntity.ok("VALIDATED");
        }
        else{
            return ResponseEntity.status(401).body("UNAUTHORIZED");
        }
    }
    */

}
