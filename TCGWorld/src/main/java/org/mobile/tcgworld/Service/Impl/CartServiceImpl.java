package org.mobile.tcgworld.Service.Impl;


import org.mobile.tcgworld.Service.CartService;
import org.mobile.tcgworld.Service.ItemService;
import org.mobile.tcgworld.dao.CartRepository;
import org.mobile.tcgworld.dao.ItemRepository;
import org.mobile.tcgworld.dao.UserRepository;
import org.mobile.tcgworld.dto.CartDTO;
import org.mobile.tcgworld.dto.ItemDTO;
import org.mobile.tcgworld.entity.Cart;
import org.mobile.tcgworld.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.mobile.tcgworld.entity.User;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ItemService itemService;

    @Override
    public List<Cart> findCartsByUserId(Long userId) {
        return cartRepository.findCartsByOwnerID(userId);
    }

    @Override
    public Cart addCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public void deleteCart(Long id) {
        Optional<Cart> optionalCart = cartRepository.findById(id);
        if (optionalCart.isPresent()) {
            cartRepository.deleteById(id);
        } else {
            throw new RuntimeException("未找到指定的购物车项");
        }
    }

    @Override
    public void emptyAll(Long userId) {
        cartRepository.deleteCartsByOwnerID(userId);
    }

    @Override
    public Boolean isExist(Long userID, Long itemID) {
        return cartRepository.findCartByOwnerIDAndItemId(userID,itemID).isPresent();
    }

    @Override
    public Optional<Cart> getCart(Long id) {
        return cartRepository.findCartById(id);
    }

    @Override
    public void updateCart(Cart cart) {
        cartRepository.save(cart);
        cartRepository.updateCartTotalPrice(cart.getOwnerID(), cart.getTotalPrice());
    }

    @Override
    public List<Long> findAllStoreIDByOwnerID(Long ownerID) {
        return cartRepository.findDistinctItemUserIdsByCartOwnerId(ownerID);
    }


    @Override
    public List<CartDTO> findOwnerAllCarts(Long ownerID) {
        List<CartDTO>resultDTO = new ArrayList<>();
        List<Long>storeIDs=findAllStoreIDByOwnerID(ownerID);
        for (Long storeID:storeIDs
             ) {
            CartDTO dto =new CartDTO();
            dto.setStoreID(storeID);

            String storeName = userRepository.findById(storeID)
                    .map(User::getUsername)
                    .orElse("未知商店");
            dto.setStoreName(storeName);
            List<Long> ids =cartRepository.findItemIdsByOwnerIdAndUserId(ownerID,storeID);
            List<ItemDTO> itemDTOList = itemService.fillDTOByIDs(ids);
            for (ItemDTO temp: itemDTOList
                 ) {
                int number = findCartByOwnerIDAndItemID(ownerID, temp.getId())
                        .map(Cart::getNumber).orElse(0);
                temp.setNumber(number);
            }
            dto.setItems(itemDTOList);
            dto.setOwnerID(ownerID);
            dto.setQuantity(itemDTOList.size());
            dto.setTotalPrice(getTotalPriceByOwnerIdAndStoreId(ownerID,ids));
            resultDTO.add(dto);
        }
        return resultDTO;
    }

    private  BigDecimal getTotalPriceByOwnerIdAndStoreId(Long ownerId,List<Long> itemIds){
        double result = 0.0;
        for (Long itemId: itemIds
             ) {
            Integer number =cartRepository.findCartByOwnerIDAndItemId(ownerId,itemId)
                    .map(Cart::getNumber).orElse(0);
            BigDecimal price =itemRepository.findItemById(itemId)
                    .map(Item::getPrice).orElse(BigDecimal.valueOf(0.0));
            result +=number*price.doubleValue();
        }
        return BigDecimal.valueOf(result);
        }
        @Override
        public CartDTO findCartByUserIDAndStoreID(Long userID, Long storeID){
            List<CartDTO> dtos =findOwnerAllCarts(userID);
            for (CartDTO dto: dtos
                 ) {
                if(dto.getStoreID().equals(storeID)) {
                    return dto;
                }
            }
            return new CartDTO();
        }
        @Override
        public void deleteCartByUserIDAndStoreID(Long userID, Long storeID){
            CartDTO dto =findCartByUserIDAndStoreID(userID,storeID);
            List<ItemDTO> items=dto.getItems();
            if(items.isEmpty()){
                throw  new RuntimeException("未找到指定的购物车项");
            }
            else{
                for (ItemDTO item: items
                     ) {
                    Long itemID=item.getId();
                    cartRepository.deleteCartsByOwnerIDAndItemId(userID,itemID);
                }
            }
        }
        @Override
        public Optional<Cart> findCartByOwnerIDAndItemID(Long ownerID, Long itemID){
            return cartRepository.findCartByOwnerIDAndItemId(ownerID,itemID);
        }
    }



