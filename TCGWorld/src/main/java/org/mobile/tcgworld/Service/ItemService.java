package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.dto.ItemDTO;
import org.mobile.tcgworld.entity.Item;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ItemService {
     void insertItem(Item item);
     void updateItem(Item item);
     Optional<Item>getItem(Long id);
     List<Item>getAllItem();

    Page<Item> getItemsByCardCode(String cardCode, int page, int size);

    List<Item>getItemByUserID(Long userID);

     Optional<Item>updateNumber(Long id);

     Boolean isExist(String cardCode,Long userID);
     public List<ItemDTO> fillItemDTO(List<Item> itemList);

     List<ItemDTO> fillDTOByIDs(List<Long> ids);
}
