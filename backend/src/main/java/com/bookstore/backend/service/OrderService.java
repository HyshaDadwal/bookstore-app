package com.bookstore.backend.service;

import com.bookstore.backend.model.*;
import com.bookstore.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    public Order placeOrder(Long userId) {

        User user = userRepo.findById(userId).orElseThrow();
        List<Cart> cartItems = cartRepo.findAll()
                .stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .toList();

        double total = cartItems.stream()
                .mapToDouble(c -> c.getBook().getPrice() * c.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus("PLACED");

        return orderRepo.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findAll().stream()
                .filter(o -> o.getUser().getId().equals(userId))
                .toList();
    }
}