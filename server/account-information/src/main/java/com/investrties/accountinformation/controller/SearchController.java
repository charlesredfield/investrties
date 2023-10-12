package com.investrties.accountinformation.controller;

import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.SearchRequest;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.investrties.accountinformation.repository.UserSearchRepository;
import com.investrties.accountinformation.utils.Key;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.investrties.accountinformation.services.SearchService;

import com.investrties.accountinformation.model.SearchResult;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SearchController {
    private final UserSearchRepository accountRepository;
    private final SearchService searchService;
    @Autowired
    public SearchController(UserSearchRepository accountRepository, SearchService searchService) {
        this.searchService = searchService;
        this.accountRepository = accountRepository;
    }
    @PostMapping("/search")
    public List<SearchResult> search(@RequestBody SearchRequest request) {
        // Your search logic here
        String query = request.getQuery();
        List<SearchResult> allResults = searchService.search(query);
        int limit = Math.min(5, allResults.size());

        // Fetch profile pictures for the top 5 results
        List<SearchResult> topResults = allResults.subList(0, limit);
        for (SearchResult result : topResults) {
            // Fetch the profile picture for each user
            byte[] profilePicture = searchService.getProfilePicture(result.getUsername());
            // Set the profile picture in the result object
            result.setProfilePicture(profilePicture);
        }

        return topResults;
    }
}