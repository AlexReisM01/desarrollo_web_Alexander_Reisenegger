package cl.aves.observaciones.web;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import cl.aves.observaciones.service.AvistamientoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AvistamientoApiController.class)
class AvistamientoApiControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AvistamientoService avistamientoService;

    @Test
    void rechazaNotasFueraDeRangoYValoresNoEnteros() throws Exception {
        mockMvc.perform(post("/api/avistamientos/1/notas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nota\":0}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/avistamientos/1/notas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nota\":8}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/avistamientos/1/notas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nota\":2.5}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(avistamientoService);
    }

    @Test
    void aceptaUnaNotaValidaYDevuelveElPromedio() throws Exception {
        when(avistamientoService.agregarNota(1, 7)).thenReturn(new NotaRespuesta(7.0));

        mockMvc.perform(post("/api/avistamientos/1/notas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nota\":7}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.promedio").value(7.0));

        verify(avistamientoService).agregarNota(1, 7);
    }
}
