🕐 Sistema Ponto

Sistema desenvolvido para gerenciamento e registro de ponto.

👨‍💻 Desenvolvedores

Vitorio Ernesto Dagnoni

Sebastian Valentino Filio Cano

⚙️ Tecnologias e Configurações
Tecnologia	Versão
☕ Java	26
📦 Maven	—
🌱 Spring Boot	4.1.1
🗄️ MySQL	9.4
📚 Dependências

Spring Web

Spring Data JPA

Swagger / OpenAPI

Flyway

Lombok

🚀 Como executar o projeto

Antes de iniciar o projeto, siga os passos abaixo.

1. Inicie o MySQL

Certifique-se de que o serviço do MySQL esteja em execução.

2. Crie o banco de dados

Execute o seguinte comando no MySQL:

CREATE DATABASE projetoponto;

3. Configure o acesso ao banco

As configurações de porta, usuário e senha do banco de dados estão no arquivo:

src/main/resources/application.properties


📌 As configurações principais estão nas linhas 3 a 5.

4. Execute o projeto

Com o banco configurado, execute a aplicação utilizando o Maven ou sua IDE de preferência.

🗄️ Download do MySQL

Caso ainda não tenha o MySQL instalado, faça o download pelo arquivo oficial de versões:

https://downloads.mysql.com/archives/community/

⚠️ Atenção: verifique se a versão instalada é compatível com a versão utilizada no projeto (MySQL 9.4).

📖 Swagger / OpenAPI

Após iniciar a aplicação, a documentação da API estará disponível através do URL local:

http://localhost:8080/swagger-ui.html

📌 Resumo
Sistema Ponto
│
├── Java 26
├── Maven
├── Spring Boot 4.1.1
├── MySQL 9.4
│
├── Spring Web
├── Spring Data JPA
├── Swagger / OpenAPI
├── Flyway
└── Lombok

✅ Checklist

 Iniciar o serviço MySQL

 Criar o banco projetoponto

 Conferir usuário, senha e porta no application.properties

 Executar o projeto

 Acessar o Swagger
