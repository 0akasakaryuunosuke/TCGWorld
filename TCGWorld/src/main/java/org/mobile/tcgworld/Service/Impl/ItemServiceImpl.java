package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.ItemService;
import org.mobile.tcgworld.dao.CardRepository;
import org.mobile.tcgworld.dao.ItemRepository;
import org.mobile.tcgworld.dao.UserRepository;
import org.mobile.tcgworld.dto.ItemDTO;
import org.mobile.tcgworld.entity.Card;
import org.mobile.tcgworld.entity.Item;
import org.mobile.tcgworld.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {
    @Autowired
    ItemRepository itemRepository;

    @Autowired
    UserRepository userRepository;
    @Autowired
    CardRepository cardRepository;
    @Override
    public void insertItem(Item item){
        item.setId(null);
        itemRepository.save(item);
    }

    @Override
    public void updateItem(Item item) {
        itemRepository.save(item);
    }

    @Override
    public Optional<Item> getItem(Long id) {

        return itemRepository.findItemById(id);
    }

    @Override
    public List<Item> getAllItem() {
        return itemRepository.findAll();
    }

    @Override
    public Page<Item> getItemsByCardCode(String cardCode, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return itemRepository.findItemsByCardCode(cardCode, pageable);
    }

    @Override
    public List<Item> getItemByUserID(Long userID) {
        return itemRepository.findItemsByUserID(userID);
    }

    @Override
    public Optional<Item> updateNumber(Long id) {
        return itemRepository.findByIdForUpdate(id);
    }

    @Override
    public Boolean isExist(String cardCode, Long userID) {
        Optional<Item> item= itemRepository.findItemByCardCodeAndUserID(cardCode,userID);
        return item.isPresent();
    }
    @Override
    public List<ItemDTO> fillItemDTO(List<Item> itemList){
        List<ItemDTO> itemDTOList =new ArrayList<>();
        for (Item temp:itemList) {
            ItemDTO dto =new ItemDTO();
            Optional<User> user=userRepository.findById(temp.getUserID());
            Optional<Card> card=cardRepository.findCardByCode(temp.getCardCode());
            if(user.isPresent() &&card.isPresent()
            ){
                dto.setItem(temp);
                String userName = user.get().getUsername();
                dto.setCardName(card.get().getCardName());
                dto.setImageUrl(card.get().getImage_url());
                dto.setUserName(userName);
                itemDTOList.add(dto);
            }
        }
        return itemDTOList;
    }
    @Override
    public List<ItemDTO> fillDTOByIDs(List<Long> ids){
        List<Item> items= itemRepository.findItemsByIdIn(ids);
        return fillItemDTO(items);
    }
}
