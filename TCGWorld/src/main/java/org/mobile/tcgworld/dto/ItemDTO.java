package org.mobile.tcgworld.dto;

import lombok.Data;
import org.mobile.tcgworld.entity.Item;
import org.springframework.beans.BeanUtils;
import java.math.BigDecimal;

@Data
public class ItemDTO {
    private Long id;
    private String cardCode;
    private String cardName;
    private Long userID;
    private String userName;
    private String version;
    private String rarity;
    private BigDecimal price;
    private Integer number;
    private String status;
    private String imageUrl;
    public void setItem(Item item){
        BeanUtils.copyProperties(item, this);
    }
}
