package org.ergemp.interceptor;

import org.ergemp.component.JwtComponent;
import org.ergemp.model.User;
import org.ergemp.repository.UserRepository;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@Component
public class SecurityInterceptor implements HandlerInterceptor {

    Logger logger = org.slf4j.LoggerFactory.getLogger(this.getClass());

    @Autowired
    private JwtComponent jwtComponent;

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //logger.info("LOGGER: ----- pre handle -----");
        //logger.info(request.getRequestURI() + " @ " + System.currentTimeMillis());

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token is in the form "Bearer token". Remove Bearer word and get
        // only the Token
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtComponent.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                //logger.warn("SecurityFilter: Unable to get JWT Token");
                response.setStatus(401);
                response.getWriter().write("SecurityFilter: Unable to get JWT Token");
                return false;
            }
        } else {
            //logger.warn("SecurityFilter: JWT Token does not begin with Bearer String");
            response.setStatus(401);
            response.getWriter().write("SecurityFilter: Unable to get JWT Token");
            return false;
        }

        // Once we get the token validate it.
        if (username != null) {

            List<User> users = userRepository.findByName(username);

            if (users.size() != 1) {
                response.setStatus(401);
                response.getWriter().write("SecurityFilter: Invalid Username");
                return false;
            }

            // if token is valid configure Spring Security to manually set
            // authentication
            if (jwtComponent.validateToken(jwtToken)) {
                return true;
            }
            else{
                response.setStatus(401);
                response.getWriter().write("SecurityFilter: Invalid Token");
                return false;
            }
        }
        return true;
    }
}
