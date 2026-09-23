CREATE TABLE RegistroPonto (
                               idRegistroPonto BIGINT AUTO_INCREMENT PRIMARY KEY,
                               idFuncionario BIGINT NOT NULL,
                               idAreaPermitida BIGINT NULL,
                               data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               tipo ENUM(
                                   'ENTRADA',
                                   'SAIDA',
                                   'INICIO_INTERVALO',
                                   'FIM_INTERVALO'
                                   ) NOT NULL,
                               latitude DECIMAL(10, 8) NOT NULL,
                               longitude DECIMAL(11, 8) NOT NULL,
                               distancia_area DECIMAL(10, 2),
                               dentro_area BOOLEAN NOT NULL,

                               CONSTRAINT fk_registro_funcionario
                                   FOREIGN KEY (idFuncionario)
                                       REFERENCES Funcionario(idUsuario),

                               CONSTRAINT fk_registro_area
                                   FOREIGN KEY (idAreaPermitida)
                                       REFERENCES AreaPermitida(idAreaPermitida)
);
