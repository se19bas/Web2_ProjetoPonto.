package projeto.ponto.avisos;

import projeto.ponto.model.Gestor;

public class ConverterAviso {

    private ConverterAviso() {
    }

    public static AvisoRecord toRecord(Aviso aviso) {

        Gestor gestor = aviso.getGestor();

        return new AvisoRecord(
                aviso.getIdAviso(),
                aviso.getRegistro().getIdRegistroPonto(),
                gestor.getIdUsuario(),
                aviso.getMensagem(),
                aviso.getStatus()
        );
    }
}