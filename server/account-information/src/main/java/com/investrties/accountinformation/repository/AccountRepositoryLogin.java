package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountLogin;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AccountRepositoryLogin extends MongoRepository<AccountLogin, String> {

    AccountLogin findByUsername(String username);
    AccountLogin findByEmail(String email);
}