package com.investrties.accountinformation.deserializer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import org.bson.types.Binary;

import java.io.IOException;
import java.util.Base64;

public class BinaryDeserializer extends StdDeserializer<Binary> {
    public BinaryDeserializer() {
        super(Binary.class);
    }

    @Override
    public Binary deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        JsonNode node = p.getCodec().readTree(p);
        String base64Data = node.textValue(); // Read the data as a base64 string
        byte[] data = Base64.getDecoder().decode(base64Data); // Decode base64 to byte array
        return new Binary(data);
    }
}

