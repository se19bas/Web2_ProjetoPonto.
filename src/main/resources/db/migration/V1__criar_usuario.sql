CREATE TABLE Usuario (
                         idUsuario BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nome VARCHAR(150) NOT NULL,
                         cpf VARCHAR(14) NOT NULL UNIQUE,
                         email VARCHAR(150) NOT NULL UNIQUE,
                         senha VARCHAR(255) NOT NULL,
                         status ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO'
);
