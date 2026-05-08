package com.luisland.backend.dto;
 
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
 
@NoArgsConstructor
@Getter
public class CambiarRolRequest {
 
    @NotBlank(message = "El rol es obligatorio")
    private String rol;
}
 