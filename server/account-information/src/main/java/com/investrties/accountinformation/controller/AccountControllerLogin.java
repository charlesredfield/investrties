package com.investrties.accountinformation.controller;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.investrties.accountinformation.model.AccountLogin;
import com.investrties.accountinformation.repository.AccountRepositoryLogin;
import com.investrties.accountinformation.utils.PasswordUtils;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

@RestController
@RequestMapping("/api")
public class AccountControllerLogin {
    private static final long EXPIRATION_TIME = 3600000;
    private final AccountRepositoryLogin accountRepository;
    private final Key key; // Inject the Key component

    @Autowired
    public AccountControllerLogin(AccountRepositoryLogin accountRepository, Key key) {
        this.accountRepository = accountRepository;
        this.key = key;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AccountLogin account) {

        System.out.println("Received Request Body: " + account.toString());
        String userIdentifier = account.getUsername();
        String password = account.getPassword();
        System.out.println("Received username: " + userIdentifier);
        System.out.println("Received password: " + password);

        // Check if userIdentifier is an email or username
        AccountLogin storedAccount = null;
        if (userIdentifier.contains("@")) {
            // User entered an email
            storedAccount = accountRepository.findByEmail(userIdentifier);
        } else {
            // User entered a username
            storedAccount = accountRepository.findByUsername(userIdentifier);
        }

        if (storedAccount == null) {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }

        // Check if profile information is already set


        // Verify the provided password against the stored hashed password
        // Verify using the hashed password stored in the database
        boolean passwordsMatch = PasswordUtils.verifyPassword(password, storedAccount.getPassword());
        boolean isProfileInfoSet = isProfileInfoAlreadySet(storedAccount);
        System.out.println("passwordsMatch: " + passwordsMatch);
        System.out.println("isProfileInfoSet: " + isProfileInfoSet);
        if (passwordsMatch && !isProfileInfoAlreadySet(storedAccount)){

            Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION_TIME); // Define EXPIRATION_TIME in milliseconds
            String accessToken = Jwts.builder()
                    .setSubject(storedAccount.getUsername())
                    .setIssuedAt(new Date()) // Set token issued at (iat) claim
                    .setExpiration(expirationDate) // Set token expiration
                    .signWith(SignatureAlgorithm.HS256, key.getSecretKey()) // Replace with your actual secret key
                    .compact();

            return new ResponseEntity<>(accessToken, HttpStatus.CREATED);

        }
        else if (passwordsMatch && isProfileInfoAlreadySet(storedAccount)) {
            // Generate a JWT

            Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION_TIME); // Define EXPIRATION_TIME in milliseconds
            String accessToken = Jwts.builder()
                    .setSubject(storedAccount.getUsername())
                    .setIssuedAt(new Date()) // Set token issued at (iat) claim
                    .setExpiration(expirationDate) // Set token expiration
                    .signWith(SignatureAlgorithm.HS256, key.getSecretKey()) // Replace with your actual secret key
                    .compact();



            return new ResponseEntity<>(accessToken, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }
    }
    // Helper method to check if profile information is already set
    boolean isProfileInfoAlreadySet(AccountLogin account) {
        return account.getFirstName() != null &&
                !account.getFirstName().isEmpty() &&
                account.getLastName() != null &&
                !account.getLastName().isEmpty() &&
                account.getAbout() != null &&
                !account.getAbout().isEmpty() &&
                account.getProfilePicture() != null;
    }
}
    //In this code, the login method first checks whether the userIdentifier contains the "@" symbol, which would indicate an email address. If it does, the code searches for the user in the database by email using findByEmail. If not, it searches for the user by username using findByUsername.
    //this modification allows users to log in using either their username or email and handles the login process accordingly.





