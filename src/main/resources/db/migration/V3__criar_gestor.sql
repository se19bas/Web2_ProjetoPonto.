CREATE TABLE Gestor (
                        idUsuario BIGINT PRIMARY KEY,
                        setor VARCHAR(100),

                        CONSTRAINT fk_gestor_funcionario
                            FOREIGN KEY (idUsuario)
                                REFERENCES Funcionario(idUsuario)
);


ALTER TABLE Funcionario
    ADD CONSTRAINT fk_funcionario_gestor
        FOREIGN KEY (idGestor)
            REFERENCES Gestor(idUsuario);
