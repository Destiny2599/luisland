package com.luisland.backend.repository;
 
import com.luisland.backend.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
 
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}
 