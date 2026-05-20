package com.bookstore.backend.controller;

import com.bookstore.backend.model.*;
import com.bookstore.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired private UserRepository userRepo;
    @Autowired private BookRepository bookRepo;
    @Autowired private OrderRepository orderRepo;

    // 👥 Get all users
    @GetMapping("/users")
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    // Get all books
    @GetMapping("/books")
    public List<Book> getBooks() {
        return bookRepo.findAll();
    }

    // Get all orders
    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderRepo.findAll();
    }

    // Dashboard stats
    @GetMapping("/stats")
    public String getStats() {
        long users = userRepo.count();
        long books = bookRepo.count();
        long orders = orderRepo.count();

        return "Users: " + users +
                ", Books: " + books +
                ", Orders: " + orders;
    }
}