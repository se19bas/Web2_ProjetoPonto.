package projeto.ponto.pontos;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/sistemaponto/pontos")
@RequiredArgsConstructor
public class PontosController {
    private final PontoService pontoService;

    @PostMapping
    RegistroPontoRecord cadastrarPonto(@RequestBody RegistroPontoRecord ponto){
        return pontoService.registrar(ponto);
    }
}
