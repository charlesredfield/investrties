package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountPost;
import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.repository.AccountRepositoryPosts;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.UUID;


@RestController
public class AccountControllerUpdates {
    private final AccountRepositoryPosts accountRepositoryPosts;
    private final AccountRepositoryUpdates accountRepositoryUpdates;
    private final Key key; // Inject the Key component
    private final GridFsTemplate postVideosGridFsTemplate;
    private final GridFsTemplate postPhotosGridFsTemplate;

    @Autowired
    public AccountControllerUpdates(AccountRepositoryUpdates accountRepositoryUpdates, Key key, AccountRepositoryPosts accountRepositoryPosts,
                                    @Qualifier("postPhotosGridFsTemplate") GridFsTemplate postPhotosGridFsTemplate,
                                    @Qualifier("postVideosGridFsTemplate") GridFsTemplate postVideosGridFsTemplate) {
        this.accountRepositoryUpdates = accountRepositoryUpdates;
        this.accountRepositoryPosts = accountRepositoryPosts;
        this.key = key;
        this.postVideosGridFsTemplate = postVideosGridFsTemplate;
        this.postPhotosGridFsTemplate = postPhotosGridFsTemplate;
    }


    // Your method to compare and verify the token
    private boolean verifyToken(String token, String usernameFromDatabase) {
        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();
            return usernameFromDatabase.equals(usernameFromToken);
        } catch (Exception e) {
            return false; // Token verification failed
        }
    }

    @GetMapping("/api/account/username")
    public ResponseEntity<String> getUsername(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix

        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();

            AccountUpdates account = accountRepositoryUpdates.findByUsername(usernameFromToken);

            if (account != null) {
                return ResponseEntity.ok(account.getUsername());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token verification failed");
        }
    }
    @GetMapping("/api/account")
    public ResponseEntity<AccountUpdates> getAccount(
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Retrieve the existing account from the database
        AccountUpdates existingAccount = accountRepositoryUpdates.findByUsername(usernameFromToken);

        if (existingAccount == null) {
            // Handle the case where the account doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        // Return the existing account data to the front end
        return ResponseEntity.ok(existingAccount);
    }


    @PostMapping("/api/account/update")
    public ResponseEntity<String> updateAccount(
            @RequestBody AccountUpdates updates,
            @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("Received JSON Data: " + updates);
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Retrieve the existing account from the database
        AccountUpdates existingAccount = accountRepositoryUpdates.findByUsername(usernameFromToken);

        if (existingAccount == null) {
            // Handle the case where the account doesn't exist
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found");
        }

        // Update the existing account with the new profile information

        if (updates.getFirstName() != null && !updates.getFirstName().isEmpty()) {
            existingAccount.setFirstName(updates.getFirstName());
        }

        if (updates.getLastName() != null && !updates.getLastName().isEmpty()) {
            existingAccount.setLastName(updates.getLastName());
        }

        if (updates.getAbout() != null && !updates.getAbout().isEmpty()) {
            existingAccount.setAbout(updates.getAbout());
        }

        byte[] profilePictureData = updates.getProfilePicture();
        if (profilePictureData != null && profilePictureData.length > 0) {
            // Check if the profile picture data is not null and has content
            existingAccount.setProfilePicture(profilePictureData);
        }

        byte[] bannerData = updates.getBanner();
        if (bannerData != null && bannerData.length > 0) {
            // Check if the profile picture data is not null and has content
            existingAccount.setBanner(bannerData);
        }

// Save the updated account
        accountRepositoryUpdates.save(existingAccount);

        // Return a response indicating success
        return ResponseEntity.ok("Account updated successfully");
    }


    @PostMapping("/api/account/post")
    public ResponseEntity<String> makePost(
            @RequestBody AccountPost posts,
            @RequestHeader("Authorization") String authorizationHeader) {
        System.out.println("Received JSON Data: " + posts);
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();
        if (posts.getPhoto().length == 0) {
            // It's not a photo
            posts.setPhoto(null); // Set photo to null since it's not a photo
            posts.setPhotoId(null); // Set photoId to empty string since it's not a photo
        } else {
            // It's a photo
            String photoId = saveMediaToGridFS(postPhotosGridFsTemplate, posts.getPhoto());
            posts.setPhotoId(photoId);

            // Set photo to null since we don't want to save binary data in the message
            posts.setPhoto(null);
        }

        if (posts.getVideo().length == 0) {
            // It's not a video
            posts.setVideo(null); // Set video to null since it's not a video
            posts.setVideoId(null); // Set videoId to empty string since it's not a video
        } else {
            // It's a video
            String videoId = saveMediaToGridFS(postVideosGridFsTemplate, posts.getVideo());
            posts.setVideoId(videoId);

            // Set video to null since we don't want to save binary data in the message
            posts.setVideo(null);
        }
        AccountUpdates account = accountRepositoryUpdates.findByUsername(usernameFromToken);
        if (account != null) {
            // Update the fields as needed
            posts.setUsername(account.getUsername());
            posts.setPost(posts.getPost());
            posts.setCreatedAt(new Date());


            // Save the updated account
            accountRepositoryPosts.save(posts);

            return ResponseEntity.ok("Posted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }
    private String saveMediaToGridFS(GridFsTemplate gridFsTemplate, byte[] mediaData) {
        InputStream inputStream = new ByteArrayInputStream(mediaData);
        return gridFsTemplate.store(inputStream, UUID.randomUUID().toString()).toString();
    }
}


