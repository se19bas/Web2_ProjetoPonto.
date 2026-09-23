CREATE TABLE Funcionario (
                             idUsuario BIGINT PRIMARY KEY,
                             idGestor BIGINT NULL,

                             CONSTRAINT fk_funcionario_usuario
                                 FOREIGN KEY (idUsuario)
                                     REFERENCES Usuario(idUsuario)
);
