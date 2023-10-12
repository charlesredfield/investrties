package com.investrties.accountinformation.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "chatThreads")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatThread {
    @Id
    private String id; // Unique identifier for the chat thread

    @Field("participants")
    private List<String> participants; // Usernames of participants in the chat

    @Field("messages")
    private List<Message> messages; // Array of individual messages

    // Constructors, getters, setters, and other methods as needed
}