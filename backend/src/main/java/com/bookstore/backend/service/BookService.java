package com.bookstore.backend.service;

import com.bookstore.backend.model.Book;
import com.bookstore.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository repo;

    public List<Book> getAllBooks() {
        return repo.findAll();
    }

    public Book addBook(Book book) {
        return repo.save(book);
    }

    public void deleteBook(Long id) {
        repo.deleteById(id);
    }

    public Book updateBook(Long id, Book updatedBook) {
        return repo.findById(id).map(book -> {
            book.setTitle(updatedBook.getTitle());
            book.setAuthor(updatedBook.getAuthor());
            book.setPrice(updatedBook.getPrice());
            book.setStock(updatedBook.getStock());
            book.setCategory(updatedBook.getCategory());
            book.setImageUrl(updatedBook.getImageUrl());
            return repo.save(book);
        }).orElseThrow(() -> new RuntimeException("Book not found"));
    }
}