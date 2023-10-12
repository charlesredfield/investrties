package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.Binary;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "account")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountSignup {
    @Id
    private ObjectId id;

    private String username;

    private String firstName;
    private String lastName;
    private String about;

    private String email;

    private String hashedPassword;

    private byte[] profilePicture;

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return hashedPassword;
    }

    public void setPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }
}

