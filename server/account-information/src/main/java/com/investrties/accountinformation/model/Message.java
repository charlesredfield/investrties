package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Message {
    @Field("senderUsername")
    private String senderUsername;

    @Field("recipientUsername")
    private String recipientUsername;

    @Field("message")
    private String messageContent;

    @Field("photoId")
    private String photoId;

    @Field("videoId")
    private String videoId;

    private byte[] photo;
    private byte[] video;

    @Temporal(TemporalType.TIMESTAMP)
    @Field("timestamp")
    private Date timestamp;

    // Constructors, getters, setters, and other methods as needed
}