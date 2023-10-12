package com.investrties.accountinformation.services;

import com.investrties.accountinformation.model.UserProfileDTO;
import com.investrties.accountinformation.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    private final UserRepository userRepository; // You need to define a UserRepository

    @Autowired
    public UserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDTO getUserProfile(String username) {
        // Implement logic to fetch user profile by username from your database or data source
        UserProfileDTO user = userRepository.findByUsername(username);

        if (user != null) {
            // Create a DTO (Data Transfer Object) to represent the user's profile
            UserProfileDTO userProfile = new UserProfileDTO();
            userProfile.setUsername(user.getUsername());
            userProfile.setFirstName(user.getFirstName());
            userProfile.setLastName(user.getLastName());
            userProfile.setAbout(user.getAbout());
            userProfile.setProfilePicture(user.getProfilePicture());
            // Add more fields as needed

            return userProfile;
        }

        return null;
    }
}
