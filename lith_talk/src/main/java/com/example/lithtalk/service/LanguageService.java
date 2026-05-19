package com.example.lithtalk.service;

import com.example.lithtalk.entity.Category;
import com.example.lithtalk.entity.Word;
import com.example.lithtalk.repository.CategoryRepository;
import com.example.lithtalk.repository.WordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService {

    private final CategoryRepository categoryRepo;
    private final WordRepository wordRepo;

    public LanguageService(CategoryRepository categoryRepo, WordRepository wordRepo) {
        this.categoryRepo = categoryRepo;
        this.wordRepo = wordRepo;
    }

    // ✅ Add Category
    public Category addCategory(Category category) {
        return categoryRepo.save(category);
    }

    // ✅ Get all categories (default, no language filter)
    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    // ✅ Get all categories filtered by language (for ?lang=en|lt|ua)
    public List<Category> getAllCategoriesByLanguage(String lang) {
        List<Category> categories = categoryRepo.findAll();

        // Return only the requested language fields
        return categories.stream().map(category -> {
            Category dto = new Category();
            dto.setId(category.getId());
            dto.setPhotoUrl(category.getPhotoUrl());

            switch (lang.toLowerCase()) {
                case "lt" -> dto.setName(category.getNameLt());
                case "ua" -> dto.setName(category.getNameUa());
                default -> dto.setName(category.getNameEn());
            }
            return dto;
        }).toList();
    }

    // ✅ Add a Word to a Category
    public Word addWord(Long categoryId, Word word) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        word.setCategory(category);
        return wordRepo.save(word);
    }

    // ✅ Get Words by Category ID
    public List<Word> getWordsByCategory(Long categoryId) {
        return wordRepo.findByCategoryId(categoryId);
    }
}
