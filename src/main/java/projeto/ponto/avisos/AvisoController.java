package projeto.ponto.avisos;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/avisos")
@RequiredArgsConstructor
public class AvisoController {
    private  final AvisoService avisoService;

    @GetMapping("/{id}")
    public AvisoRecord consultarAviso(@PathVariable Long id) {
        return avisoService.consultarAviso(id);
    }

    @PutMapping("/{id}/ler")
    public AvisoRecord lerAviso(@PathVariable Long id) {
        return avisoService.lerAviso(id);
    }

    @GetMapping("/{id}/gestor")
    public List<AvisoRecord> avisosParaGestor(@PathVariable Long id) {
        return avisoService.avisosParaGestor(id);
    }


}
