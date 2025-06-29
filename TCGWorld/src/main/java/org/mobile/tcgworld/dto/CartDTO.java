package org.mobile.tcgworld.dto;
import lombok.Data;
import org.mobile.tcgworld.entity.Item;
import org.springframework.beans.BeanUtils;

import javax.persistence.Column;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDTO {
    private List<ItemDTO> items;
    private Long storeID;
    private Long ownerID;
    private String storeName;
    private Integer quantity;
    private BigDecimal totalPrice;
}
