package com.example.hrpayroll.Model;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserModel {
@Id
@Getter
@Setter

    private String nome;
    private String email;
    private String senha;
    private Long id;

    //...

}
