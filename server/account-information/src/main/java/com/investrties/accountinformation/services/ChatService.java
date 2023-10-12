package com.investrties.accountinformation.services;

import com.investrties.accountinformation.model.ChatThread;
import com.investrties.accountinformation.model.Message;
import com.investrties.accountinformation.repository.ChatRepository;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Semaphore;
@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final GridFsTemplate photosGridFsTemplate;
    private final GridFsTemplate videosGridFsTemplate;
    private final Semaphore semaphore = new Semaphore(1);

    @Autowired
    public ChatService(ChatRepository chatRepository,
                       @Qualifier("chatPhotosGridFsTemplate") GridFsTemplate photosGridFsTemplate,
                       @Qualifier("chatVideosGridFsTemplate") GridFsTemplate videosGridFsTemplate) {
        this.photosGridFsTemplate = photosGridFsTemplate;
        this.videosGridFsTemplate = videosGridFsTemplate;
        this.chatRepository = chatRepository;
    }

    public byte[] getPhotoContentById(GridFsTemplate gridFsTemplate, String photoId) throws IOException {
        // Initialize an output stream to collect the photo content
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Use GridFsTemplate to retrieve the photo content and write it to the output stream
        GridFSFile photoFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(photoId)));
        if (photoFile != null) {
            GridFsResource photoResource = gridFsTemplate.getResource(photoFile);
            try (InputStream inputStream = photoResource.getInputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } else {
            throw new FileNotFoundException("Photo not found with ID: " + photoId);
        }

        // Return the photo content as a byte array
        return outputStream.toByteArray();
    }

    public byte[] getVideoContentById(GridFsTemplate gridFsTemplate, String videoId) throws IOException {
        // Initialize an output stream to collect the video content
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Use GridFsTemplate to retrieve the video content and write it to the output stream
        GridFSFile videoFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(videoId)));
        if (videoFile != null) {
            GridFsResource videoResource = gridFsTemplate.getResource(videoFile);
            try (InputStream inputStream = videoResource.getInputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } else {
            throw new FileNotFoundException("Video not found with ID: " + videoId);
        }

        // Return the video content as a byte array
        return outputStream.toByteArray();
    }

    private byte[] getMediaContentById(GridFsTemplate gridFsTemplate, String mediaId) throws IOException {
        GridFsResource resource = gridFsTemplate.getResource(mediaId);

        if (resource != null) {
            try (InputStream inputStream = resource.getInputStream()) {
                return inputStream.readAllBytes();
            }
        }

        return null; // Return null or handle the case where media is not found
    }
    @Transactional
    public ChatThread createChatThread(List<String> participants) {
        Collections.sort(participants);
        ChatThread existingThread = chatRepository.findByParticipants(participants);

        if (existingThread != null) {
            // Return the existing chat thread
            return existingThread;
        } else {
            // Create a new chat thread
            ChatThread chatThread = new ChatThread();
            chatThread.setParticipants(participants);
            chatThread.setMessages(new ArrayList<>()); // Initialize with an empty list of messages

            // Save the chat thread to MongoDB
            return chatRepository.save(chatThread);
        }
    }

    public ChatThread addMessage(String senderUsername, Message message, List<String> participants) {
        Collections.sort(participants);
        // Find the chat thread by ID
        ChatThread chatThread = chatRepository.findByParticipants(participants);

        if (chatThread == null) {
            // Create a new chat thread if it doesn't exist
            chatThread = new ChatThread();
            chatThread.setParticipants(participants); // Set participants
            chatThread.setMessages(new ArrayList<>()); // Initialize the messages list
        }

        // Set the senderUsername in the message
        message.setSenderUsername(senderUsername);

        // Get the list of messages from the chat thread
        List<Message> messages = chatThread.getMessages();

        // Prepend the new message to the list of messages
        messages.add(message);

        // Update and save the chat thread
        chatThread = chatRepository.save(chatThread);

        return chatThread; // Return the ChatThread directly
    }

    public List<Message> getChatHistory(List<String> participants, int messagesPerPage, int offset) throws InterruptedException {
        semaphore.acquire(); // Acquire the semaphore permit
        try {
            return getChatHistoryInternal(participants, messagesPerPage, offset);
        } finally {
            semaphore.release(); // Release the semaphore permit in a finally block
        }
    }

    public List<Message> getChatHistoryWithTimestamp(List<String> participants, int messagesPerPage, int offset, long lastLoadedMessageTimestamp) throws InterruptedException {
        semaphore.acquire(); // Acquire the semaphore permit
        try {
            return getChatHistoryWithTimestampInternal(participants, messagesPerPage, offset, lastLoadedMessageTimestamp);
        } finally {
            semaphore.release(); // Release the semaphore permit in a finally block
        }
    }

    private List<Message> getChatHistoryInternal(List<String> participants, int messagesPerPage, int offset) {
        Collections.sort(participants);
        // Find the chat thread by ID
        ChatThread chatThread = chatRepository.findByParticipants(participants);
        if (chatThread == null) {
            // Handle error (chat thread not found)
            return Collections.emptyList();
        }

        // Retrieve all messages from the chat thread
        List<Message> allMessages = chatThread.getMessages();

        // Calculate the new startIndex and endIndex based on offset and messagesPerPage
        int startIndex = Math.max(0, allMessages.size() - offset - messagesPerPage);
        int endIndex = Math.min(allMessages.size() - offset, allMessages.size());

        if (startIndex >= endIndex) {
            // No older messages to fetch
            return Collections.emptyList();
        }

        // Return the sublist of older messages within the specified range
        return allMessages.subList(startIndex, endIndex);
    }

    private List<Message> getChatHistoryWithTimestampInternal(List<String> participants, int messagesPerPage, int offset, long lastLoadedMessageTimestamp) {
        Collections.sort(participants);
        // Find the chat thread by ID
        ChatThread chatThread = chatRepository.findByParticipants(participants);
        if (chatThread == null) {
            // Handle error (chat thread not found)
            return Collections.emptyList();
        }

        // Retrieve all messages from the chat thread
        List<Message> allMessages = chatThread.getMessages();

        // Calculate the new startIndex and endIndex based on offset and messagesPerPage
        int startIndex = Math.max(0, allMessages.size() - offset - messagesPerPage);
        int endIndex = Math.min(allMessages.size() - offset, allMessages.size());

        if (startIndex >= endIndex) {
            // No older messages to fetch
            return Collections.emptyList();
        }

        // Filter messages to include only those with timestamps greater than the last loaded message
        List<Message> olderMessages = new ArrayList<>();
        for (int i = startIndex; i < endIndex; i++) {
            Message message = allMessages.get(i);
            if (message.getTimestamp().getTime() > lastLoadedMessageTimestamp) {
                olderMessages.add(message);
            }
        }

        return olderMessages;
    }
}
