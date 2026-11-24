package cl.aves.observaciones.repository;

import cl.aves.observaciones.model.Nota;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    @Query("""
            SELECT n.avistamiento.id AS avistamientoId, AVG(n.valor) AS promedio
            FROM Nota n
            WHERE n.avistamiento.id IN :avistamientoIds
            GROUP BY n.avistamiento.id
            """)
    List<NotaPromedio> promediosPorAvistamiento(@Param("avistamientoIds") Collection<Integer> avistamientoIds);

    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.avistamiento.id = :avistamientoId")
    Double promedioPorAvistamiento(@Param("avistamientoId") Integer avistamientoId);
}
