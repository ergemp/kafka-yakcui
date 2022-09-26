package org.ergemp.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Token {
    private String token;

    public Token(){

    }

    public Token(String gToken){
        this.token = gToken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String toString(){
        ObjectMapper objectMapper = new ObjectMapper();
        String retVal = "";
        try {
            retVal = objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        finally {
            return retVal;
        }
    }
}
