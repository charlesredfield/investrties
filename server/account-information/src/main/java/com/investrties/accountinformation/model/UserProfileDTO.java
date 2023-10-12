package com.investrties.accountinformation.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "account")
@Data
public class UserProfileDTO {

    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String about;
    private byte[] profilePicture;
    // Add more fields as needed

    // Getter and setter methods
}
