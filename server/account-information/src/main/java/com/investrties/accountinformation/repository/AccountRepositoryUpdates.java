package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountUpdates;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepositoryUpdates extends MongoRepository<AccountUpdates, String> {

    AccountUpdates findByUsername(String username);

}