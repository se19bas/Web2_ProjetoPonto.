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
🗄️ PostgreSQL	16+
🌍 PostGIS	3.x
📚 Dependências

Spring Web

Spring Data JPA

Swagger / OpenAPI

Flyway

Lombok

🚀 Como executar o projeto

Antes de iniciar o projeto, siga os passos abaixo.

1. Inicie o PostgreSQL

Certifique-se de que o serviço do PostgreSQL esteja em execução e que a extensão PostGIS esteja instalada.

2. Crie o banco de dados

Execute o seguinte comando no PostgreSQL (psql ou pgAdmin):

CREATE DATABASE projetoponto;

📌 A extensão PostGIS é habilitada automaticamente pelo Flyway (CREATE EXTENSION IF NOT EXISTS postgis). Caso o usuário da aplicação não tenha permissão para criar extensões, execute manualmente no banco projetoponto:

CREATE EXTENSION postgis;

3. Configure o acesso ao banco

As configurações do banco são lidas de variáveis de ambiente (usadas em src/main/resources/application.properties):

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/projetoponto
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=sua_senha
API_SECURITY_TOKEN_SECRET=seu_segredo_jwt

4. Execute o projeto

Com o banco configurado, execute a aplicação utilizando o Maven ou sua IDE de preferência.

🗄️ Download do PostgreSQL / PostGIS

PostgreSQL: https://www.postgresql.org/download/

PostGIS: no Windows, instale pelo Stack Builder que acompanha o instalador do PostgreSQL (Spatial Extensions → PostGIS). Alternativa com Docker: imagem postgis/postgis.

📖 Swagger / OpenAPI

Após iniciar a aplicação, a documentação da API estará disponível através do URL local:

http://localhost:8080/swagger-ui.html

📌 Resumo
Sistema Ponto
│
├── Java 26
├── Maven
├── Spring Boot 4.1.1
├── PostgreSQL 16+ / PostGIS 3.x
│
├── Spring Web
├── Spring Data JPA
├── Swagger / OpenAPI
├── Flyway
└── Lombok

✅ Checklist

 Iniciar o serviço PostgreSQL (com PostGIS)

 Criar o banco projetoponto

 Configurar as variáveis de ambiente do banco e do JWT

 Executar o projeto

 Acessar o Swagger
