package com.luisland.backend.controller;

import com.luisland.backend.dto.CambiarInfoRequest;
import com.luisland.backend.dto.CambiarRolRequest;
import com.luisland.backend.dto.RegistroRequest;
import com.luisland.backend.entities.Rol;
import com.luisland.backend.entities.Usuario;
import com.luisland.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
                    Map<String, Object> map = new HashMap<>();
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
    public ResponseEntity<?> crear(@RequestBody @Validated RegistroRequest request) {

        if (usuarioRepo.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El email ya está registrado"));
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
                                        @RequestBody @Validated CambiarRolRequest request) {
        Optional<Usuario> opt = usuarioRepo.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        if (opt.get().isEsMaster()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "El rol del usuario Master no puede ser modificado"));
        }

        Rol nuevoRol;
        try {
            nuevoRol = Rol.valueOf(request.getRol().toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Rol inválido. Usa: ADMIN, DEVELOPER o VISITANTE"));
        }

        Usuario usuario = opt.get();
        usuario.setRol(nuevoRol);
        usuarioRepo.save(usuario);

        return ResponseEntity.ok(Map.of("mensaje", "Rol actualizado correctamente"));
    }

    // ── PUT /api/admin/usuarios/{id}/info ──────────────────────────
    @PutMapping("/{id}/info")
    public ResponseEntity<?> cambiarInfo(@PathVariable String id,
                                         @RequestBody @Validated CambiarInfoRequest request) {
        Optional<Usuario> opt = usuarioRepo.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        if (opt.get().isEsMaster()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "No se puede modificar al usuario Master"));
        }

        Usuario usuario = opt.get();

        if (request.getNombre() != null && !request.getNombre().isBlank()) {
            usuario.setNombre(request.getNombre());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(usuario.getEmail()) &&
                    usuarioRepo.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "El email ya está registrado"));
            }
            usuario.setEmail(request.getEmail());
        }

        usuarioRepo.save(usuario);
        return ResponseEntity.ok(Map.of("mensaje", "Usuario actualizado correctamente"));
    }
}