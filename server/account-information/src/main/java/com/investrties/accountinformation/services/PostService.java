package com.investrties.accountinformation.services;

import com.investrties.accountinformation.model.AccountPost;
import com.investrties.accountinformation.model.AccountUpdates;
import com.investrties.accountinformation.model.Comment;
import com.investrties.accountinformation.repository.AccountRepositoryPosts;
import com.investrties.accountinformation.repository.AccountRepositoryUpdates;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class PostService {
    private final AccountRepositoryPosts postRepository;
    private final AccountRepositoryUpdates accountRepositoryUpdates;

    @Autowired
    public PostService(AccountRepositoryPosts postRepository, AccountRepositoryUpdates accountRepositoryUpdates) {
        this.postRepository = postRepository;
        this.accountRepositoryUpdates = accountRepositoryUpdates;
    }


    public void addCommentToPost(String postId, Comment comment, String usernameFromToken) {
        AccountUpdates account = accountRepositoryUpdates.findByUsername(usernameFromToken);
        AccountPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // Set the username for the comment
        comment.setUsername(usernameFromToken);
        comment.setProfilePicture(account.getProfilePicture());
        post.getComments().add(comment);
        postRepository.save(post);
    }

    public void addLikeToPost(String postId, String usernameFromToken) {
        AccountPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.getLikes().add(usernameFromToken);
        postRepository.save(post);
    }
    public void removeLikeFromPost(String postId, String usernameFromToken) {
        AccountPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        post.getLikes().remove(usernameFromToken);
        postRepository.save(post);
    }
    public List<AccountPost> getPostsByUsername(String username) {
        return postRepository.getPostsByUsername(username);
    }
    public byte[] getPhotoContentById(GridFsTemplate gridFsTemplate, String photoId) throws IOException {
        // Initialize an output stream to collect the photo content
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Use GridFsTemplate to retrieve the photo content and write it to the output stream
        GridFSFile photoFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(photoId)));

        if (photoFile != null) {
            GridFsResource photoResource = gridFsTemplate.getResource(photoFile);
            try (InputStream inputStream = photoResource.getInputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } else {
            throw new FileNotFoundException("Photo not found with ID: " + photoId);
        }

        // Return the photo content as a byte array
        return outputStream.toByteArray();
    }

    public byte[] getVideoContentById(GridFsTemplate gridFsTemplate, String videoId) throws IOException {
        // Initialize an output stream to collect the video content
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Use GridFsTemplate to retrieve the video content and write it to the output stream
        GridFSFile videoFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(videoId)));
        if (videoFile != null) {
            GridFsResource videoResource = gridFsTemplate.getResource(videoFile);
            try (InputStream inputStream = videoResource.getInputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        } else {
            throw new FileNotFoundException("Video not found with ID: " + videoId);
        }

        // Return the video content as a byte array
        return outputStream.toByteArray();
    }

}
