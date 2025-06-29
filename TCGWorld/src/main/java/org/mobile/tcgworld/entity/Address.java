package org.mobile.tcgworld.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name="address")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userID;
    @Column(name = "receiver_name")
    private String receiverName;
    @Column(name = "phone")
    private String phone;
    @Column(name = "region")
    private String region;
    @Column(name = "detailed")
    private String detailed;
    @Column(name = "is_default")
    @JsonProperty("isDefault")
    private boolean isDefault;
}
