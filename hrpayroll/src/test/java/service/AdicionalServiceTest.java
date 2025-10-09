package service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.service.AdicionalService;

    class AdicionalServiceTest {

        private final AdicionalService adicionalService = new AdicionalService();

        @Test
        void testCalcularAdicionalNoturno() {
            Double salario = 3000.0;
            Double esperado = salario + (salario * 0.20);
            Double resultado = adicionalService.calcularAdicionalNoturno(salario);
            assertEquals(esperado, resultado, 0.001);
        }

        @Test
        void testCalcularAdicionalInsalubridade() {
            Double salario = 3000.0;
            Double esperado = salario + (1.518 * 0.20);
            Double resultado = adicionalService.calcularAdicionalInsalubridade(salario);
            assertEquals(esperado, resultado, 0.001);
        }
    }