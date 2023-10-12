package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountUpdates;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProfilePictureRepository extends MongoRepository<AccountUpdates, String> {
}
