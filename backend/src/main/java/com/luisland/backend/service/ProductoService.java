package com.luisland.backend.service;

import com.luisland.backend.model.Producto;
import com.luisland.backend.repository.ProductoRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    // Obtener todos
    public List<Producto> getAll() {
        return repo.findAll();
    }

    // Obtener por ID
    public Producto getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // Crear
    public Producto create(Producto producto) {
        return repo.save(producto);
    }

    // Actualizar
    public Producto update(Long id, Producto data) {
        Producto producto = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(data.getNombre());
        producto.setDescripcion(data.getDescripcion());
        producto.setPrecio(data.getPrecio());
        producto.setCantidad(data.getCantidad());
        producto.setImagenUrl(data.getImagenUrl());

        return repo.save(producto);
    }

    // Eliminar
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        repo.deleteById(id);
    }
}