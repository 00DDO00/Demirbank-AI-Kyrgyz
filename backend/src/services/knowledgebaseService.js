const fs = require("fs");
const path = require("path");

class KnowledgebaseService {
  constructor() {
    this.knowledgeBase = null;
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      const knowledgeBasePath = path.join(
        __dirname,
        "../../../Comprehensive Dux8 Consulting Conversational Knowledge Base.txt"
      );
      this.knowledgeBase = fs.readFileSync(knowledgeBasePath, "utf8");
      console.log(
        "📚 [KNOWLEDGEBASE] Comprehensive conversational knowledge base loaded successfully"
      );
    } catch (error) {
      console.error(
        "❌ [KNOWLEDGEBASE] Error loading knowledge base:",
        error.message
      );
      this.knowledgeBase = "";
    }
  }

  searchKnowledgeBase(query) {
    if (!this.knowledgeBase) {
      return null;
    }

    const queryLower = query.toLowerCase();
    const sections = this.knowledgeBase.split("\n\n");
    const relevantSections = [];

    // Search through different sections
    for (const section of sections) {
      const sectionLower = section.toLowerCase();

      // Check if the section contains relevant keywords
      const keywords = queryLower.split(" ");
      let relevanceScore = 0;

      for (const keyword of keywords) {
        if (keyword.length > 2 && sectionLower.includes(keyword)) {
          relevanceScore += 1;
        }
      }

      // If section is relevant, add it to results
      if (relevanceScore > 0) {
        relevantSections.push({
          content: section.trim(),
          score: relevanceScore,
        });
      }
    }

    // Sort by relevance score and return top results
    relevantSections.sort((a, b) => b.score - a.score);

    if (relevantSections.length === 0) {
      return null;
    }

    // Return multiple relevant sections for comprehensive context
    // But limit to top 3 most relevant sections to avoid overwhelming
    const topResults = relevantSections.slice(0, 3);
    const combinedContent = topResults
      .map((result) => result.content)
      .join("\n\n");

    // If the combined content is too large, truncate it
    const maxSectionLength = 15000; // Limit each section to 15K characters
    if (combinedContent.length > maxSectionLength) {
      return combinedContent.substring(0, maxSectionLength) + "...";
    }

    return combinedContent;
  }

  getRelevantContext(userMessage) {
    const relevantInfo = this.searchKnowledgeBase(userMessage);

    if (relevantInfo) {
      // Significantly increased limit to accommodate the entire knowledge base
      const maxLength = 50000; // Increased from 800 to 50,000 characters
      const truncatedInfo =
        relevantInfo.length > maxLength
          ? relevantInfo.substring(0, maxLength) + "..."
          : relevantInfo;

      return `Based on the comprehensive Dux8 Consulting knowledge base, here is relevant information:\n\n${truncatedInfo}\n\nPlease use this information to provide accurate, conversational, and helpful responses about Dux8 Consulting services, case studies, and capabilities.`;
    }

    return null;
  }

  getFullKnowledgeBase() {
    return this.knowledgeBase;
  }

  getServiceOverview() {
    const overview = `
Dux8 Consulting (formerly Dux Consulting) is an AI consulting firm specializing in business transformation with 16+ years of combined experience.

Core Services:
1. AI Compatibility Audit - Comprehensive evaluation of organization's AI readiness
2. AI Training & Education - Custom programs for executives, managers, and employees
3. End-to-End AI Implementation - Complete transformation services
4. AI Community & Learning - Free Skool community for continuous learning

Key Differentiators:
- Proven track record with 30-50% efficiency improvements
- End-to-end service model (strategy through implementation)
- Industry-agnostic expertise with sector specialization
- Custom solution development vs. off-the-shelf tools
- Transparent pricing with ROI guarantees

Industries Served: E-commerce, Manufacturing, Finance, Healthcare, Technology, Defense

Contact: Ahmet Göker (Partner) - ahmet@dux8.com, +90 532 742 06 12
Website: www.dux8.com
    `;
    return overview.trim();
  }
}

module.exports = new KnowledgebaseService();
