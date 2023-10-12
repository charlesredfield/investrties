package com.investrties.accountinformation.model;

import com.investrties.accountinformation.deserializer.BinaryDeserializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Document(collection = "account")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountUpdates {
    @Id
    private String id;

    private String username;

    private String email;

    private String hashedPassword;

    private String firstName;

    private String lastName;

    private String about;

    private byte[] profilePicture;

    private byte[] banner;

    // Other getters and setters as needed
    public AccountUpdates(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }
    public String getId() {
        return id;
    }

    // Getters and setters for other properties

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }
}
