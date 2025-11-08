# 💰 PagueAqui – Sistema de Folha de Pagamento  

O **PagueAqui** é um sistema de gestão de **folha de pagamento** desenvolvido para auxiliar empresas no **cálculo de salários, benefícios, encargos e descontos**, garantindo **transparência** com os colaboradores e **conformidade** com as obrigações trabalhistas e fiscais.  

---

## 📑 Sumário
- [📖 Sobre o Projeto](#-sobre-o-projeto)  
- [🚀 Funcionalidades Principais](#-funcionalidades-principais)  
- [📌 Requisitos Não Funcionais](#-requisitos-não-funcionais)  
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)  
- [📦 Entregas – Sprints](#-entregas--sprints)  

---

## 📖 Sobre o Projeto  
A folha de pagamento é um documento essencial que detalha todos os valores pagos e descontados dos funcionários em um período específico.  
Pensando nisso, o **PagueAqui** foi criado para **automatizar esse processo** e **facilitar o trabalho do setor de RH**.  

---

## 🚀 Funcionalidades Principais  
- 🔐 Autenticação com login e senha (acesso restrito a usuários autorizados)  
- ⏱️ Cálculo de jornada de trabalho  
- ➕ Cálculo de adicionais  
- 🎁 Cálculo de benefícios  
- ➖ Cálculo de descontos  
- 💵 Cálculo de salário líquido  
- 📊 Geração de relatórios completos da folha de pagamento  
- 🗄️ Armazenamento seguro dos dados por até **5 anos**  

---

## 📌 Requisitos Não Funcionais  
- **Usabilidade** → Interface simples e intuitiva  
- **Manutenibilidade** → Arquitetura organizada e de fácil evolução  

---

## 🛠️ Tecnologias Utilizadas  
- **Frontend:** React ⚛️  
- **Backend:** Java com Spring Boot ☕  
- **Banco de Dados:** PostgreSQL 🗃️  
- **Gerenciamento de Dependências:** Maven  
- **Documentação de API:** Swagger (SpringDoc OpenAPI)  
- **Containerização:** Docker e Docker Compose  

---

## 📦 Entregas – Sprints

- 🎨 [Figma](https://www.figma.com/design/vlSw482Gcr3kPkM5rQNaC6/PagueAqui?node-id=1-4&p=f&t=mjGwYE3Rx7nn2pj3-0)  
- 📝 [Cartões CRC](./docs/cartoes-crc.pdf)  
- ✅ [Plano de Testes](./docs/plano-de-testes.pdf)  
- 📐 [UML (arquivo)](./docs/UML.png)
  <img src="./docs/UML.png" alt="Diagrama UML"/>

# API HR-Payroll (PagueAqui)

Documentação da API de backend para o sistema de cálculo de folha de pagamento PagueAqui.

## 1. Instruções de Build e Execução

Este projeto é uma API Spring Boot 3 com Java 21 e Maven. Ele depende de um banco de dados PostgreSQL.

### Pré-requisitos

* Java 21 (JDK)
* Apache Maven
* Docker e Docker Compose (para o banco de dados)

### 1.1. Configuração do Banco de Dados (PostgreSQL)

A forma mais simples de subir o banco de dados é usando o `docker-compose.yml` fornecido na raiz do projeto.

1.  Abra um terminal na raiz do projeto (onde o arquivo `docker-compose.yml` está).
2.  Execute o seguinte comando para iniciar o contêiner do PostgreSQL em segundo plano:

    ```bash
    docker-compose up -d
    ```

    Isso iniciará um banco de dados PostgreSQL na porta `5433`, com o usuário `postgres` e senha `postgres`, conforme configurado no `application.properties`.

### 1.2. Buildando a Aplicação (Maven)

Navegue até o diretório da API (`hrpayroll`) e execute o comando Maven para compilar o projeto e gerar o arquivo `.jar`.

```bash
# Dentro da pasta /hrpayroll
mvn clean install

---

### 🚀 1.3. Executando a API

Após o build ser concluído com sucesso, você pode executar a aplicação de duas formas:

#### ✅ Opção 1: Usando java -jar (Recomendado)
bash
java -jar target/hrpayroll-0.0.1-SNAPSHOT.jar


#### ⚙️ Opção 2: Usando o plugin do Spring Boot
bash
# Dentro da pasta /hrpayroll
mvn spring-boot:run


A API estará disponível em:  
👉 *http://localhost:8080*

---


✨ Projeto desenvolvido com foco em **automação, confiabilidade e escalabilidade**.  
