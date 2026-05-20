package com.bookstore.backend.controller;

import com.bookstore.backend.model.Order;
import com.bookstore.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin
public class OrderController {

    @Autowired
    private OrderService service;

    @PostMapping("/place")
    public Order placeOrder(@RequestParam Long userId) {
        return service.placeOrder(userId);
    }

    @GetMapping("/user/{id}")
    public java.util.List<Order> getUserOrders(@PathVariable Long id) {
        return service.getUserOrders(id);
    }
}