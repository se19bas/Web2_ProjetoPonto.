package projeto.ponto.area;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sistemaponto/areas")
@RequiredArgsConstructor
public class Controller {
    private final AreaService areaService;

    @GetMapping
    List<AreaRecord> listarAreas(){
        return areaService.getAllAreas();
    }
    @PostMapping
    AreaRecord cadastrarArea(@RequestBody AreaRecord area){
        return areaService.AdicionarArea(area);
    }

    @GetMapping("/{id}")
    AreaRecord buscarArea(@PathVariable Long id){
        return areaService.getAreaById(id);
    }
    //apenas nome necessario
    @PutMapping("/{id}")
    AreaRecord alterarArea(@RequestBody AreaRecord area, @PathVariable Long id){
        return areaService.alterarTabela(area,id);
    }
    @DeleteMapping("/{id}")
    AreaRecord InativarArea(@PathVariable Long id){
        return areaService.inativarArea(id);
    }
}
