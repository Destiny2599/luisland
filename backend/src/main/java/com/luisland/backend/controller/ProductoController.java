package com.luisland.backend.controller;

import com.luisland.backend.entities.Producto;
import com.luisland.backend.service.ProductoService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Producto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Producto create(@RequestBody @Validated Producto producto) {
        return service.create(producto);
    }

    @PutMapping("/{id}")
    public Producto update(@PathVariable Long id,
                           @RequestBody @Validated Producto producto) {
        return service.update(id, producto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}