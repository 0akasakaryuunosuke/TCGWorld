package org.mobile.tcgworld.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "cards")
public class Card {
    @Id
    @Column(name = "key", unique = true,nullable = false)
    private String code;
    @Column(name ="name", nullable = false)
    private String cardName;
    @Column(name = "type",nullable = false)
    private String cardType;
    @Column(name = "attribute")
    private String attribute;

    @Column(name = "race")
    private String race;
    @Column(name = "atk")
    private Integer attack;
    @Column(name = "def")
    private Integer defense;
    @Column(name = "level")
    private Integer level;
    @Column(name= "effect")
    private String effect;
    @Column(name ="image_url")
    private String image_url;
    @Column(name = "price",precision = 10, scale = 2)
    private BigDecimal price;
}
