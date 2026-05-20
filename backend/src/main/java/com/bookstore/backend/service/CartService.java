package com.bookstore.backend.service;

import com.bookstore.backend.model.*;
import com.bookstore.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookRepository bookRepo;

    public Cart addToCart(Long userId, Long bookId, int quantity) {
        User user = userRepo.findById(userId).orElseThrow();
        Book book = bookRepo.findById(bookId).orElseThrow();

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setBook(book);
        cart.setQuantity(quantity);

        return cartRepo.save(cart);
    }

    public List<Cart> getUserCart(Long userId) {
        return cartRepo.findAll()
                .stream()
                .filter(c -> c.getUser().getId().equals(userId))
                .toList();
    }
}