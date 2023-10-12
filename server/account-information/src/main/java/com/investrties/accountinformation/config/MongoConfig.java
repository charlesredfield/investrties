package com.investrties.accountinformation.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.data.mongodb.MongoDatabaseFactory;




@Configuration
public class MongoConfig {

    @Bean(name = "chatPhotosGridFsTemplate")
    public GridFsTemplate chatPhotosGridFsTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter) {
        return new GridFsTemplate(mongoDbFactory, mongoConverter, "chatPhotos");
    }
    @Bean(name = "chatVideosGridFsTemplate")
    public GridFsTemplate chatVideosGridFsTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter) {
        return new GridFsTemplate(mongoDbFactory, mongoConverter, "chatVideos");
    }
    @Bean(name = "postPhotosGridFsTemplate")
    public GridFsTemplate postPhotosGridFsTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter) {
        return new GridFsTemplate(mongoDbFactory, mongoConverter, "postPhotos");
    }
    @Bean(name = "postVideosGridFsTemplate")
    public GridFsTemplate postVideosGridFsTemplate(MongoDatabaseFactory mongoDbFactory, MongoConverter mongoConverter) {
        return new GridFsTemplate(mongoDbFactory, mongoConverter, "postVideos");
    }

    @Value("${spring.data.mongodb.database}")
    private String databaseName;

    @Bean
    public MongoDatabase mongoDatabase() {
        MongoClient mongoClient = MongoClients.create();
        return mongoClient.getDatabase(databaseName);
    }
}