package cl.aves.observaciones.web;

import cl.aves.observaciones.service.AvistamientoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AvistamientoApiController {
    private final AvistamientoService avistamientoService;

    public AvistamientoApiController(AvistamientoService avistamientoService) {
        this.avistamientoService = avistamientoService;
    }

    @GetMapping("/api/avistamientos")
    public List<AvistamientoResultado> buscar(@RequestParam(defaultValue = "") String q) {
        String termino = q.trim();
        return termino.isEmpty() ? List.of() : avistamientoService.buscar(termino);
    }

    @PostMapping("/api/avistamientos/{id}/notas")
    @ResponseStatus(HttpStatus.CREATED)
    public NotaRespuesta evaluar(
            @PathVariable Integer id,
            @Valid @RequestBody NotaPeticion peticion) {
        return avistamientoService.agregarNota(id, peticion.nota());
    }
}
