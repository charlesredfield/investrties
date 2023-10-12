package com.investrties.accountinformation.services;

import com.investrties.accountinformation.repository.UserSearchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.investrties.accountinformation.model.SearchResult;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private UserSearchRepository userSearchRepository;

    public List<SearchResult> search(String query) {
        // Implement the search logic here, e.g., querying a database
        List<SearchResult> results = userSearchRepository.findByUsernameContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query, query);
        return results;
    }
    public byte[] getProfilePicture(String username) {
        // Fetch the profile picture for the specified username from the repository
        SearchResult account = userSearchRepository.findByUsername(username);

        if (account != null) {
            return account.getProfilePicture();
        } else {
            // Return null or an appropriate default image if the user is not found
            return null;
        }
    }

}

