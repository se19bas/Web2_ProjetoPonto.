package projeto.ponto.controller;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import projeto.ponto.service.AreaService;
import projeto.ponto.model.Area.AreaRecord;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/areas")
@RequiredArgsConstructor
public class AreaController {
    private final AreaService areaService;

    @GetMapping
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
    })
    List<AreaRecord> listarAreas(){
        return areaService.getAllAreas();
    }
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Created"),
    })
    AreaRecord cadastrarArea(@RequestBody AreaRecord area){
        return areaService.AdicionarArea(area);
    }

    @GetMapping("/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
    })
    AreaRecord buscarArea(@PathVariable Long id){
        return areaService.getAreaById(id);
    }
    //apenas nome necessario
    @PutMapping("/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
    })
    AreaRecord alterarArea(@RequestBody AreaRecord area, @PathVariable Long id){
        return areaService.alterarTabela(area,id);
    }
    @DeleteMapping("/{id}")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Success"),
    })
    AreaRecord InativarArea(@PathVariable Long id){
        return areaService.inativarArea(id);
    }
}
