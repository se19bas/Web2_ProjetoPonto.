package projeto.ponto.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projeto.ponto.model.Funcionario;
import projeto.ponto.model.Gestor;
import projeto.ponto.service.FuncionarioService;
import projeto.ponto.service.GestorService;
import projeto.ponto.dto.HierarquiaDTO;
import java.util.List;

@RestController
@RequestMapping("/sistemaponto/gestores")
public class GestorController {

    private final GestorService gestorService;
    private final FuncionarioService funcionarioService;

    public GestorController(
            GestorService gestorService,
            FuncionarioService funcionarioService) {

        this.gestorService = gestorService;
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/promover/{idFuncionario}")
    public ResponseEntity<Gestor> promoverParaGestor(
            @PathVariable Long idFuncionario,
            @RequestParam String setor) {

        return ResponseEntity.ok(
                gestorService.promoverParaGestor(idFuncionario, setor)
        );
    }

    @GetMapping("/{id}/funcionarios")
    public ResponseEntity<List<Funcionario>> listarFuncionarios(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                funcionarioService.listarPorGestor(id)
        );
    }

    @GetMapping("/hierarquia")
    public ResponseEntity<List<HierarquiaDTO>> consultarHierarquia() {
        return ResponseEntity.ok(
                gestorService.consultarHierarquia()
        );
    }
}