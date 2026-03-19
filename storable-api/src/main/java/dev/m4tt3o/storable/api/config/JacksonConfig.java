package dev.m4tt3o.storable.api.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import dev.m4tt3o.storable.core.service.GlobalTimeProvider;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Jackson JSON serialization.
 */
@Configuration
@RequiredArgsConstructor
public class JacksonConfig {

    private final GlobalTimeProvider globalTimeProvider;

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> {
            builder.serializerByType(
                LocalDateTime.class,
                new GlobalLocalDateTimeSerializer(globalTimeProvider)
            );
        };
    }

    /**
     * Serializer that converts LocalDateTime from UTC to the global system timezone.
     */
    @RequiredArgsConstructor
    private static class GlobalLocalDateTimeSerializer
        extends JsonSerializer<LocalDateTime>
    {

        private final GlobalTimeProvider globalTimeProvider;
        private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        @Override
        public void serialize(
            LocalDateTime value,
            JsonGenerator gen,
            SerializerProvider serializers
        ) throws IOException {
            if (value == null) {
                gen.writeNull();
                return;
            }
            // All dates in DB are UTC, shift to the target ZoneId
            ZoneId targetZone = globalTimeProvider.getZoneId();
            LocalDateTime offsetDateTime = value
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(targetZone)
                .toLocalDateTime();

            gen.writeString(offsetDateTime.format(FORMATTER));
        }
    }
}
