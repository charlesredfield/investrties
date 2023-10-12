package com.investrties.accountinformation.model;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "account")
@Data
    public class SearchResult {
    private String username;
    private String firstName;

    private String lastName;
    private byte[] profilePicture;
    // Add other fields as needed

    // Getters and setters
    public byte[] getProfilePicture() {
        return profilePicture;
    }
}
