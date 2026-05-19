package com.example.lithtalk.util;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderUtil {
    private static final PasswordEncoder encoder = new Argon2PasswordEncoder(16, 32, 1, 12, 1);

    public static String encode(String raw) {
        return encoder.encode(raw);
    }

    public static boolean matches(String raw, String hash) {
        return encoder.matches(raw, hash);
    }
}
