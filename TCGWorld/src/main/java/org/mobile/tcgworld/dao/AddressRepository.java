package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Address;
import org.mobile.tcgworld.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findAddressesByUserID(Long userID);
    @Transactional
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userID = :userID AND a.id <> :currentID")
    void clearDefaultExcept(@Param("userID") Long userID, @Param("currentID") Long currentID);
    @Transactional
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userID = :userID")
    void clearDefault(@Param("userID") Long userID);
    @Transactional
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = true WHERE  a.id = :currentID")
    void setAddressDefault(@Param("currentID") Long currentID);

    @Query("SELECT a FROM Address a WHERE a.userID = :userID AND a.isDefault = true")
    Optional<Address> findDefaultByUserID(@Param("userID") Long userID);
}
