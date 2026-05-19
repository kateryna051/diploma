package com.example.lithtalk.controller;

import com.example.lithtalk.entity.Category;
import com.example.lithtalk.entity.Word;
import com.example.lithtalk.service.LanguageService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LanguageController {

    private final LanguageService languageService;

    public LanguageController(LanguageService languageService) {
        this.languageService = languageService;
    }

    // Categories
    @PostMapping("/categories")
    public Category createCategory(@RequestBody Category category) {
        return languageService.addCategory(category);
    }

    @GetMapping("/categories")
public List<Category> listCategories(@RequestParam(defaultValue = "en") String lang) {
    return languageService.getAllCategoriesByLanguage(lang);
}

    // Words
    @PostMapping("/categories/{id}/words")
    public Word createWord(@PathVariable Long id, @RequestBody Word word) {
        return languageService.addWord(id, word);
    }

    @GetMapping("/categories/{id}/words")
    public List<Word> getWords(@PathVariable Long id) {
        return languageService.getWordsByCategory(id);
    }
}
