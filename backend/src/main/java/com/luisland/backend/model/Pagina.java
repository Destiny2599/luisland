package com.luisland.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paginas")
public class Pagina {

    @Id
    private String id;
    private String nombre;   // Nombre visible, ej: "Sobre mí"
    private String ruta;     // Ruta de React, ej: "/sobre-mi"
    private String permiso;  // "TODOS", "STANDARD", "DEVELOPER", "ADMIN"

    public Pagina() {}

    public Pagina(String nombre, String ruta, String permiso) {
        this.nombre  = nombre;
        this.ruta    = ruta;
        this.permiso = permiso;
    }

    public String getId()                    { return id; }
    public void   setId(String id)           { this.id = id; }
    public String getNombre()                { return nombre; }
    public void   setNombre(String nombre)   { this.nombre = nombre; }
    public String getRuta()                  { return ruta; }
    public void   setRuta(String ruta)       { this.ruta = ruta; }
    public String getPermiso()               { return permiso; }
    public void   setPermiso(String permiso) { this.permiso = permiso; }
}