package projeto.ponto.service;

import projeto.ponto.model.Usuario;
import projeto.ponto.repository.UsuarioRepository;
import projeto.ponto.repository.GestorRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final GestorRepository gestorRepository;

    public UsuarioDetailsService(
            UsuarioRepository usuarioRepository,
            GestorRepository gestorRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.gestorRepository = gestorRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "E-mail ou senha inválidos"
                        )
                );

        String role = gestorRepository.existsById(usuario.getIdUsuario())
                ? "ROLE_GESTOR"
                : "ROLE_USER";

        System.out.println(
                "Usuário: " + usuario.getEmail() +
                        " | Role: " + role
        );

        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(role)
                .disabled(
                        usuario.getStatus() != Usuario.Status.ATIVO
                )
                .build();
    }
}