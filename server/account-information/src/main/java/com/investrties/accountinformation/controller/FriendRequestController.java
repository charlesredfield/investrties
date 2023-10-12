package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.FriendRequestResponse;
import com.investrties.accountinformation.model.FriendRequests;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.repository.FriendListRepository;
import com.investrties.accountinformation.repository.FriendRequestsRepository;
import com.investrties.accountinformation.services.FriendListService;
import com.investrties.accountinformation.services.FriendRequestService;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class FriendRequestController {
    private final FriendRequestService friendRequestService;
    private final Key key;
    private final FriendListRepository friendListRepository;
    private final FriendRequestsRepository friendRequestsRepository;
    private final FriendListService friendListService;

    @Autowired
    public FriendRequestController(FriendRequestService friendRequestService, Key key, FriendListRepository friendListRepository, FriendListService friendListService, FriendRequestsRepository friendRequestsRepository) {
        this.key = key;
        this.friendRequestService = friendRequestService;
        this.friendListRepository = friendListRepository;
        this.friendRequestsRepository = friendRequestsRepository;
        this.friendListService = friendListService;
    }

    @PostMapping("/friendrequest")
    public ResponseEntity<?> sendFriendRequest(@RequestBody FriendRequests request, @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        {

            Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
            String senderUsername = claimsJws.getBody().getSubject();
            String recipientUsername = request.getUsername();
            System.out.println("Received senderUsername: " + senderUsername);
            System.out.println("Received recipientUsername: " + recipientUsername);


            // Send the friend request
            friendRequestService.sendFriendRequest(senderUsername, recipientUsername);

            return ResponseEntity.ok("Friend request sent successfully");
        }
    }
    @GetMapping("/friendrequestlist")
    public ResponseEntity<List<FriendRequests>> getFriendRequests(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Fetch friend requests associated with the username
        List<FriendRequests> friendRequests = friendRequestService.getFriendRequestsByUsername(usernameFromToken);

        // Return the friend requests as a response
        return ResponseEntity.ok(friendRequests);
    }
    @PostMapping("/friendrequestresponse")
    public ResponseEntity<?> handleFriendRequestResponse(
            @RequestBody FriendRequestResponse response,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        String responseType = response.getResponse();
        if (!responseType.equals("accept") && !responseType.equals("decline")) {
            return ResponseEntity.badRequest().body("Invalid response type");
        }

        // Extract the sender's username from the response object
        String senderUsername = response.getUsername();


        // Fetch the friend request associated with the usernameFromToken and the response sender's username
        if (responseType.equals("accept")) {
            // Accept the friend request
            friendListService.addToFriendList(usernameFromToken, senderUsername);
            friendListService.addToFriendList(senderUsername, usernameFromToken);
            friendRequestService.removeFriendRequest(senderUsername, usernameFromToken);
        } else if (responseType.equals("decline")) {
            // Decline the friend request
            friendRequestService.removeFriendRequest(senderUsername, usernameFromToken);
        }
        return ResponseEntity.ok("Friend request response handled successfully");
    }

}