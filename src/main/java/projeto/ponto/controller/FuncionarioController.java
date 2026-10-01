package projeto.ponto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.ponto.model.Funcionario;
import projeto.ponto.pontos.PontoService;
import projeto.ponto.pontos.RegistroPontoRecord;
import projeto.ponto.service.FuncionarioService;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/funcionarios")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;
    private final PontoService pontoService;

    public FuncionarioController(FuncionarioService funcionarioService, PontoService pontoService) {
        this.funcionarioService = funcionarioService;
        this.pontoService = pontoService;
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> listarTodos() {
        return ResponseEntity.ok(funcionarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario funcionario) {
        return ResponseEntity.ok(funcionarioService.cadastrar(funcionario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> atualizar(
            @PathVariable Long id,
            @RequestBody Funcionario funcionario) {

        return ResponseEntity.ok(funcionarioService.atualizar(id, funcionario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        funcionarioService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pontos")
    public ResponseEntity<List<RegistroPontoRecord>> buscarPontos(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                pontoService.getPontosByFuncionario(id)
        );
    }
}