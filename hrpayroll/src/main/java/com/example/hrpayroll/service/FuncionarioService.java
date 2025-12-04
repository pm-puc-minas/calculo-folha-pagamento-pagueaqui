package com.example.hrpayroll.service;

import java.util.List;
import java.util.Optional;

import com.example.hrpayroll.dto.FuncionarioCreateDTO;
import com.example.hrpayroll.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import com.example.hrpayroll.repository.IFuncionarioRepository;

@Service
public class FuncionarioService {

        @Autowired
        private IFuncionarioRepository IFuncionarioRepository;

        @Autowired
        private DescontosService descontoService;

        @Autowired
        private AdicionalService adicionalService;

        @Autowired
        private BankInfoService bankInfoService;

        @Autowired
        private CargoService cargoService;

        @Autowired
        private ProventosService proventosService;

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

        salarioLiquido -= descontoService.calcularINSS(salarioBruto);
        
        salarioLiquido -= descontoService.calcularIRRF(salarioBruto);

        if (proventos.getAdicionalNoturno() == true) {
            salarioLiquido += adicionalService.calcularAdicionalNoturno(salarioBruto);
        }

        if (proventos.getAdicionalInsalubridade() == true) {
            salarioLiquido += adicionalService.calcularAdicionalInsalubridade(salarioBruto);
        }

        if (proventos.getAdicionalPericulosidade() == true) {
            salarioLiquido += adicionalService.calcularAdicionalPericulosidade(salarioBruto);
        }

        if (proventos.getValeTransporte() == true) {
            salarioLiquido -= descontoService.calcularDescontoValeTransporte(salarioBruto);
        }

        if (proventos.getPlanoDeSaude() == true) {
            salarioLiquido -= descontoService.calcularDescontoPlanoDeSaude(salarioBruto);
        }

        if (proventos.getValeAlimentacaoRefeicao() == true) {
            salarioLiquido -= descontoService.calcularDescontoValeAlimentacao(salarioBruto);
        }

        if (proventos.getHorasExtras() > 0) {
            salarioLiquido += adicionalService.calcularAdicionalHorasExtras(proventos.getHorasExtras(), salarioBruto);
        }

        return salarioLiquido;

    }

    public void delete(Long id) {
        FuncionarioModel funcionario = this.findOneById(id);

        if (funcionario != null) {
            IFuncionarioRepository.delete(funcionario);
        }
    }
}
