package com.luisland.backend.dto;
 
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
 
@NoArgsConstructor
@Getter
public class LoginRequest {
 
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    private String email;
 
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
 