CREATE TABLE funcionario (
                             id_usuario BIGINT PRIMARY KEY,
                             id_gestor BIGINT NULL,

                             CONSTRAINT fk_funcionario_usuario
                                 FOREIGN KEY (id_usuario)
                                     REFERENCES usuario (idusuario),
);