package projeto.ponto.pontos;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    RegistroPontoRecord cadastrarPonto(@RequestBody RegistroPontoRecord ponto){
        return pontoService.registrar(ponto);
    }

    @GetMapping
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    List<RegistroPontoRecord> pegarPontos(){
        return pontoService.getAllPontos();
    }

    @GetMapping("/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public RegistroPontoRecord pegarPontoPorId(@PathVariable Long id) {
        return pontoService.getPontoById(id);
    }
}
