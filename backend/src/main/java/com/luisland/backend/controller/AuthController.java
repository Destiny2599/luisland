package com.luisland.backend.controller;

import com.luisland.backend.model.Rol;
import com.luisland.backend.model.Usuario;
import com.luisland.backend.repository.UsuarioRepository;
import com.luisland.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;

    public AuthController(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
    }

    // ── LOGIN ──────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        Optional<Usuario> opt = usuarioRepo.findByEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        Usuario usuario = opt.get();
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        String token = jwtUtil.generarToken(usuario.getEmail(), usuario.getRol().name());

        return ResponseEntity.ok(Map.of(
                "token",  token,
                "nombre", usuario.getNombre(),
                "email",  usuario.getEmail(),
                "rol",    usuario.getRol().name()
        ));
    }

    // ── REGISTRO (solo ADMIN puede crear usuarios desde el panel) ──
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");
        String nombre   = body.get("nombre");
        String rolStr   = body.get("rol");

        if (usuarioRepo.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El email ya está registrado"));
        }

        Rol rol;
        try {
            rol = Rol.valueOf(rolStr.toUpperCase());
        } catch (Exception e) {
            rol = Rol.VISITANTE;
        }

        Usuario nuevo = new Usuario(
                nombre,
                email,
                passwordEncoder.encode(password),
                rol
        );

        usuarioRepo.save(nuevo);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Usuario creado correctamente"));
    }
}