package projeto.ponto.area;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sistemaponto/areas")
public class Controller {

    @GetMapping
    Area[] listarAreas(){
        return null;
    }
    @PostMapping
    Boolean cadastrarArea(){
        return false;
    }

    @GetMapping("/{id}")
    Area buscarArea(@PathVariable Long id){
        return null;
    }

    @PutMapping("/{id}")
    Boolean alterarArea(@PathVariable Long id){
        return false;
    }
    @DeleteMapping("/{id}")
    Boolean InativarArea(@PathVariable Long id){
        return false;
    }
}
