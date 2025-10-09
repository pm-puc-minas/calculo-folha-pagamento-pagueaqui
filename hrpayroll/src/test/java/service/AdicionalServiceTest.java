package service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.service.AdicionalService;

class AdicionalServiceTest {

    private final AdicionalService adicionalService = new AdicionalService();

    @Test
    void testCalcularAdicionalPericulosidade() {
        Double salario = 3000.0;
        Double resultado = adicionalService.calcularAdicionalPericulosidade(salario);
        assertEquals(3900.0, resultado);
    }

    @Test
    void testCalcularAdicionalHorasExtras() {
        Long horasExtras = 10L;
        Double salarioLiquido = 3000.0;
        Double resultado = adicionalService.calcularAdicionalHorasExtras(horasExtras, salarioLiquido);
        assertEquals(3272.72727272727275, resultado);
    }
}