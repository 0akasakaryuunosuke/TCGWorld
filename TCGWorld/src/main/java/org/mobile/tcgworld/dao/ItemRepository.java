package org.mobile.tcgworld.dao;


import org.mobile.tcgworld.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.LockModeType;
import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ItemRepository  extends JpaRepository<Item, Long> {
    Page<Item> findItemsByCardCode(String code, Pageable pageable);
    List<Item>findItemsByUserID(Long userID);
    @Query("SELECT MIN(i.price) FROM Item i WHERE i.cardCode = :cardCode")
    BigDecimal findMinPriceByCardCode(@Param("cardCode") String cardCode);

    Optional<Item> findItemByCardCodeAndUserID(String cardCode, Long UserID);
    Optional<Item>findItemById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Item i WHERE i.id = :id")
    Optional<Item> findByIdForUpdate(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Item i SET i.price = :price, i.number = :number,i.status =:status WHERE i.id = :id")
    void updateItemInfo(@Param("id") Long id,
                       @Param("price") BigDecimal price,
                       @Param("number") Integer number,
                       @Param("status")String status);
    List<Item> findItemsByIdIn(List<Long> ids);
}
