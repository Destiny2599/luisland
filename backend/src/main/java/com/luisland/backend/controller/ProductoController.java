package com.luisland.backend.controller;

import com.luisland.backend.model.Producto;
import com.luisland.backend.service.ProductoService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // en producción pon tu dominio de Vercel
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    // GET /api/productos
    @GetMapping
    public List<Producto> getAll() {
        return service.getAll();
    }

    // GET /api/productos/{id}
    @GetMapping("/{id}")
    public Producto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // POST /api/productos
    @PostMapping
    public Producto create(@RequestBody Producto producto) {
        return service.create(producto);
    }

    // PUT /api/productos/{id}
    @PutMapping("/{id}")
    public Producto update(@PathVariable Long id, @RequestBody Producto producto) {
        return service.update(id, producto);
    }

    // DELETE /api/productos/{id}
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}