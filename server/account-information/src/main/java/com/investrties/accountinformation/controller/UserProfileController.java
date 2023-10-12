package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.UserProfileDTO;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.services.UserProfileService;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final Key key;
    private final AccountRepositoryUpdates accountRepository;

    @Autowired
    public UserProfileController(UserProfileService userProfileService, Key key, AccountRepositoryUpdates accountRepository) {
        this.userProfileService = userProfileService;
        this.key = key;
        this.accountRepository = accountRepository;
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username) {
        // Retrieve user profile data based on the username
        UserProfileDTO userProfile = userProfileService.getUserProfile(username);

        if (userProfile != null) {
            return ResponseEntity.ok(userProfile);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping("/myProfile")
    public ResponseEntity<UserProfileDTO> getMyProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix


            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();
            UserProfileDTO userProfile = userProfileService.getUserProfile(usernameFromToken);

            if (userProfile != null) {
                return ResponseEntity.ok(userProfile);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
    @GetMapping("/{username}/banner")
    public ResponseEntity<byte[]> getBanner(@PathVariable String username) {

        try {

            AccountUpdates account = accountRepository.findByUsername(username);

            if (account != null) {
                return ResponseEntity.ok(account.getBanner());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found".getBytes());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username verification failed".getBytes());
        }
    }
}
