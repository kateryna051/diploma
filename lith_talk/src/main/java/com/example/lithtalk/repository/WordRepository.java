package com.example.lithtalk.repository;

import com.example.lithtalk.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {
    List<Word> findByCategoryId(Long categoryId);
}
