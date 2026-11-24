package cl.aves.observaciones.web;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NotaPeticion(
        @JsonDeserialize(using = EnteroEstrictDeserializer.class)
        @NotNull @Min(1) @Max(7) Integer nota) {
}
