CREATE TABLE Aviso (
                       idAviso BIGINT AUTO_INCREMENT PRIMARY KEY,
                       idRegistro BIGINT NOT NULL,
                       idGestor BIGINT NOT NULL,
                       mensagem VARCHAR(500) NOT NULL,
                       status ENUM('NAO_LIDO', 'LIDO') NOT NULL DEFAULT 'NAO_LIDO',

                       CONSTRAINT fk_aviso_registro
                           FOREIGN KEY (idRegistro)
                               REFERENCES RegistroPonto(idRegistroPonto),

                       CONSTRAINT fk_aviso_gestor
                           FOREIGN KEY (idGestor)
                               REFERENCES Gestor(idUsuario)
);
