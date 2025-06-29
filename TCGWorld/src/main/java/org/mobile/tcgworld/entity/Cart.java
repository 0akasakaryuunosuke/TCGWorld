package org.mobile.tcgworld.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name="carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name ="owner_id",nullable = false)
    private Long ownerID;
    @Column(name = "total_price",precision = 10, scale = 2)
    private BigDecimal totalPrice;
    @Column(name = "item_id" ,nullable = false)
    private Long itemId;
    @Column(name = "number",nullable = false)
    private int number;
}
