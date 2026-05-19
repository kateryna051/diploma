package com.example.lithtalk.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "words")
public class Word {

    @Id @GeneratedValue
    private Long id;

    private String lithuanian;
    private String english;
    private String ukrainian;

    // static file paths
    private String imageUrl;
    private String audioUrl;

    // example sentences
    private String exampleSentenceLt;
    private String exampleSentenceEn;
    private String exampleSentenceUa;

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLithuanian() { return lithuanian; }
    public void setLithuanian(String lithuanian) { this.lithuanian = lithuanian; }

    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }

    public String getUkrainian() { return ukrainian; }
    public void setUkrainian(String ukrainian) { this.ukrainian = ukrainian; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getExampleSentenceLt() { return exampleSentenceLt; }
    public void setExampleSentenceLt(String exampleSentenceLt) { this.exampleSentenceLt = exampleSentenceLt; }

    public String getExampleSentenceEn() { return exampleSentenceEn; }
    public void setExampleSentenceEn(String exampleSentenceEn) { this.exampleSentenceEn = exampleSentenceEn; }

    public String getExampleSentenceUa() { return exampleSentenceUa; }
    public void setExampleSentenceUa(String exampleSentenceUa) { this.exampleSentenceUa = exampleSentenceUa; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
