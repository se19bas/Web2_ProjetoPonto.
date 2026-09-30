package projeto.ponto.model;

import jakarta.persistence.*;

@Entity
@Table(name = "gestor")
public class Gestor {

    @Id
    @Column(name = "idUsuario")
    private Long idUsuario;

    @OneToOne
    @MapsId
    @JoinColumn(name = "idUsuario")
    private Funcionario funcionario;

    @Column(length = 100)
    private String setor;

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Funcionario getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionario funcionario) {
        this.funcionario = funcionario;
    }

    public String getSetor() {
        return setor;
    }

    public void setSetor(String setor) {
        this.setor = setor;
    }
}