package com.investrties.accountinformation.repository;
import com.investrties.accountinformation.model.FriendLists;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface FriendListRepository extends MongoRepository<FriendLists, String> {
    FriendLists findByUsername(String username);
    List<FriendLists> findAllByUsername(String username);

}