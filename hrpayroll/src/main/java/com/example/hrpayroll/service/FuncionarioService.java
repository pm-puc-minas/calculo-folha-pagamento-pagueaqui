package com.example.hrpayroll.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.example.hrpayroll.calculo.ICalculoSalarioComponente;
import com.example.hrpayroll.dto.FuncionarioCreateDTO;
import com.example.hrpayroll.model.*;
import com.example.hrpayroll.repository.IFuncionarioRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class FuncionarioService {

    private final IFuncionarioRepository IFuncionarioRepository;
    private final DescontosService descontoService;
    private final AdicionalService adicionalService;
    private final BankInfoService bankInfoService;
    private final CargoService cargoService;
    private final ProventosService proventosService;

    public FuncionarioService(
            IFuncionarioRepository IFuncionarioRepository,
            DescontosService descontoService,
            AdicionalService adicionalService,
            BankInfoService bankInfoService,
            CargoService cargoService,
            ProventosService proventosService) {
        this.IFuncionarioRepository = IFuncionarioRepository;
        this.descontoService = descontoService;
        this.adicionalService = adicionalService;
        this.bankInfoService = bankInfoService;
        this.cargoService = cargoService;
        this.proventosService = proventosService;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemCalculadoDTO {
        private String descricao;
        private TipoItemFolha tipo;
        private BigDecimal valor;
    }

    public FuncionarioModel create(FuncionarioCreateDTO funcionario) {
        BankInfoModel bankInfoModel = bankInfoService.create(funcionario.getBanco());
        CargoModel cargo = cargoService.findById(funcionario.getCargoId());

        FuncionarioModel entity = new FuncionarioModel();
        entity.setNome(funcionario.getNome());
        entity.setSobrenome(funcionario.getSobrenome());
        entity.setEmail(funcionario.getEmail());
        entity.setEmailProfissional(funcionario.getEmailProfissional());
        entity.setEstadoCivil(funcionario.getEstadoCivil());
        entity.setGenero(funcionario.getGenero());
        entity.setCpf(funcionario.getCpf());
        entity.setNacionalidade(funcionario.getNacionalidade());
        entity.setRg(funcionario.getRg());
        entity.setPis(funcionario.getPis());
        entity.setTelefone(funcionario.getTelefone());

        entity.setBancoInfoModel(bankInfoModel);

        entity.setCep(funcionario.getCep());
        entity.setCidade(funcionario.getCidade());
        entity.setBairro(funcionario.getBairro());
        entity.setEstado(funcionario.getEstado());
        entity.setNumero(funcionario.getNumero());
        entity.setRua(funcionario.getRua());

        entity.setCargo(cargo);

        entity.setDataDeNascimento(funcionario.getDataDeNascimento());
        entity.setDataDeAdmissao(funcionario.getDataDeAdmissao());

        entity.setSenha(funcionario.getSenha());

        entity = IFuncionarioRepository.save(entity);

        ProventosModel proventosModel = new ProventosModel();
        proventosModel.setFuncionario(entity);

        proventosModel = proventosService.create(proventosModel);
        entity.setProventos(proventosModel);

        entity = IFuncionarioRepository.save(entity);

        return entity;
    }

    public List<FuncionarioModel> list() {
        return IFuncionarioRepository.findAll();
    }

    public List<FuncionarioModel> findByCompanyId(Long companyId) {
        return IFuncionarioRepository.findByCargo_Departamento_Company_Id(companyId);
    }

    public FuncionarioModel findOneById(Long id) {
        Optional<FuncionarioModel> funcionario = IFuncionarioRepository.findById(id);

        if (funcionario.isPresent()) {
            return funcionario.get();
        }

        return null;
    }

    public FuncionarioModel atualizarCadastro(Long id, FuncionarioModel novosDados) {
        Optional<FuncionarioModel> usuarioOpt = IFuncionarioRepository.findById(id);

        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }

        FuncionarioModel usuario = usuarioOpt.get();

        usuario.setNome(novosDados.getNome());
        usuario.setSobrenome(novosDados.getSobrenome());
        usuario.setEmail(novosDados.getEmail());
        usuario.setDataDeNascimento(novosDados.getDataDeNascimento());

        return IFuncionarioRepository.save(usuario);
    }

    private class CalculoBase implements ICalculoSalarioComponente {
        @Override
        public Double calcular(Double salarioAtual, Double salarioBase) {
            return salarioAtual;
        }
    }

    // MÉTODO QUE RETORNA DETALHES DA FOLHA (Substitui a lógica de retorno de apenas Double)
    public List<ItemCalculadoDTO> getCalculoDetalhado(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário com ID " + id + " não encontrado.");
        }

        if (funcionario.getCargo() == null || funcionario.getProventos() == null) {
            throw new IllegalStateException("Funcionário com ID " + id + " não possui cargo ou proventos atribuídos.");
        }

        ProventosModel proventos = funcionario.getProventos();
        Double salarioBaseDouble = funcionario.getCargo().getSalarioBase();
        BigDecimal salarioBruto = BigDecimal.valueOf(salarioBaseDouble).setScale(2, RoundingMode.HALF_UP);

        List<ItemCalculadoDTO> itensCalculados = new ArrayList<>();

        // 1. PROVENTO PRINCIPAL
        itensCalculados.add(new ItemCalculadoDTO("Salário Base", TipoItemFolha.PROVENTO, salarioBruto));

        // 2. DESCONTO: INSS
        Double descontoInssDouble = descontoService.calcularINSS(salarioBaseDouble);
        BigDecimal descontoINSS = BigDecimal.valueOf(descontoInssDouble).setScale(2, RoundingMode.HALF_UP);
        itensCalculados.add(new ItemCalculadoDTO("INSS", TipoItemFolha.DESCONTO, descontoINSS));

        // 3. DESCONTO: IRRF
        Double descontoIrrfDouble = descontoService.calcularIRRF(salarioBaseDouble);
        BigDecimal descontoIRRF = BigDecimal.valueOf(descontoIrrfDouble).setScale(2, RoundingMode.HALF_UP);
        itensCalculados.add(new ItemCalculadoDTO("IRRF", TipoItemFolha.DESCONTO, descontoIRRF));


        // 4. PROVENTOS ADICIONAIS
        if (proventos.getAdicionalNoturno() == true) {
            Double adicionalDouble = adicionalService.calcularAdicionalNoturno(salarioBaseDouble);
            BigDecimal adicionalNoturno = BigDecimal.valueOf(adicionalDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Adicional Noturno", TipoItemFolha.PROVENTO, adicionalNoturno));
        }
        if (proventos.getAdicionalInsalubridade() == true) {
            Double adicionalDouble = adicionalService.calcularAdicionalInsalubridade(salarioBaseDouble);
            BigDecimal adicionalInsalubridade = BigDecimal.valueOf(adicionalDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Adicional Insalubridade", TipoItemFolha.PROVENTO, adicionalInsalubridade));
        }
        if (proventos.getAdicionalPericulosidade() == true) {
            Double adicionalDouble = adicionalService.calcularAdicionalPericulosidade(salarioBaseDouble);
            BigDecimal adicionalPericulosidade = BigDecimal.valueOf(adicionalDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Adicional Periculosidade", TipoItemFolha.PROVENTO, adicionalPericulosidade));
        }
        if (proventos.getHorasExtras() > 0) {
            Double adicionalDouble = adicionalService.calcularAdicionalHorasExtras(proventos.getHorasExtras(), salarioBaseDouble);
            BigDecimal horasExtras = BigDecimal.valueOf(adicionalDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Horas Extras", TipoItemFolha.PROVENTO, horasExtras));
        }

        // 5. DESCONTOS DIVERSOS
        if (proventos.getValeTransporte() == true) {
            Double descontoDouble = descontoService.calcularDescontoValeTransporte(salarioBaseDouble);
            BigDecimal descontoVT = BigDecimal.valueOf(descontoDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Desconto Vale Transporte", TipoItemFolha.DESCONTO, descontoVT));
        }
        if (proventos.getPlanoDeSaude() == true) {
            Double descontoDouble = descontoService.calcularDescontoPlanoDeSaude(salarioBaseDouble);
            BigDecimal descontoPlanoSaude = BigDecimal.valueOf(descontoDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Desconto Plano de Saúde", TipoItemFolha.DESCONTO, descontoPlanoSaude));
        }
        if (proventos.getValeAlimentacaoRefeicao() == true) {
            Double descontoDouble = descontoService.calcularDescontoValeAlimentacao(salarioBaseDouble);
            BigDecimal descontoVA_VR = BigDecimal.valueOf(descontoDouble).setScale(2, RoundingMode.HALF_UP);
            itensCalculados.add(new ItemCalculadoDTO("Desconto Vale Alimentação/Refeição", TipoItemFolha.DESCONTO, descontoVA_VR));
        }

        return itensCalculados;
    }

    // Método original salarioLiquidoById (Mantido, mas recomendado refatorar o código que o usa)
    public Double salarioLiquidoById(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);
        if (funcionario == null) {
            throw new IllegalArgumentException("Funcionário com ID " + id + " não encontrado.");
        }
        if (funcionario.getCargo() == null) {
            throw new IllegalStateException("Funcionário com ID " + id + " não possui cargo atribuído.");
        }

        ProventosModel proventos = funcionario.getProventos();
        Double salarioBruto = funcionario.getCargo().getSalarioBase();
        Double salarioLiquido = salarioBruto;

        ICalculoSalarioComponente calculoINSS = new ICalculoSalarioComponente() {
            private ICalculoSalarioComponente componente = new CalculoBase();
            @Override
            public Double calcular(Double salarioAtual, Double salarioBase) {
                Double desconto = descontoService.calcularINSS(salarioBase);
                return componente.calcular(salarioAtual, salarioBase) - desconto;
            }
        };

        salarioLiquido = calculoINSS.calcular(salarioLiquido, salarioBruto);
        salarioLiquido -= descontoService.calcularIRRF(salarioBruto);

        if (proventos.getAdicionalNoturno() == true) { salarioLiquido += adicionalService.calcularAdicionalNoturno(salarioBruto); }
        if (proventos.getAdicionalInsalubridade() == true) { salarioLiquido += adicionalService.calcularAdicionalInsalubridade(salarioBruto); }
        if (proventos.getAdicionalPericulosidade() == true) { salarioLiquido += adicionalService.calcularAdicionalPericulosidade(salarioBruto); }
        if (proventos.getValeTransporte() == true) { salarioLiquido -= descontoService.calcularDescontoValeTransporte(salarioBruto); }
        if (proventos.getPlanoDeSaude() == true) { salarioLiquido -= descontoService.calcularDescontoPlanoDeSaude(salarioBruto); }
        if (proventos.getValeAlimentacaoRefeicao() == true) { salarioLiquido -= descontoService.calcularDescontoValeAlimentacao(salarioBruto); }
        if (proventos.getHorasExtras() > 0) { salarioLiquido += adicionalService.calcularAdicionalHorasExtras(proventos.getHorasExtras(), salarioBruto); }

        return salarioLiquido;
    }


    public void delete(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);

        if (funcionario != null) {
            IFuncionarioRepository.delete(funcionario);
        }
    }
}