package org.ergemp.repository;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import org.ergemp.mapper.PersonMapper;
import org.ergemp.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PersonRepository {
    @Autowired
    @Qualifier("jdbcTemplate1")
    private JdbcTemplate jdbcTemplate;

    public List<Person> findAll() {
        List<Person> result = jdbcTemplate.query(
                "SELECT id, first_name, last_name FROM person",
                new PersonMapper()
        );
        return result;
    }

    public List<Person> findById(Integer id) {
        List<Person> result = jdbcTemplate.query(
                "SELECT id, first_name, last_name FROM person where id = ?",
                new Object[] { id },
                new PersonMapper()
        );
        return result;
    }

    public void addPerson(Person person) {
        String id = NanoIdUtils.randomNanoId();
        jdbcTemplate.update("INSERT INTO person(id, first_name, last_name) VALUES (?,?,?)",
                id, person.getFirstName(), person.getLastName());
    }

    public void deletePerson(String id) {
        jdbcTemplate.update("INSERT INTO person(first_name, last_name) VALUES (?)",
                id);
    }

    public Boolean deletePerson(Integer id) {
        return jdbcTemplate.update("delete from person where id = ?", id) > 0;
    }

}
