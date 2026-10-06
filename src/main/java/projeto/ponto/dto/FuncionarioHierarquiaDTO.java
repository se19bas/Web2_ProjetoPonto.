package projeto.ponto.dto;

public class FuncionarioHierarquiaDTO {

    private Long idFuncionario;
    private String nome;
    private String cargo;

    public FuncionarioHierarquiaDTO(
            Long idFuncionario,
            String nome,
            String cargo) {

        this.idFuncionario = idFuncionario;
        this.nome = nome;
        this.cargo = cargo;
    }

    public Long getIdFuncionario() {
        return idFuncionario;
    }

    public String getNome() {
        return nome;
    }

    public String getCargo() {
        return cargo;
    }
}