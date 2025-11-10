package model;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.model.AdicionalInsalubridade;

class AdicionalNoturnoTest {
    @Test
    void TestGetName(){
        AdicionalInsalubridade noturnoAdicional = new AdicionalInsalubridade();
        assert(noturnoAdicional.getName().equals("ADICIONAL_NOTURNO"));
    }

    @Test
    void TestGetTaxa(){
        AdicionalInsalubridade noturnoAdicional = new AdicionalInsalubridade();
        assert(noturnoAdicional.getValor() == 1200);
    }

    @Test
    void TestCalcular(){
        AdicionalInsalubridade noturnoAdicional = new AdicionalInsalubridade();
        assert(noturnoAdicional.calcular(1000.0) == 2200.0);
    }
}
