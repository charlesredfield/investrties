package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "friendrequests")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequests {
    @Id
    private String id;

    private String username;

    private String senderUsername;

    private String friendRequests;

    private List<String> friendRequestsList;


}
