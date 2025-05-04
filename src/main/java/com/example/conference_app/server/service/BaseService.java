package com.example.conference_app.server.service;

import com.example.conference_app.server.model.BaseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

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

    public T update(ID id, T entity) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Entity not found, id=" + id);
        }
        if (entity instanceof BaseEntity) {
            ((BaseEntity) entity).setId((Long) id);
        }
        return repository.save(entity);
    }

    public void delete(ID id) {
        repository.deleteById(id);
    }
}