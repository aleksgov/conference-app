package com.example.conference_app.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import java.util.List;

public abstract class BaseService<T, ID> {
    @Autowired
    protected JpaRepository<T, ID> repository;

    public List<T> getAll() {
        return repository.findAll();
    }

    public T getById(ID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found"));
    }

    public T create(T entity) {
        return repository.save(entity);
    }

    public void delete(ID id) {
        repository.deleteById(id);
    }
}