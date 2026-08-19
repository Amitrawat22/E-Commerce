package com.ecommerce.project.controller;

import com.ecommerce.project.payload.AiInsightDTO;
import com.ecommerce.project.service.AiInsightService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AiInsightController {

    @Autowired
    private AiInsightService aiInsightService;

    @GetMapping("/public/products/{productId}/ai-insights")
    public ResponseEntity<AiInsightDTO> getProductAiInsight(@PathVariable Long productId) {
        AiInsightDTO insight = aiInsightService.getProductAiInsight(productId);
        return new ResponseEntity<>(insight, HttpStatus.OK);
    }
}
