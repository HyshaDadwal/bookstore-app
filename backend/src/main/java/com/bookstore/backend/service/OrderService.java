package com.bookstore.backend.service;

import com.bookstore.backend.model.*;
import com.bookstore.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Transactional
    public Order placeOrder(Long userId) {

        User user = userRepo.findById(userId).orElseThrow();
        List<Cart> cartItems = cartRepo.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = cartItems.stream()
                .mapToDouble(c -> c.getBook().getPrice() * c.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);
        order.setStatus("PLACED");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepo.save(order);

        // Clear the cart after placing the order
        cartRepo.deleteByUserId(userId);

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepo.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepo.save(order);
    }
}