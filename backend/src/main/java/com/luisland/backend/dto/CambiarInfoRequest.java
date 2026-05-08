package com.luisland.backend.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class CambiarInfoRequest {

    // Ambos campos son opcionales — si vienen null simplemente no se actualizan
    private String nombre;

    @Email(message = "El email no tiene un formato válido")
    private String email;
}