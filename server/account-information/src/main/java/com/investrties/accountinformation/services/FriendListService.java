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
public class FriendListService {
    @Autowired
    private FriendListRepository friendListRepository;
    public void addToFriendList(String username, String username2) {
        // Fetch the friend requests record for the receiver
        FriendLists friendLists = friendListRepository.findByUsername(username);

        // If the friendRequests record doesn't exist, create a new one
        if (friendLists == null) {
            friendLists = new FriendLists();
            friendLists.setUsername(username);
            friendLists.setFriendLists(new ArrayList<>());
        }
        if (friendLists.getFriendLists().contains(username2)) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Can't Add More Than Once");
        } else {

            // Add the sender's username to the friend requests list
            friendLists.getFriendLists().add(username2);
        }

        // Save or update the friend requests record
        friendListRepository.save(friendLists);
    }
    public List<FriendLists> getFriendListByUsername(String username) {
        // Implement the logic to fetch friend requests by username from the repository
        return friendListRepository.findAllByUsername(username);
    }
}
