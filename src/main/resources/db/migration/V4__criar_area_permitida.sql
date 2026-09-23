CREATE TABLE AreaPermitida (
                               idAreaPermitida BIGINT AUTO_INCREMENT PRIMARY KEY,
                               nome VARCHAR(150) NOT NULL,
                               latitude DECIMAL(10, 8) NOT NULL,
                               longitude DECIMAL(11, 8) NOT NULL,
                               raio DECIMAL(10, 2) NOT NULL,
                               status ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA'
);
