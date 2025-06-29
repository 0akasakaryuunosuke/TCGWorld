package org.mobile.tcgworld.entity;

import lombok.Data;
import org.mobile.tcgworld.enums.OrderStatus;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name="orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "store_id")
    private Long storeID;
    @Column(name = "customer_id")
    private Long customerID;
    @Column(name = "create_time")
    private LocalDateTime createTime;
    @Column(name = "pay_time")
    private LocalDateTime payTime;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;
    @Column(name = "amount",precision = 10, scale = 2)
    private BigDecimal amount;
    @Column(name = "freight",precision = 10, scale = 2)
    private BigDecimal freight;
    @Column(name = "address")
    private String address;
    @Column(name = "receiver_name")
    private String receiverName;
}
