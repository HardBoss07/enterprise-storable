package dev.m4tt3o.storable.api.request;

import lombok.Data;

@Data
public class CreateFolderRequest {
    private String name;
    private Long parentId;
}
