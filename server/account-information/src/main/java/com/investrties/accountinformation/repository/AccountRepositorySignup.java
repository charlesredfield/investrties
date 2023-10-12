package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountSignup;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepositorySignup extends MongoRepository<AccountSignup, String> {

    AccountSignup findByUsername(String username);
    AccountSignup findByEmail(String email);

}