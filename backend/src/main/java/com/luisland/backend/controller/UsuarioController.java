package com.luisland.backend.controller;

import com.luisland.backend.model.Rol;
import com.luisland.backend.model.Usuario;
import com.luisland.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepo,
                             PasswordEncoder passwordEncoder) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ── GET /api/admin/usuarios ─────────────────────────────────────
    @GetMapping
public ResponseEntity<List<Map<String, Object>>> listar() {
    List<Map<String, Object>> lista = usuarioRepo.findAll().stream()
            .map(u -> {
                Map<String, Object> map = new java.util.HashMap<>();
                map.put("id",       u.getId());
                map.put("nombre",   u.getNombre());
                map.put("email",    u.getEmail());
                map.put("rol",      u.getRol().name());
                map.put("esMaster", u.isEsMaster());
                return map;
            })
            .toList();

    return ResponseEntity.ok(lista);
}

    // ── POST /api/admin/usuarios ────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");
        String nombre   = body.get("nombre");
        String rolStr   = body.get("rol");

        if (email == null || email.isBlank() ||
            password == null || password.isBlank() ||
            nombre == null || nombre.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Nombre, email y password son obligatorios"));
        }

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

        Usuario nuevo = new Usuario(nombre, email, passwordEncoder.encode(password), rol);
        usuarioRepo.save(nuevo);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("mensaje", "Usuario creado correctamente"));
    }

    // ── DELETE /api/admin/usuarios/{id} ────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable String id) {
        Optional<Usuario> opt = usuarioRepo.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        // Protección Master — nunca se puede eliminar
        if (opt.get().isEsMaster()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "El usuario Master no puede ser eliminado"));
        }

        usuarioRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));
    }

    // ── PUT /api/admin/usuarios/{id}/rol ───────────────────────────
    @PutMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(@PathVariable String id,
                                        @RequestBody Map<String, String> body) {
        Optional<Usuario> opt = usuarioRepo.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        // Protección Master — nunca se puede degradar
        if (opt.get().isEsMaster()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "El rol del usuario Master no puede ser modificado"));
        }

        Rol nuevoRol;
        try {
            nuevoRol = Rol.valueOf(body.get("rol").toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Rol inválido. Usa: ADMIN, DEVELOPER o VISITANTE"));
        }

        Usuario usuario = opt.get();
        usuario.setRol(nuevoRol);
        usuarioRepo.save(usuario);

        return ResponseEntity.ok(Map.of("mensaje", "Rol actualizado correctamente"));
    }
}