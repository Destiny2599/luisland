package com.luisland.backend.repository;

import com.luisland.backend.model.Pagina;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PaginaRepository extends MongoRepository<Pagina, String> {
    Optional<Pagina> findByRuta(String ruta);
    boolean existsByRuta(String ruta);
}