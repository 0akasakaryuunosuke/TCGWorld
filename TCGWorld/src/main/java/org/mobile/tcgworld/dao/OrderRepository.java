package org.mobile.tcgworld.dao;

import org.mobile.tcgworld.entity.Item;
import org.mobile.tcgworld.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findOrdersByCustomerID(Long customerID, Pageable pageable);
    void deleteOrdersByIdIn(List<Long> ids);
    List<Order> findOrdersByIdIn(List<Long> ids);
}
