package com.example.lithtalk.controller;

import com.example.lithtalk.dto.ChangePasswordRequest;
import com.example.lithtalk.dto.LoginRequest;
import com.example.lithtalk.dto.RegisterRequest;
import com.example.lithtalk.dto.ResetPasswordRequest;
import com.example.lithtalk.dto.PasswordResetEmailRequest;
import com.example.lithtalk.service.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private static final String SECRET_KEY = "secretsuper200secretmy346794cookiejwtweblith20976";
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // --------------------------
    // REGISTER
    // --------------------------
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // --------------------------
    // LOGIN
    // --------------------------
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        boolean success = userService.login(request);

        if (!success) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }

        // create JWT
        String token = Jwts.builder()
                .setSubject(request.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();

        // set cookie
        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) (EXPIRATION_TIME / 1000));
        response.addCookie(cookie);

        // get user info
        var user = userService.getUserByEmail(request.getEmail());

        Map<String, Object> resBody = new HashMap<>();
        resBody.put("message", "Login successful!");
        resBody.put("userId", user.getId());
        resBody.put("name", user.getFirstName()); // or combine first + last name
        resBody.put("email", user.getEmail());
        resBody.put("token", token); // optional if needed in frontend
        resBody.put("surname", user.getLastName());

        return ResponseEntity.ok(resBody);
    }


    // --------------------------
    // LOGOUT
    // --------------------------
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseEntity.ok("Logged out successfully!");
    }

    // --------------------------
    // CHECK AUTH
    // --------------------------
    @GetMapping("/check")
    public ResponseEntity<String> checkAuth(@CookieValue(value = "authToken", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return ResponseEntity.ok("Authenticated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    // --------------------------
    // CHANGE PASSWORD (logged in)
    // --------------------------
    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // just pass email from the request
            userService.changePassword(request.getEmail(), request);
            return ResponseEntity.ok("Password changed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    // --------------------------
    // REQUEST PASSWORD RESET (send email)
    // --------------------------
    @PostMapping("/request-password-reset")
    public ResponseEntity<String> sendResetPasswordEmail(@RequestBody PasswordResetEmailRequest request) {
        try {
            userService.createPasswordResetToken(request);
            return ResponseEntity.ok("Password reset link sent to email.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // --------------------------
    // RESET PASSWORD BY TOKEN
    // --------------------------
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestBody ResetPasswordRequest request) {

        try {
            userService.resetPassword(token, request);
            return ResponseEntity.ok("Password reset successfully.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@CookieValue(value = "authToken", required = false) String token,
                                                HttpServletResponse response) {
        if (token == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        try {
            // Parse JWT to get email
            String email = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();

            // Delete the user
            userService.deleteUser(email);

            // Clear auth cookie
            Cookie cookie = new Cookie("authToken", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(false);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);

            return ResponseEntity.ok("Account deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}
