package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findCartsByOwnerID(Long userID);
    @Modifying
    @Transactional
    void deleteCartsByOwnerID(Long userID);
    Optional<Cart> findCartByOwnerIDAndItemId(Long userID,Long itemID);
    Optional<Cart> findCartById(Long id);
    @Modifying
    @Transactional
    @Query("UPDATE Cart i SET i.totalPrice = :totalPrice WHERE i.ownerID = :ownerID")
    void updateCartTotalPrice(@Param("ownerID")Long ownerID,
                        @Param("totalPrice") BigDecimal totalPrice);

    @Query(value = "SELECT DISTINCT i.user_id " +
            "FROM carts c " +
            "JOIN items i ON c.item_id = i.id " +
            "WHERE c.owner_id = :ownerId", nativeQuery = true)
    List<Long> findDistinctItemUserIdsByCartOwnerId(@Param("ownerId") Long ownerId);

    @Query(value = "SELECT c.item_id " +
            "FROM carts c " +
            "JOIN items i ON c.item_id = i.id " +
            "WHERE c.owner_id = :ownerId " +
            "AND i.user_id = :userId", nativeQuery = true)
    List<Long> findItemIdsByOwnerIdAndUserId(@Param("ownerId") Long ownerId, @Param("userId") Long storeId);

    @Modifying
    @Transactional
    void deleteCartsByOwnerIDAndItemId(Long ownerID,Long itemID);

}
