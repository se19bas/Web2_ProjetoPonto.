package projeto.ponto.controller;

import projeto.ponto.dto.LoginRequest;
import projeto.ponto.dto.AuthResponse;
import projeto.ponto.dto.RefreshTokenRequest;
import projeto.ponto.service.AutenticacaoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AutenticacaoController {

    private final AutenticacaoService authService;

    public AutenticacaoController(
            AutenticacaoService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody RefreshTokenRequest request) {

        AuthResponse resposta =
                authService.refresh(request);

        return ResponseEntity.ok(resposta);
    }
}