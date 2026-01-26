package dev.m4tt3o.storable.api.controller;

import dev.m4tt3o.storable.core.dto.FileMetadataDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private static final Map<Long, FileMetadataDto> fileNodes;

    static {
        FileMetadataDto root = new FileMetadataDto();
        root.setId(1L);
        root.setName("root");
        root.setPath("/");
        root.setFolder(true);
        root.setCreatedAt(OffsetDateTime.now());
        root.setModifiedAt(OffsetDateTime.now());
        root.setOwnerId(1L);

        FileMetadataDto documents = new FileMetadataDto();
        documents.setId(2L);
        documents.setName("documents");
        documents.setPath("/documents");
        documents.setFolder(true);
        documents.setCreatedAt(OffsetDateTime.now());
        documents.setModifiedAt(OffsetDateTime.now());
        documents.setOwnerId(1L);
        documents.setParentId(1L);

        FileMetadataDto document1 = new FileMetadataDto();
        document1.setId(3L);
        document1.setName("document1.txt");
        document1.setPath("/documents/document1.txt");
        document1.setFolder(false);
        document1.setSize(1024L);
        document1.setCreatedAt(OffsetDateTime.now());
        document1.setModifiedAt(OffsetDateTime.now());
        document1.setOwnerId(1L);
        document1.setParentId(2L);

        fileNodes = Map.of(
                1L, root,
                2L, documents,
                3L, document1
        );
    }

    @GetMapping("/{nodeId}")
    public FileMetadataDto getMetadata(@PathVariable Long nodeId) {
        return fileNodes.get(nodeId);
    }

    @GetMapping("/{nodeId}/children")
    public List<FileMetadataDto> getChildren(@PathVariable Long nodeId) {
        return fileNodes.values().stream()
                .filter(node -> Objects.equals(node.getParentId(), nodeId))
                .collect(Collectors.toList());
    }

    @GetMapping("/path/**")
    public FileMetadataDto getByPath(HttpServletRequest request) {
        String path = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String filePath = path.substring(bestMatchPattern.replace("/**", "").length());

        return fileNodes.values().stream()
                .filter(node -> node.getPath().equals(filePath))
                .findFirst()
                .orElse(null);
    }
}
