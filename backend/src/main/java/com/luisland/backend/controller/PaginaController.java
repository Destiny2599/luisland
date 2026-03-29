package com.luisland.backend.controller;

import com.luisland.backend.model.Pagina;
import com.luisland.backend.repository.PaginaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// ── Endpoint PÚBLICO — el frontend consulta permisos sin token ──
@RestController
@RequestMapping("/api/paginas")
class PaginaPublicaController {

    private final PaginaRepository paginaRepo;

    PaginaPublicaController(PaginaRepository paginaRepo) {
        this.paginaRepo = paginaRepo;
    }

    @GetMapping
    public ResponseEntity<List<Pagina>> listarPublico() {
        return ResponseEntity.ok(paginaRepo.findAll());
    }
}

// ── Endpoints ADMIN — gestión completa ─────────────────────────
@RestController
@RequestMapping("/api/admin/paginas")
public class PaginaController {

    private final PaginaRepository paginaRepo;

    public PaginaController(PaginaRepository paginaRepo) {
        this.paginaRepo = paginaRepo;
    }

    // ── GET /api/admin/paginas ──────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Pagina>> listar() {
        return ResponseEntity.ok(paginaRepo.findAll());
    }

    // ── POST /api/admin/paginas/inicializar ─────────────────────
    @PostMapping("/inicializar")
    public ResponseEntity<?> inicializar() {
        List<Pagina> defaults = List.of(
        
            new Pagina("Sobre mí",            "/sobre-mi",          "TODOS"),
            new Pagina("Test 1",              "/test1",             "STANDARD"),
            new Pagina("Gestión de usuarios", "/gestion-usuarios",  "ADMIN"),
            new Pagina("Gestión de permisos", "/gestion-permisos",  "ADMIN")
        );

        int creadas = 0;
        for (Pagina p : defaults) {
            if (!paginaRepo.existsByRuta(p.getRuta())) {
                paginaRepo.save(p);
                creadas++;
            }
        }

        return ResponseEntity.ok(Map.of(
            "mensaje", "Inicialización completada",
            "creadas", creadas
        ));
    }

    // ── PUT /api/admin/paginas/{id}/permiso ─────────────────────
    @PutMapping("/{id}/permiso")
    public ResponseEntity<?> actualizarPermiso(@PathVariable String id,
                                               @RequestBody Map<String, String> body) {
        Optional<Pagina> opt = paginaRepo.findById(id);

        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Página no encontrada"));
        }

        String nuevoPermiso = body.get("permiso");
        List<String> validos = List.of("TODOS", "STANDARD", "DEVELOPER", "ADMIN");

        if (nuevoPermiso == null || !validos.contains(nuevoPermiso.toUpperCase())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Permiso inválido. Usa: TODOS, STANDARD, DEVELOPER o ADMIN"));
        }

        Pagina pagina = opt.get();
        pagina.setPermiso(nuevoPermiso.toUpperCase());
        paginaRepo.save(pagina);

        return ResponseEntity.ok(Map.of("mensaje", "Permiso actualizado correctamente"));
    }
}