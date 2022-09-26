package org.ergemp.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class Person {
    private String id;
    private String firstName;
    private String lastName;

    public Person(){
    }

    public Person(String gId, String gFirstName, String gLastName){
        this.id = gId;
        this.firstName = gFirstName;
        this.lastName = gLastName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
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
