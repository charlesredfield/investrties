package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.FriendLists;
import com.investrties.accountinformation.model.UserFriendWithProfilePicture;
import com.investrties.accountinformation.model.UserProfileDTO;
import com.investrties.accountinformation.repository.FriendListRepository;
import com.investrties.accountinformation.repository.FriendRequestsRepository;
import com.investrties.accountinformation.services.FriendListService;
import com.investrties.accountinformation.services.FriendRequestService;
import com.investrties.accountinformation.services.UserProfileService;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FriendListController {
    private final FriendRequestService friendRequestService;
    private final Key key;
    private final FriendListRepository friendListRepository;
    private final FriendRequestsRepository friendRequestsRepository;
    private final FriendListService friendListService;
    private final UserProfileService userProfileService;

    @Autowired
    public FriendListController(FriendRequestService friendRequestService, UserProfileService userProfileService, Key key, FriendListRepository friendListRepository, FriendListService friendListService, FriendRequestsRepository friendRequestsRepository) {
        this.key = key;
        this.friendRequestService = friendRequestService;
        this.friendListRepository = friendListRepository;
        this.friendRequestsRepository = friendRequestsRepository;
        this.friendListService = friendListService;
        this.userProfileService = userProfileService;
    }
    @GetMapping("/friendlists")
    public ResponseEntity<List<FriendLists>> getFriendLists(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Fetch friend requests associated with the username
        List<FriendLists> friendLists = friendListService.getFriendListByUsername(usernameFromToken);

        // Return the friend requests as a response
        return ResponseEntity.ok(friendLists);
    }
    @GetMapping("/user-friends-with-profile-pictures")
    public ResponseEntity<List<UserFriendWithProfilePicture>> getUserFriendsWithProfilePictures(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Fetch friend list associated with the username
        List<FriendLists> friendList = friendListService.getFriendListByUsername(usernameFromToken);

// Fetch user details and profile pictures for each friend
        List<UserFriendWithProfilePicture> userFriendsWithProfilePictures = new ArrayList<>();
        for (FriendLists friendLists : friendList) {
            for (String friendUsername : friendLists.getFriendLists()) {
                UserProfileDTO account = userProfileService.getUserProfile(friendUsername);
                if (account != null) {
                    UserFriendWithProfilePicture userFriend = new UserFriendWithProfilePicture();
                    userFriend.setUsername(account.getUsername());
                    userFriend.setProfilePicture(account.getProfilePicture());
                    userFriendsWithProfilePictures.add(userFriend);
                }
            }
        }

        // Return the list of user's friends with profile pictures as a response
        return ResponseEntity.ok(userFriendsWithProfilePictures);
    }
    @GetMapping("/{username}/friendslist")
    public ResponseEntity<List<UserFriendWithProfilePicture>> getUserFriends(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable String username) {
        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String usernameFromToken = claimsJws.getBody().getSubject();

        // Fetch friend list associated with the username
        List<FriendLists> friendList = friendListService.getFriendListByUsername(username);

        // Check if usernameFromToken is in any friend list
        boolean isFriend = false;
        for (FriendLists friendLists : friendList) {
            if (friendLists.getFriendLists().contains(usernameFromToken)) {
                isFriend = true;
                break; // Exit the loop early if a match is found
            }
        }

        if (isFriend) {
            // Fetch user details and profile pictures for each friend
            List<UserFriendWithProfilePicture> userFriendsWithProfilePictures = new ArrayList<>();
            for (FriendLists friendLists : friendList) {
                for (String friendUsername : friendLists.getFriendLists()) {
                    UserProfileDTO account = userProfileService.getUserProfile(friendUsername);
                    if (account != null) {
                        UserFriendWithProfilePicture userFriend = new UserFriendWithProfilePicture();
                        userFriend.setUsername(account.getUsername());
                        userFriend.setProfilePicture(account.getProfilePicture());
                        userFriendsWithProfilePictures.add(userFriend);
                    }
                }
            }

            // Return the list of user's friends with profile pictures as a response
            return ResponseEntity.ok(userFriendsWithProfilePictures);
        } else {
            // Handle the case where usernameFromToken is not in the friend lists
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
