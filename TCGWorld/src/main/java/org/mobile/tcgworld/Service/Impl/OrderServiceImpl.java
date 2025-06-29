package org.mobile.tcgworld.Service.Impl;

import org.mobile.tcgworld.Service.OrderService;
import org.mobile.tcgworld.dao.OrderRepository;
import org.mobile.tcgworld.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepository;
    @Override
    public Page<Order> getAllOrders(Long userID, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findOrdersByCustomerID(userID, pageable);
    }

    @Override
    public void createOrder(Order order) {
       orderRepository.save(order);
    }

    @Override
    public void deleteOrderByID(Long id) {
        Optional<Order> order =orderRepository.findById(id);
        if(order.isPresent()){
            orderRepository.deleteById(id);
        }
        else{
            throw  new RuntimeException("订单不存在");
        }
    }

    @Override
    public void deleteBatch(List<Long> ids) {
        List<Order> orderList =orderRepository.findOrdersByIdIn(ids);
        if(orderList.isEmpty()){
            throw  new RuntimeException("未找到订单");
        }
        else{
            orderRepository.deleteAll(orderList);
        }
    }

    @Override
    public void updateOrder(Order order) {
        orderRepository.save(order);
    }
}
