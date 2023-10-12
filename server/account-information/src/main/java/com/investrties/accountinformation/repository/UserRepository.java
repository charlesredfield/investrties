package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.UserProfileDTO;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<UserProfileDTO, Long> {
    // Define custom query methods if needed
    UserProfileDTO findByUsername(String username);
    UserProfileDTO findByEmail(String email);
    // Add more query methods as per your requirements
}
