package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
@Document(collection = "friendlists")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendLists {
    @Id
    private String id;

    private String username;

    private String friend;

    private List<String> friendLists;


}
