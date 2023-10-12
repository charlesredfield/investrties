package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountSignup;
import com.investrties.accountinformation.repository.AccountRepositorySignup;
import com.investrties.accountinformation.utils.PasswordUtils; // Import the PasswordUtils class
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AccountControllerSignup {

    @Autowired
    private AccountRepositorySignup accountRepository;

    @PostMapping("/update-account")
    public ResponseEntity<String> updateAccount(@RequestBody AccountSignup account) {
        // Check if the username already exists
        System.out.println("Received Request Body: " + account.toString());
        if (accountRepository.findByUsername(account.getUsername()) != null) {
            String jsonResponse = "{\"message\": \"Username already exists\"}";
            return new ResponseEntity<>(jsonResponse, HttpStatus.BAD_REQUEST);
            // Check if the email already exists
        } else if (accountRepository.findByEmail(account.getEmail()) != null) {
                String jsonResponse = "{\"message\": \"Email already exists\"}";
                return new ResponseEntity<>(jsonResponse, HttpStatus.BAD_REQUEST);
            }

        // Hash the password before saving
        String hashedPassword = PasswordUtils.hashPassword(account.getPassword());
        account.setPassword(hashedPassword);

        // Save the account information to MongoDB
        accountRepository.save(account);

        String jsonResponse = "{\"message\": \"Account information saved successfully\"}";
        return new ResponseEntity<>(jsonResponse, HttpStatus.OK);
    }
}
