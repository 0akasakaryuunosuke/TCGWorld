package org.mobile.tcgworld.entity;

import lombok.Data;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "items")
@DynamicUpdate
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "card_code",nullable = false)
    private String cardCode;
    @Column(name = "user_id",nullable = false)
    private Long userID;
    @Column(name = "series")
    private String version;
    @Column(name = "rarity",nullable = false)
    private String rarity;
    @Column(name = "price",nullable = false,precision = 10, scale = 2)
    private BigDecimal price;
    @Column(name = "number",nullable = false)
    private Integer number;
    @Column(name = "status")
    private String status;
}
