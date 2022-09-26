package org.ergemp.repository;

import com.aventrix.jnanoid.jnanoid.NanoIdUtils;
import org.ergemp.mapper.UserMapper;
import org.ergemp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {
    @Autowired
    @Qualifier("jdbcTemplate1")
    private JdbcTemplate jdbcTemplate;

    public List<User> findAll() {
        List<User> result = jdbcTemplate.query(
                "SELECT id, username, password, last_updated FROM user",
                new UserMapper()
        );
        return result;
    }

    public List<User> findById(String id) {
        List<User> result = jdbcTemplate.query(
                "SELECT id, username, password, last_updated FROM myuser where id = ?",
                new Object[] { id },
                new UserMapper()
        );
        return result;
    }

    public List<User> findByName(String username) {
        List<User> result = jdbcTemplate.query(
                "SELECT id, username, password, last_updated FROM myuser where username = ?",
                new Object[] { username },
                new UserMapper()
        );
        return result;
    }

    public List<User> findByUsernamePassword(String username, String password) {
        List<User> result = jdbcTemplate.query(
                "SELECT id, username, password, last_updated FROM myuser where username = ? and password= ?",
                new Object[] { username, password },
                new UserMapper()
        );
        return result;
    }

    public void addUser(User user) {
        String id = NanoIdUtils.randomNanoId();
        jdbcTemplate.update("INSERT INTO myuser(id, username, password) VALUES (?,?,?)",
                id, user.getUsername(), user.getPassword());
    }

    public Boolean deleteUser(Integer id) {

        return jdbcTemplate.update("delete from myuser where id = ?", id) > 0;

    }
}
