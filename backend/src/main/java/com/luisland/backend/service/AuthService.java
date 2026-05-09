package com.luisland.backend.service;

import com.luisland.backend.dto.LoginRequest;
import com.luisland.backend.dto.RegistroRequest;
import com.luisland.backend.entities.Rol;
import com.luisland.backend.entities.Usuario;
import com.luisland.backend.repository.UsuarioRepository;
import com.luisland.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;

    public AuthService(UsuarioRepository usuarioRepo,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
    }

    /**
     * Valida credenciales y devuelve el payload del token.
     * Lanza 401 si el usuario no existe o la contraseña no coincide.
     */
    public Map<String, Object> login(LoginRequest request) {

        Usuario usuario = usuarioRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas");
        }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());

        return Map.of(
                "token",  token,
                "nombre", usuario.getNombre(),
                "email",  usuario.getEmail(),
                "rol",    usuario.getRol().name()
        );
    }

    /**
     * Registra un nuevo usuario.
     * Lanza 409 si el email ya está en uso.
     */
    public void registro(RegistroRequest request) {

        if (usuarioRepo.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Rol rol;
        try {
            rol = Rol.valueOf(request.getRol().toUpperCase());
        } catch (Exception e) {
            rol = Rol.VISITANTE;
        }

        Usuario nuevo = new Usuario(
                request.getNombre(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                rol
        );

        usuarioRepo.save(nuevo);
    }
}