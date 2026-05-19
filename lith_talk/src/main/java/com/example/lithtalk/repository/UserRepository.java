package com.example.lithtalk.repository;

import com.example.lithtalk.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    default User getUserByEmail(String email) {
            return findByEmail(email).orElse(null);
        }

}
