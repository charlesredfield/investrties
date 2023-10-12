package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "account")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountLogin {
    @Id
    private ObjectId id;

    private String username;

    private String email;

    private String hashedPassword;

    private String password;

    private String accessToken; // The token itself

    private Date tokenExpiration; // Expiration time of the token

    private Date tokenIssuedAt; // Issuance time of the token

    private String firstName;

    private String lastName;

    private String about;

    private byte[] profilePicture;

    private boolean tokenActive; // Indicates if the token is currently active
    public String getUsername() {
        return username;
    }
    public String getPassword() {
        return hashedPassword;
    }
    public void setPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }
}
