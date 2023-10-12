package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequestResponse {
    private String accept;

    private String decline;

    private String response;

    private String username;
}
