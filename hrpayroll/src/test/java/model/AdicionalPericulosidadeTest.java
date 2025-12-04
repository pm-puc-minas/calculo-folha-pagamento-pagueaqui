package model;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.model.AdicionalPericulosidade;

class AdicionalPericulosidadeTest {
    @Test
    void TestGetName(){
        AdicionalPericulosidade periculosidadeAdicional = new AdicionalPericulosidade();
        assert(periculosidadeAdicional.getName().equals("ADICIONAL_PERICULOSIDADE"));
    }

    @Test
    void TestGetTaxa(){
        AdicionalPericulosidade periculosidadeAdicional = new AdicionalPericulosidade();
        assert(periculosidadeAdicional.getValor() == 750);
    }

    @Test
    void TestCalcular(){
        AdicionalPericulosidade periculosidadeAdicional = new AdicionalPericulosidade();
        assert(periculosidadeAdicional.calcular(1000.0) == 1750.0);
    }
}
