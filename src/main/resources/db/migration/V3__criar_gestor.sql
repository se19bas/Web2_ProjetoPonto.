CREATE TABLE gestor (
                        id_usuario BIGINT PRIMARY KEY,
                        setor VARCHAR(100),

                        CONSTRAINT fk_gestor_funcionario
                            FOREIGN KEY (id_usuario)
                                REFERENCES funcionario (id_usuario)
);

ALTER TABLE funcionario
    ADD CONSTRAINT fk_funcionario_gestor
        FOREIGN KEY (id_gestor)
            REFERENCES gestor (id_usuario);