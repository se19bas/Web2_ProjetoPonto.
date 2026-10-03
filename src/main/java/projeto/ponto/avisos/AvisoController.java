package projeto.ponto.avisos;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/avisos")
@RequiredArgsConstructor
public class AvisoController {
    private  final AvisoService avisoService;

    @GetMapping("/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public AvisoRecord consultarAviso(@PathVariable Long id) {
        return avisoService.consultarAviso(id);
    }

    @PutMapping("/{id}/ler")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public AvisoRecord lerAviso(@PathVariable Long id) {
        return avisoService.lerAviso(id);
    }

    @GetMapping("/{id}/gestor")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public List<AvisoRecord> avisosParaGestor(@PathVariable Long id) {
        return avisoService.avisosParaGestor(id);
    }


}
