package org.mobile.tcgworld.Service;

import org.mobile.tcgworld.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface OrderService {
    Page<Order> getAllOrders(Long userID, int page, int size);
    void createOrder(Order order);
    void deleteOrderByID(Long id);
    void deleteBatch(List<Long> ids);
    void updateOrder(Order order);
}
