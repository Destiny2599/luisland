package com.luisland.backend.service;

import com.luisland.backend.entities.Producto;
import com.luisland.backend.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    public List<Producto> getAll() {
        return repo.findAll();
    }

    public Producto getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    public Producto create(Producto producto) {
        return repo.save(producto);
    }

    public Producto update(Long id, Producto data) {
        Producto producto = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Producto no encontrado"));

        producto.setNombre(data.getNombre());
        producto.setDescripcion(data.getDescripcion());
        producto.setPrecio(data.getPrecio());
        producto.setCantidad(data.getCantidad());
        producto.setImagenUrl(data.getImagenUrl());

        return repo.save(producto);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repo.deleteById(id);
    }
}