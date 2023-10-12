package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.UserProfileDTO;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
public class AccountControllerDisplay {
    private final AccountRepositoryUpdates accountRepository;
    private final Key key; // Inject the Key component

    @Autowired
    public AccountControllerDisplay(AccountRepositoryUpdates accountRepository, Key key) {
        this.accountRepository = accountRepository;
        this.key = key;
    }
    @GetMapping("/api/account/profilepicture")
    public ResponseEntity<byte[]> getProfilePicture(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix

        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();

            AccountUpdates account = accountRepository.findByUsername(usernameFromToken);

            if (account != null) {
                return ResponseEntity.ok(account.getProfilePicture());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found".getBytes());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token verification failed".getBytes());
        }
    }
    @GetMapping("/api/account/banner")
    public ResponseEntity<byte[]> getBanner(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix

        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();

            AccountUpdates account = accountRepository.findByUsername(usernameFromToken);

            if (account != null) {
                return ResponseEntity.ok(account.getBanner());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found".getBytes());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token verification failed".getBytes());
        }
    }
}
