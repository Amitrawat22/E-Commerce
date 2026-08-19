package com.ecommerce.project.service;

import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.Review;
import com.ecommerce.project.payload.AiInsightDTO;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.ReviewRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiInsightService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiInsightDTO getProductAiInsight(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        List<Review> dbReviews = reviewRepository.findByProductProductIdOrderByCreatedAtDesc(productId);

        try {
            // Live Real-Time AI Generation using Google Gemini 3.6 Flash LLM (reading Product Specs + Real DB Customer Reviews)
            return callGeminiApi(product, dbReviews);
        } catch (Exception e) {
            System.err.println("⚠️ Gemini Live AI call fallback: " + e.getMessage());
            return getFallbackInsight(product);
        }
    }

    private AiInsightDTO callGeminiApi(Product product, List<Review> reviews) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + geminiApiKey;

        String reviewContext = "";
        if (reviews != null && !reviews.isEmpty()) {
            reviewContext = "REAL SUBMITTED CUSTOMER REVIEWS (" + reviews.size() + " total):\n" +
                    reviews.stream().limit(10).map(r -> String.format(
                            "- [%d/5 Stars] Location: %s | Title: \"%s\" | Comment: \"%s\"",
                            r.getRating(), r.getUserLocation(), r.getTitle(), r.getComment()
                    )).collect(Collectors.joining("\n"));
        } else {
            reviewContext = "NO SUBMITTED CUSTOMER REVIEWS YET. Synthesize analysis based on product specifications, materials, pricing tier, and global product category benchmarking.";
        }

        String prompt = String.format("""
            You are an expert global e-commerce & customer sentiment analyst. Analyze this product:
            Product Name: "%s"
            Category: "%s"
            Price: ₹%.2f
            Description: "%s"

            %s

            Synthesize BOTH the product specifications and any submitted customer reviews into a deep AI analysis.
            Return ONLY a raw JSON object (NO markdown formatting, NO backticks) with this exact structure:
            {
              "overallSentiment": "Highly Acclaimed (90%% Approval)",
              "regionalInsights": [
                {"region": "Humid & Tropical Climates", "rating": "4.8 / 5.0", "feedback": "Detailed regional climate feedback here."},
                {"region": "Cold & Sub-Zero Climates", "rating": "4.2 / 5.0", "feedback": "Detailed winter climate feedback here."},
                {"region": "Urban & Metro Commute", "rating": "4.9 / 5.0", "feedback": "Urban usage feedback here."}
              ],
              "topPraise": ["Key strength 1", "Key strength 2"],
              "commonDealbreakers": ["Potential drawback 1", "Potential drawback 2"],
              "idealFor": "Description of target user profile",
              "notRecommendedFor": "Description of unsuitable usage scenario"
            }
            """,
            product.getProductName(),
            product.getCategory() != null ? product.getCategory().getCategoryName() : "General",
            product.getSpecialPrice(),
            product.getDescription(),
            reviewContext
        );

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

            text = text.replace("```json", "").replace("```", "").trim();

            JsonNode jsonNode = objectMapper.readTree(text);

            AiInsightDTO dto = new AiInsightDTO();
            dto.setProductId(product.getProductId());
            dto.setProductName(product.getProductName());
            dto.setOverallSentiment(jsonNode.path("overallSentiment").asText("Highly Rated"));

            List<AiInsightDTO.RegionalInsight> regionalList = new ArrayList<>();
            if (jsonNode.has("regionalInsights")) {
                for (JsonNode rNode : jsonNode.get("regionalInsights")) {
                    regionalList.add(new AiInsightDTO.RegionalInsight(
                            rNode.path("region").asText(),
                            rNode.path("rating").asText(),
                            rNode.path("feedback").asText()
                    ));
                }
            }
            dto.setRegionalInsights(regionalList);

            List<String> praise = new ArrayList<>();
            if (jsonNode.has("topPraise")) {
                for (JsonNode pNode : jsonNode.get("topPraise")) praise.add(pNode.asText());
            }
            dto.setTopPraise(praise);

            List<String> dealbreakers = new ArrayList<>();
            if (jsonNode.has("commonDealbreakers")) {
                for (JsonNode dNode : jsonNode.get("commonDealbreakers")) dealbreakers.add(dNode.asText());
            }
            dto.setCommonDealbreakers(dealbreakers);

            dto.setIdealFor(jsonNode.path("idealFor").asText());
            dto.setNotRecommendedFor(jsonNode.path("notRecommendedFor").asText());
            dto.setSource("Live Google Gemini 3.6 Flash AI");

            System.out.println("✨ Live Gemini 3.6 Flash AI analyzed " + (reviews != null ? reviews.size() : 0) + " real reviews for: " + product.getProductName());
            return dto;
        }

        throw new RuntimeException("Gemini response was empty or non-200");
    }

    private AiInsightDTO getFallbackInsight(Product product) {
        List<AiInsightDTO.RegionalInsight> regional = new ArrayList<>();
        List<String> praise = new ArrayList<>();
        List<String> dealbreakers = new ArrayList<>();

        regional.add(new AiInsightDTO.RegionalInsight("Humid & Tropical Climates", "4.8 / 5.0", "Maintains high durability and performance in humid weather."));
        regional.add(new AiInsightDTO.RegionalInsight("Cold Climates", "4.2 / 5.0", "Operates reliably in lower outdoor temperatures."));
        regional.add(new AiInsightDTO.RegionalInsight("Urban Usage", "4.9 / 5.0", "Optimized for daily indoor & outdoor lifestyle."));

        praise.add("Exceptional build quality and premium materials");
        praise.add("Great value-for-money rating among users");
        dealbreakers.add("May require gentle maintenance over long-term use");

        return new AiInsightDTO(
                product.getProductId(),
                product.getProductName(),
                "Highly Approved (88% Positive Feedback)",
                regional,
                praise,
                dealbreakers,
                "Daily users looking for premium quality and reliability.",
                "Heavy industrial or extreme environment usage.",
                "Offline Backup Mode"
        );
    }
}
