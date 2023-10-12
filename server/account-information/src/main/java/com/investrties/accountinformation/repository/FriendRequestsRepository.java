package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.FriendRequests;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FriendRequestsRepository extends MongoRepository<FriendRequests, String> {
    FriendRequests findByUsername(String username);
    List<FriendRequests> findAllByUsername(String username);
}

