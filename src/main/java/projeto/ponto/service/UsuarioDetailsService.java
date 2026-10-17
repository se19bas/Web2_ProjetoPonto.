package projeto.ponto.service;

import projeto.ponto.model.Usuario;
import projeto.ponto.repository.UsuarioRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(
            UsuarioRepository usuarioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "E-mail ou senha inválidos"
                        )
                );

        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities("ROLE_USER")
                .disabled(
                        usuario.getStatus() != Usuario.Status.ATIVO
                )
                .build();
    }
}