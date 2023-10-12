package com.investrties.accountinformation.repository;

import com.investrties.accountinformation.model.AccountPost;
import com.investrties.accountinformation.model.AccountUpdates;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface AccountRepositoryPosts extends MongoRepository<AccountPost, String> {

    AccountPost findByUsername(String username);

    List<AccountPost> findAllByUsername(String username, Sort sort);
    List<AccountPost> getPostsByUsername(String username);

}