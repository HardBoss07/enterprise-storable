package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    // This would be injected, but we don't have the service implementation yet.
    // private final FileService fileService;

    @GetMapping("/{nodeId}")
    public FileMetadataDto getMetadata(@PathVariable String nodeId) {
        // Dummy implementation
        return new FileMetadataDto();
    }

    @GetMapping("/{nodeId}/children")
    public List<FileMetadataDto> getChildren(@PathVariable String nodeId) {
        // Dummy implementation
        return Collections.emptyList();
    }

    @GetMapping("/path/**")
    public FileMetadataDto getByPath(HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String filePath = path.substring(bestMatchPattern.replace("/**", "").length());
        // filePath will be for example "/foldername/folder2/file1.txt"
        // We can now use this path to query the database.

        // Dummy implementation
        FileMetadataDto fileMetadataDto = new FileMetadataDto();
        fileMetadataDto.setPath(filePath);
        return fileMetadataDto;
    }
}
