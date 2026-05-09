package com.luisland.backend.service;

import com.luisland.backend.dto.CambiarInfoRequest;
import com.luisland.backend.dto.CambiarRolRequest;
import com.luisland.backend.dto.RegistroRequest;
import com.luisland.backend.entities.Rol;
import com.luisland.backend.entities.Usuario;
import com.luisland.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder   passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepo     = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    /** Devuelve todos los usuarios como DTOs planos (sin exponer password). */
    public List<Map<String, Object>> listar() {
        return usuarioRepo.findAll().stream()
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
    }

    /** Crea un usuario. Lanza 409 si el email ya existe. */
    public void crear(RegistroRequest request) {

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

    /** Elimina un usuario por ID. Protege al usuario Master. */
    public void eliminar(String id) {

        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.isEsMaster()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "El usuario Master no puede ser eliminado");
        }

        usuarioRepo.deleteById(id);
    }

    /** Cambia el rol de un usuario. Protege al Master. */
    public void cambiarRol(String id, CambiarRolRequest request) {

        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.isEsMaster()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "El rol del usuario Master no puede ser modificado");
        }

        Rol nuevoRol;
        try {
            nuevoRol = Rol.valueOf(request.getRol().toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Rol inválido. Usa: ADMIN, DEVELOPER o VISITANTE");
        }

        usuario.setRol(nuevoRol);
        usuarioRepo.save(usuario);
    }

    /** Actualiza nombre y/o email de un usuario. Protege al Master. */
    public void cambiarInfo(String id, CambiarInfoRequest request) {

        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuario.isEsMaster()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "No se puede modificar al usuario Master");
        }

        if (request.getNombre() != null && !request.getNombre().isBlank()) {
            usuario.setNombre(request.getNombre());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(usuario.getEmail()) &&
                    usuarioRepo.existsByEmail(request.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
            }
            usuario.setEmail(request.getEmail());
        }

        usuarioRepo.save(usuario);
    }
}