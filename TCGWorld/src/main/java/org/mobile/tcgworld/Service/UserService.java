package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    User updateUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    Optional<User> getUserByUsername(String username);
    void deleteUser(Long id);

    Optional<User> getUserByEmail(String email);

}