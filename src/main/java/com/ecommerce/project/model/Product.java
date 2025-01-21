package com.ecommerce.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long productId;
    private String productName;
    private String image;
    private String description;
    private int quantity;
    private double price; //100
    private double discount;//25
    private double specialPrice;//75

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
