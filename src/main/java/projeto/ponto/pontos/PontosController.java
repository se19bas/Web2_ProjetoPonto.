package projeto.ponto.pontos;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/pontos")
@RequiredArgsConstructor
public class PontosController {
    private final PontoService pontoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    RegistroPontoRecord cadastrarPonto(@RequestBody RegistroPontoRecord ponto){
        return pontoService.registrar(ponto);
    }

    @GetMapping
    List<RegistroPontoRecord> pegarPontos(){
        return pontoService.getAllPontos();
    }

    @GetMapping("/{id}")
    public RegistroPontoRecord pegarPontoPorId(@PathVariable Long id) {
        return pontoService.getPontoById(id);
    }
}
