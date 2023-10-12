package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Column;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "post")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountPost {
    @Id
    private String id;

    private String username;

    private String post;
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt;
    @Field("photoId")
    private String photoId;

    @Field("videoId")
    private String videoId;

    private byte[] photo;
    private byte[] video;

    private List<Comment> comments = new ArrayList<>();
    private List<String> likes = new ArrayList<>();

    public String getUsername() {
        return username;
    }
    public String getPost() {
        return post;
    }
}

