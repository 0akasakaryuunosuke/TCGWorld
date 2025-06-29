package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.dto.CartDTO;
import org.mobile.tcgworld.entity.Cart;

import java.util.List;
import java.util.Optional;

public interface CartService {
    List<Cart> findCartsByUserId(Long userId);
    Cart addCart(Cart cart);
    void deleteCart(Long id);
    void emptyAll(Long userId);

    Boolean isExist(Long userID,Long itemID);
    Optional<Cart>getCart(Long id);
    void updateCart(Cart cart);

    List<Long> findAllStoreIDByOwnerID(Long ownerID);
    List<CartDTO>findOwnerAllCarts(Long ownerID);

    CartDTO findCartByUserIDAndStoreID(Long userID, Long storeID);

    void deleteCartByUserIDAndStoreID(Long userID, Long storeID);

    Optional<Cart> findCartByOwnerIDAndItemID(Long ownerID, Long itemID);
}
