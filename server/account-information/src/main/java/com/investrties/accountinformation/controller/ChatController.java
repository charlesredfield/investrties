package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.ChatThread;
import com.investrties.accountinformation.model.Message;
import com.investrties.accountinformation.repository.ChatRepository;
import com.investrties.accountinformation.services.ChatService;
import com.investrties.accountinformation.utils.Key;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;
    private final ChatRepository chatRepository;
    private final Key key;
    private final GridFsTemplate chatVideosGridFsTemplate;
    private final GridFsTemplate chatPhotosGridFsTemplate;

    @Autowired
    public ChatController(ChatService chatService, Key key, ChatRepository chatRepository,
                          @Qualifier("chatPhotosGridFsTemplate") GridFsTemplate chatPhotosGridFsTemplate,
                          @Qualifier("chatVideosGridFsTemplate") GridFsTemplate chatVideosGridFsTemplate) {
        this.chatService = chatService;
        this.key = key;
        this.chatRepository = chatRepository;
        this.chatVideosGridFsTemplate = chatVideosGridFsTemplate;
        this.chatPhotosGridFsTemplate = chatPhotosGridFsTemplate;
    }
    @Transactional
    @PostMapping("/create")
    public ResponseEntity<ChatThread> createChatThread(
            @RequestBody String username,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String senderUsername = claimsJws.getBody().getSubject();

        List<String> participants = Arrays.asList(username, senderUsername);// Create a List with the two usernames
        System.out.println("Participants: " + participants);
        ChatThread chatThread = chatService.createChatThread(participants);
        if (chatThread != null) {
            return ResponseEntity.ok(chatThread);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/send/{recipientUsername}")
    public ResponseEntity<?> sendMessage(
            @RequestBody Message message,
            @PathVariable String recipientUsername,
            @RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");

        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String senderUsername = claimsJws.getBody().getSubject();

        List<String> participants = Arrays.asList(recipientUsername, senderUsername);

        if (message.getPhoto().length == 0) {
            // It's not a photo
            message.setPhoto(null); // Set photo to null since it's not a photo
            message.setPhotoId(null); // Set photoId to empty string since it's not a photo
        } else {
            // It's a photo
            String photoId = saveMediaToGridFS(chatPhotosGridFsTemplate, message.getPhoto());
            message.setPhotoId(photoId);

            // Set photo to null since we don't want to save binary data in the message
            message.setPhoto(null);
        }

        if (message.getVideo().length == 0) {
            // It's not a video
            message.setVideo(null); // Set video to null since it's not a video
            message.setVideoId(null); // Set videoId to empty string since it's not a video
        } else {
            // It's a video
            String videoId = saveMediaToGridFS(chatVideosGridFsTemplate, message.getVideo());
            message.setVideoId(videoId);

            // Set video to null since we don't want to save binary data in the message
            message.setVideo(null);
        }

        ChatThread updatedChatThread = chatService.addMessage(senderUsername, message, participants);
        if (updatedChatThread != null) {
            return ResponseEntity.ok(updatedChatThread);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chat thread not found or some other error message");
        }
    }

    @GetMapping("/threads/{username}/history")
    public ResponseEntity<?> getChatHistory(
            @PathVariable String username,
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "5") int messagesPerPage,
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(required = false) Long lastLoadedMessageTimestamp
                            ) throws IOException, InterruptedException {

        String token = authorizationHeader.replace("Bearer ", "");
        Jws<Claims> claimsJws = Jwts.parser().setSigningKey(key.getSecretKey()).parseClaimsJws(token);
        String senderUsername = claimsJws.getBody().getSubject();

        List<String> participants = Arrays.asList(username, senderUsername);
        System.out.println("Participants: " + participants);
// Fetch the chat history with pagination and lastLoadedMessageTimestamp
        List<Message> chatHistory;

        if (lastLoadedMessageTimestamp != null) {
            chatHistory = chatService.getChatHistoryWithTimestamp(participants, messagesPerPage, offset, lastLoadedMessageTimestamp);
        } else {
            chatHistory = chatService.getChatHistory(participants, messagesPerPage, offset);
        }

        // Compile chat history with media content
        List<Map<String, Object>> compiledChatHistory = new ArrayList<>();

        for (Message message : chatHistory) {
            Map<String, Object> messageData = new HashMap<>();
            messageData.put("senderUsername", message.getSenderUsername());
            messageData.put("message", message.getMessageContent());

            if (message.getPhotoId() != null) {
                // Fetch photo binary content based on photoId and add to messageData
                byte[] photoContent = chatService.getPhotoContentById(chatPhotosGridFsTemplate, message.getPhotoId());
                messageData.put("photoContent", photoContent); // Add photo binary data
            } else if (message.getVideoId() != null) {
                // Fetch video binary content based on videoId and add to messageData
                byte[] videoContent = chatService.getVideoContentById(chatVideosGridFsTemplate, message.getVideoId());
                messageData.put("videoContent", videoContent); // Add video binary data
            }

            compiledChatHistory.add(messageData);
        }

        // Compile chat thread object
        Map<String, Object> chatThreadData = new HashMap<>();
        chatThreadData.put("participants", participants);
        chatThreadData.put("messages", compiledChatHistory);

        if (!compiledChatHistory.isEmpty()) {
            // Sort chat history by timestamp if needed
            Collections.sort(compiledChatHistory, (msg1, msg2) -> {
                // Compare timestamps, adjust logic according to your needs
                // Example: return Long.compare(msg1.getTimestamp(), msg2.getTimestamp());
                return 0;
            });

            return ResponseEntity.ok(chatThreadData);
        } else {
            // Return an empty array instead of a 404 error
            return ResponseEntity.ok(chatThreadData);
        }
    }
    private String saveMediaToGridFS(GridFsTemplate gridFsTemplate, byte[] mediaData) {
        InputStream inputStream = new ByteArrayInputStream(mediaData);
        return gridFsTemplate.store(inputStream, UUID.randomUUID().toString()).toString();
    }
}
