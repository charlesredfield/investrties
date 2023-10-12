package com.investrties.accountinformation.services;

import com.investrties.accountinformation.model.FriendLists;
import com.investrties.accountinformation.model.FriendRequests;
import com.investrties.accountinformation.repository.FriendListRepository;
import com.investrties.accountinformation.repository.FriendRequestsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendRequestService {
    @Autowired
    private FriendRequestsRepository friendRequestsRepository;
    @Autowired
    private FriendListRepository friendListRepository;

    public void sendFriendRequest(String senderUsername, String recipientUsername) {
        System.out.println("Received senderUsername: " + senderUsername);
        System.out.println("Received recipientUsername: " + recipientUsername);
        // Fetch the friend requests record for the receiver
        FriendRequests friendRequests = friendRequestsRepository.findByUsername(recipientUsername);
        FriendLists friendLists = friendListRepository.findByUsername(recipientUsername);
        // If the friendRequests record doesn't exist, create a new one
        if (friendRequests == null) {
            friendRequests = new FriendRequests();
            friendRequests.setUsername(recipientUsername);
            friendRequests.setFriendRequestsList(new ArrayList<>());
        }
        if (friendLists != null) { // Check if friendLists is not null
            if (friendLists.getFriendLists().contains(senderUsername)) {
                ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Can't Request More Than Once");
                return; // Exit the method if sender has already sent a request
            }
        } else {

            // Add the sender's username to the friend requests list
            friendRequests.getFriendRequestsList().add(senderUsername);
        }
        // Save or update the friend requests record
        friendRequestsRepository.save(friendRequests);
    }

    public List<FriendRequests> getFriendRequestsByUsername(String username) {
        // Implement the logic to fetch friend requests by username from the repository
        return friendRequestsRepository.findAllByUsername(username);
    }
    public FriendRequests getFriendRequestByUsernameAndSender(String recipientUsername, String senderUsername) {
        // Fetch the friend requests record for the recipient
        FriendRequests friendRequests = friendRequestsRepository.findByUsername(recipientUsername);

        // Check if the friendRequests record exists
        if (friendRequests != null) {
            // Check if the senderUsername exists in the friendRequestsList
            if (friendRequests.getFriendRequestsList().contains(senderUsername)) {
                return friendRequests;
            }
        }

        return null; // Handle the case where the request is not found
    }
    public void removeFriendRequest(String senderUsername, String usernameFromToken) {
        // Fetch the friend requests record for the receiver
        FriendRequests friendRequests = friendRequestsRepository.findByUsername(usernameFromToken);

        if (friendRequests != null) {
            // Check if the sender's username is in the friend requests list
            if (friendRequests.getFriendRequestsList().contains(senderUsername)) {
                // Log values before removal
                System.out.println("Before Removal: " + friendRequests.getFriendRequestsList());

                // Remove the sender's username from the list
                friendRequests.getFriendRequestsList().remove(senderUsername);

                // Log values after removal
                System.out.println("After Removal: " + friendRequests.getFriendRequestsList());

                // Save or update the friend requests record
                friendRequestsRepository.save(friendRequests);
            } else {
                // Log a message if the sender's username is not found
                System.out.println("Sender not found in friend requests list");
            }
        } else {
            // Log a message if the friend requests record is not found
            System.out.println("Friend requests record not found for the receiver");
        }
    }

}
