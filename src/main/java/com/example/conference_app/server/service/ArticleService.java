package com.example.conference_app.server.service;

import com.example.conference_app.server.model.Article;
import com.example.conference_app.server.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    // Получить все статьи
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // Получить статью по ID
    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    // Создать новую статью
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    // Удалить статью по ID
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
