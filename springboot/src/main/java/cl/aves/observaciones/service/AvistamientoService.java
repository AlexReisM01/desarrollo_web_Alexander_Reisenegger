package cl.aves.observaciones.service;

import cl.aves.observaciones.model.Avistamiento;
import cl.aves.observaciones.model.Nota;
import cl.aves.observaciones.repository.AvistamientoRepository;
import cl.aves.observaciones.repository.NotaPromedio;
import cl.aves.observaciones.repository.NotaRepository;
import cl.aves.observaciones.web.AvistamientoResultado;
import cl.aves.observaciones.web.NotaRespuesta;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AvistamientoService {
    private final AvistamientoRepository avistamientoRepository;
    private final NotaRepository notaRepository;

    public AvistamientoService(
            AvistamientoRepository avistamientoRepository,
            NotaRepository notaRepository) {
        this.avistamientoRepository = avistamientoRepository;
        this.notaRepository = notaRepository;
    }

    @Transactional(readOnly = true)
    public List<AvistamientoResultado> buscar(String termino) {
        List<Avistamiento> avistamientos = avistamientoRepository.buscarPorNombre(termino);
        if (avistamientos.isEmpty()) {
            return List.of();
        }

        List<Integer> ids = avistamientos.stream().map(Avistamiento::getId).toList();
        Map<Integer, Double> promedios = notaRepository.promediosPorAvistamiento(ids).stream()
                .collect(Collectors.toMap(NotaPromedio::getAvistamientoId, NotaPromedio::getPromedio));

        return avistamientos.stream()
                .map(avistamiento -> new AvistamientoResultado(
                        avistamiento.getId(),
                        avistamiento.getFechaHora(),
                        avistamiento.getAve().getNombre(),
                        avistamiento.getVoluntario().getNombre(),
                        avistamiento.getVoluntario().getComuna().getNombre(),
                        promedios.get(avistamiento.getId())))
                .toList();
    }

    @Transactional
    public NotaRespuesta agregarNota(Integer avistamientoId, Integer valor) {
        if (!avistamientoRepository.existsById(avistamientoId)) {
            throw new EntityNotFoundException("No existe el avistamiento solicitado.");
        }

        Avistamiento avistamiento = avistamientoRepository.getReferenceById(avistamientoId);
        notaRepository.saveAndFlush(new Nota(avistamiento, valor));
        return new NotaRespuesta(notaRepository.promedioPorAvistamiento(avistamientoId));
    }
}
