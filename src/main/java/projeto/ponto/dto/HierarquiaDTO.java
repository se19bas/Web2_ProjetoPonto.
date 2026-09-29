package projeto.ponto.dto;

import java.util.List;

public class HierarquiaDTO {

    private Long idGestor;
    private String nomeGestor;
    private String setor;
    private List<FuncionarioHierarquiaDTO> funcionarios;

    public HierarquiaDTO(
            Long idGestor,
            String nomeGestor,
            String setor,
            List<FuncionarioHierarquiaDTO> funcionarios) {

        this.idGestor = idGestor;
        this.nomeGestor = nomeGestor;
        this.setor = setor;
        this.funcionarios = funcionarios;
    }

    public Long getIdGestor() {
        return idGestor;
    }

    public String getNomeGestor() {
        return nomeGestor;
    }

    public String getSetor() {
        return setor;
    }

    public List<FuncionarioHierarquiaDTO> getFuncionarios() {
        return funcionarios;
    }
}