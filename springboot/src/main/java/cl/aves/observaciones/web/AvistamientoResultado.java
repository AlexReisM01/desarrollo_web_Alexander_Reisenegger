package cl.aves.observaciones.web;

import java.time.LocalDateTime;

public record AvistamientoResultado(
        Integer id,
        LocalDateTime fechaHora,
        String ave,
        String voluntario,
        String comuna,
        Double promedio) {
}
