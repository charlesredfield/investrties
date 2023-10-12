package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private String username;
    private String comment;

    private byte[] profilePicture;

    // Constructor
    public Comment(String username, String comment) {
        this.username = username;
        this.comment = comment;
    }

    // Getter methods for comment and username
    public String getUsername() {
        return username;
    }

    public String getComment() {
        return comment;
    }

    // Setter method for username
    public void setUsername(String username) {
        this.username = username;
    }

    // Setter method for comment (if needed)
    public void setComment(String comment) {
        this.comment = comment;
    }
}
