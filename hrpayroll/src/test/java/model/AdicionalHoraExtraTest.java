package model;

import org.junit.jupiter.api.Test;

import com.example.hrpayroll.model.AdicionalHoraExtra;

class AdicionalHoraExtraTest {
    @Test
    void TestGetName(){
        AdicionalHoraExtra horaExtraAdicional = new AdicionalHoraExtra();
        assert(horaExtraAdicional.getName().equals("ADICIONAL_HORA_EXTRA"));
    }

    @Test
    void TestGetTaxa(){
        AdicionalHoraExtra horaExtraAdicional = new AdicionalHoraExtra();
        assert(horaExtraAdicional.getValor() == 800);
    }

    @Test
    void TestCalcular(){
        AdicionalHoraExtra horaExtraAdicional = new AdicionalHoraExtra();
        assert(horaExtraAdicional.calcular(1000.0) == 1800.0);
    }
}
