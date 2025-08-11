const fs = require("fs");
const path = require("path");

class KnowledgebaseService {
  constructor() {
    this.knowledgeBase = null;
    this.knowledgeBaseName = null;
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      // Use environment variable or default to Demirbank
      const kbFile =
        process.env.KNOWLEDGEBASE_FILE ||
        "Comprehensive DemirBank Kyrgyzstan Conversational Knowledge Base_V2.txt";
      const knowledgeBasePath = path.join(
        __dirname,
        `../../../Training Data/${kbFile}`
      );
      this.knowledgeBase = fs.readFileSync(knowledgeBasePath, "utf8");
      this.knowledgeBaseName = kbFile.replace(/\.txt$/, "");
      console.log(
        `📚 [KNOWLEDGEBASE] Loaded knowledge base: ${this.knowledgeBaseName}`
      );
    } catch (error) {
      console.error(
        "❌ [KNOWLEDGEBASE] Error loading knowledge base:",
        error.message
      );
      this.knowledgeBase = "";
      this.knowledgeBaseName = null;
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
      // Increased limit to accommodate the entire knowledge base
      const maxLength = 90000;
      const truncatedInfo =
        relevantInfo.length > maxLength
          ? relevantInfo.substring(0, maxLength) + "..."
          : relevantInfo;
      return `Based on the comprehensive ${this.knowledgeBaseName} knowledge base, here is relevant information:\n\n${truncatedInfo}\n\nPlease use this information to provide accurate, conversational, and helpful responses about this domain. Assume that you are a banking assistant called Alicia tasked with providing the user with the information they desire and answering their questions. Keep your responses concise and refrain from spouting out too much information at once. Treat this as a conversation, not a knowledge terminal. Only use the ${this.knowledgeBaseName} knowledge base. Never ask questions back to back, always try to point the user to their desired goal that they tell you. If at any point you refer a user to the website, also refer them to the app and add the links. App Store link: 'https://apps.apple.com/kg/app/demirbank-bank-for-your-life/id884950934', Google Play link: 'https://play.google.com/store/apps/details?id=kg.demirbank.mobileib.v3&hl=ru&pli=1'. ONLY REFER USER TO THE LINKS ONCE EVERY 10 MESSAGES."`;
    }
    return null;
  }

  getFullKnowledgeBase() {
    return this.knowledgeBase;
  }

  getServiceOverview() {
    return `Active Knowledge Base: ${this.knowledgeBaseName || "None"}`;
  }
}

module.exports = new KnowledgebaseService();
