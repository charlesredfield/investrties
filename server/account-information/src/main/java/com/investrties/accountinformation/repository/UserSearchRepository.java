package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountUpdates;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.investrties.accountinformation.model.SearchResult;

import java.util.List;

public interface UserSearchRepository extends MongoRepository<SearchResult, Long> {
    SearchResult findByUsername(String username);
    List<SearchResult> findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String query, String query2, String query3);
}
