package com.luisland.backend.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
 
@Document(collection = "usuarios")
public class Usuario {
 
    @Id
    private String id;
    private String nombre;
 
    @Indexed(unique = true)
    private String email;
    private String password;
    private Rol    rol;
    private boolean esMaster = false;   // ← NUEVO
 
    // ── Constructores ──
    public Usuario() {}
 
    public Usuario(String nombre, String email, String password, Rol rol) {
        this.nombre   = nombre;
        this.email    = email;
        this.password = password;
        this.rol      = rol;
        this.esMaster = false;
    }
 
    // ── Getters y Setters ──
    public String getId()                      { return id; }
    public void   setId(String id)             { this.id = id; }
    public String getNombre()                  { return nombre; }
    public void   setNombre(String nombre)     { this.nombre = nombre; }
    public String getEmail()                   { return email; }
    public void   setEmail(String email)       { this.email = email; }
    public String getPassword()                { return password; }
    public void   setPassword(String p)        { this.password = p; }
    public Rol    getRol()                     { return rol; }
    public void   setRol(Rol rol)              { this.rol = rol; }
    public boolean isEsMaster()                { return esMaster; }
    public void    setEsMaster(boolean m)      { this.esMaster = m; }
}
 