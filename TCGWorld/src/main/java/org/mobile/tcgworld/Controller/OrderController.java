package org.mobile.tcgworld.Controller;

import org.mobile.tcgworld.Service.OrderService;
import org.mobile.tcgworld.dto.OrderDTO;
import org.mobile.tcgworld.entity.Order;
import org.mobile.tcgworld.enums.ResultCodeEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import  org.mobile.tcgworld.Result;
@RestController
@RequestMapping("/api/tcgworld/orders")
public class OrderController {
    @Autowired
    OrderService orderService;

    @GetMapping("/getAllOrders/{userID}")
    public Result getAllOrders(@PathVariable String userID,
                               @RequestParam(defaultValue = "0") int pageNumber,
                               @RequestParam(defaultValue = "10") int pageSize){
        Page<Order>  orders=orderService.getAllOrders(Long.valueOf(userID),pageNumber,pageSize);
        if(orders.isEmpty()){
            return Result.error(ResultCodeEnum.ORDER_NOT_FIND);
        }
        else return Result.success(orders);
    }
    @PostMapping("/createOrder")
    public Result createOrder(@RequestBody Order order){
        return Result.success();
    }
}
