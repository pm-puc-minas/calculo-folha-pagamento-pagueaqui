package model;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.model.AdicionalInsalubridade;

class AdicionalInsalubridadeTest {
    @Test
    void TestGetName(){
        AdicionalInsalubridade insalubridadeAdicional = new AdicionalInsalubridade();
        assert(insalubridadeAdicional.getName().equals("ADICIONAL_INSALUBRIDADE"));
    }

    @Test
    void TestGetTaxa(){
        AdicionalInsalubridade insalubridadeAdicional = new AdicionalInsalubridade();
        assert(insalubridadeAdicional.getValor() == 400);
    }

    @Test
    void TestCalcular(){
        AdicionalInsalubridade insalubridadeAdicional = new AdicionalInsalubridade();
        assert(insalubridadeAdicional.calcular(1000.0) == 1400.0);
    }
}
