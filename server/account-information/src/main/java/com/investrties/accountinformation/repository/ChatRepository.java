package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.ChatThread;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<ChatThread, String> {
    ChatThread findByParticipants(List<String> participants);
    // Define custom queries if needed
}

