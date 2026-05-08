package com.luisland.backend.dto;
 
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
 
@NoArgsConstructor
@Getter
public class ActualizarPermisoRequest {
 
    @NotBlank(message = "El permiso es obligatorio")
    private String permiso;
}
 