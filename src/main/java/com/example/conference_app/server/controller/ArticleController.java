package com.example.conference_app.server.controller;

import com.example.conference_app.server.model.Article;
import com.example.conference_app.server.service.ArticleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
public class ArticleController extends BaseController<Article, Long> {
    public ArticleController(ArticleService service) {
        super(service);
    }
}

