package org.ergemp.component;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.ergemp.model.JwtModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.util.Date;

@Component
public class JwtComponent implements Serializable {

    public static final long JWT_TOKEN_VALIDITY = 5 * 60 * 1000 ; //5 mins

    @Value("${jwt.secret}")
    private String secret;

    //retrieve username from jwt token
    public String getUsernameFromToken(String token) {
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(token);
        return jwt.getClaim("username").asString();
    }

    //check if the token has expired
    private Boolean isTokenExpired(String token) {
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(token);
        return jwt.getExpiresAt().before(new Date());
    }

    //generate token for user
    public String generateToken(JwtModel model) {
        String token = "";
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            token = com.auth0.jwt.JWT.create()
                    .withIssuer("epias")
                    .withClaim("username", model.getUsername())
                    .withClaim("status", model.getStatus())
                    .withClaim("ttl", model.getTtl())
                    //.withExpiresAt(new Date(System.currentTimeMillis() + (JWT_TOKEN_VALIDITY)))
                    .sign(algorithm);

        } catch (JWTCreationException exception){
            exception.printStackTrace();
        }
        finally {
            return token;
        }
    }

    //validate token
    public Boolean validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = com.auth0.jwt.JWT.require(algorithm)
                    .withIssuer("epias")
                    //.acceptExpiresAt(System.currentTimeMillis())
                    .build();
            DecodedJWT jwt = verifier.verify(token);
            return true;
        } catch (JWTVerificationException exception){
            return false;
        }
    }
}