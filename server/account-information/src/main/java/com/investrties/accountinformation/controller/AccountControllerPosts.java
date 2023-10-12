package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountPost;
import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.Comment;
import com.investrties.accountinformation.model.Message;
import com.investrties.accountinformation.repository.AccountRepositoryPosts;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.services.PostService;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.io.IOException;


@RestController
public class AccountControllerPosts {
    private final AccountRepositoryPosts accountRepositoryPosts;
    private final Key key;
    private final PostService postService;
    private final GridFsTemplate postVideosGridFsTemplate;
    private final GridFsTemplate postPhotosGridFsTemplate;

    @Autowired
    public AccountControllerPosts(Key key, PostService postService, AccountRepositoryPosts accountRepositoryPosts,
                                  @Qualifier("postPhotosGridFsTemplate") GridFsTemplate postPhotosGridFsTemplate,
                                  @Qualifier("postVideosGridFsTemplate") GridFsTemplate postVideosGridFsTemplate) {
        this.accountRepositoryPosts = accountRepositoryPosts;
        this.key = key;
        this.postService = postService;
        this.postVideosGridFsTemplate = postVideosGridFsTemplate;
        this.postPhotosGridFsTemplate = postPhotosGridFsTemplate;
    }

    @GetMapping("/api/account/getPosts")
    public ResponseEntity<Map<String, Object>> getPosts(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix
        System.out.println("Authorization Header: " + authorizationHeader);

        try {
            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String usernameFromToken = claimsJws.getBody().getSubject();

            // Sort posts by createdAt in descending order (newest to oldest)
            List<AccountPost> postHistory = accountRepositoryPosts.findAllByUsername(
                    usernameFromToken,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );
            System.out.println("Username from token: " + usernameFromToken);
            System.out.println("Number of posts: " + postHistory.size());

            List<Map<String, Object>> compiledPostHistory = new ArrayList<>();

            for (AccountPost post : postHistory) {
                Map<String, Object> postData = new HashMap<>();
                postData.put("user", usernameFromToken);
                postData.put("id", post.getId());
                postData.put("posts", post.getPost());
                postData.put("comments", post.getComments());
                postData.put("likes", post.getLikes());

                if (post.getPhotoId() != null) {
                    // Fetch photo binary content based on photoId and add to messageData
                    byte[] photoContent = postService.getPhotoContentById(postPhotosGridFsTemplate, post.getPhotoId());
                    postData.put("photoContent", photoContent); // Add photo binary data
                } else if (post.getVideoId() != null) {
                    // Fetch video binary content based on videoId and add to messageData
                    byte[] videoContent = postService.getVideoContentById(postVideosGridFsTemplate, post.getVideoId());
                    postData.put("videoContent", videoContent); // Add video binary data
                }

                compiledPostHistory.add(postData);
            }

            // Compile chat thread object
            Map<String, Object> postsData = new HashMap<>();
            postsData.put("posts", compiledPostHistory);

            if (!compiledPostHistory.isEmpty()) {
                // Sort chat history by timestamp if needed
                Collections.sort(compiledPostHistory, (msg1, msg2) -> {
                    // Compare timestamps, adjust logic according to your needs
                    // Example: return Long.compare(msg1.getTimestamp(), msg2.getTimestamp());
                    return 0;
                });

                return ResponseEntity.ok(postsData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyMap());
            }
        } catch (Exception e) {
            e.printStackTrace(); // This will print the stack trace to the console

            // You can also log the exception message
            System.err.println("Exception message: " + e.getMessage());

            // You can log additional information if needed
            System.err.println("Additional information or context...");

            // Return a 401 (Unauthorized) response with an informative message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Unauthorized. Please check your credentials."));
        }
    }

    @GetMapping("/api/posts/{username}")
    public ResponseEntity<Map<String, Object>> getUserPosts(@PathVariable String username) {

        try {
            List<AccountPost> postHistory = accountRepositoryPosts.findAllByUsername(
                    username,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );
            List<Map<String, Object>> compiledPostHistory = new ArrayList<>();

            for (AccountPost post : postHistory) {
                Map<String, Object> postData = new HashMap<>();
                postData.put("user", username);
                postData.put("id", post.getId());
                postData.put("posts", post.getPost());
                postData.put("comments", post.getComments());
                postData.put("likes", post.getLikes());

                if (post.getPhotoId() != null) {
                    // Fetch photo binary content based on photoId and add to messageData
                    byte[] photoContent = postService.getPhotoContentById(postPhotosGridFsTemplate, post.getPhotoId());
                    postData.put("photoContent", photoContent); // Add photo binary data
                } else if (post.getVideoId() != null) {
                    // Fetch video binary content based on videoId and add to messageData
                    byte[] videoContent = postService.getVideoContentById(postVideosGridFsTemplate, post.getVideoId());
                    postData.put("videoContent", videoContent); // Add video binary data
                }

                compiledPostHistory.add(postData);
            }

            // Compile chat thread object
            Map<String, Object> postsData = new HashMap<>();
            postsData.put("posts", compiledPostHistory);

            if (!compiledPostHistory.isEmpty()) {
                // Sort chat history by timestamp if needed
                Collections.sort(compiledPostHistory, (msg1, msg2) -> {
                    // Compare timestamps, adjust logic according to your needs
                    // Example: return Long.compare(msg1.getTimestamp(), msg2.getTimestamp());
                    return 0;
                });

                return ResponseEntity.ok(postsData);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyMap());
            }
        } catch (Exception e) {
            e.printStackTrace(); // This will print the stack trace to the console

            // You can also log the exception message
            System.err.println("Exception message: " + e.getMessage());

            // You can log additional information if needed
            System.err.println("Additional information or context...");

            // Return a 401 (Unauthorized) response with an informative message
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Unauthorized. Please check your credentials."));
        }
    }

    @PostMapping("/{postId}/comments")
    public void addCommentToPost(@PathVariable String postId,
                                 @RequestBody Comment comment,
                                 @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix
        System.out.println("Authorization Header: " + authorizationHeader);

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();
        postService.addCommentToPost(postId, comment, usernameFromToken);
    }
    @PostMapping("/like/{postId}")
    public void addLikeToPost(@PathVariable String postId,
                                 @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix
        System.out.println("Authorization Header: " + authorizationHeader);

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();
        postService.addLikeToPost(postId, usernameFromToken);
    }
    @DeleteMapping("/unlike/{postId}")
    public void removeLikeFromPost(@PathVariable String postId, @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", ""); // Remove "Bearer" prefix
        System.out.println("Authorization Header: " + authorizationHeader);

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        postService.removeLikeFromPost(postId, usernameFromToken);
    }
}