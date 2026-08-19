package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiInsightDTO {
    private Long productId;
    private String productName;
    private String overallSentiment;
    private List<RegionalInsight> regionalInsights;
    private List<String> topPraise;
    private List<String> commonDealbreakers;
    private String idealFor;
    private String notRecommendedFor;
    private String source;

    public AiInsightDTO(Long productId, String productName, String overallSentiment, List<RegionalInsight> regionalInsights, List<String> topPraise, List<String> commonDealbreakers, String idealFor, String notRecommendedFor) {
        this.productId = productId;
        this.productName = productName;
        this.overallSentiment = overallSentiment;
        this.regionalInsights = regionalInsights;
        this.topPraise = topPraise;
        this.commonDealbreakers = commonDealbreakers;
        this.idealFor = idealFor;
        this.notRecommendedFor = notRecommendedFor;
        this.source = "Live Google Gemini 1.5 Flash AI";
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegionalInsight {
        private String region;
        private String rating;
        private String feedback;
    }
}
