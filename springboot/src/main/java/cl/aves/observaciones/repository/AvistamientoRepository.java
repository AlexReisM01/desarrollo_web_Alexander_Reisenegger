package cl.aves.observaciones.repository;

import cl.aves.observaciones.model.Avistamiento;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {
    @EntityGraph(attributePaths = {"ave", "voluntario", "voluntario.comuna"})
    @Query("""
            SELECT a FROM Avistamiento a
            JOIN a.ave ave
            JOIN a.voluntario voluntario
            JOIN voluntario.comuna comuna
            WHERE LOCATE(LOWER(:termino), LOWER(ave.nombre)) > 0
               OR LOCATE(LOWER(:termino), LOWER(voluntario.nombre)) > 0
               OR LOCATE(LOWER(:termino), LOWER(comuna.nombre)) > 0
            ORDER BY a.fechaHora DESC
            """)
    List<Avistamiento> buscarPorNombre(@Param("termino") String termino);
}
