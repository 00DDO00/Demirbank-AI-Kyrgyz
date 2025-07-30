const axios = require("axios");
const knowledgebaseService = require("./knowledgebaseService");

class GeminiService {
  constructor() {
    this.apiKey = "AIzaSyCSyjC8bH3RNmLYx6kq6osmCiUHWsv5Wo0";
    // Updated to use gemini-1.5-pro which should be more stable
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
    // Flag to use mock responses for testing
    this.useMockResponse = false; // Set to false when billing is enabled
  }

  async generateResponse(message) {
    // Mock response for testing without billing
    if (this.useMockResponse) {
      console.log(`🤖 [GEMINI] Using mock response for: "${message}"`);
      const mockResponses = [
        "Hello! I'm a mock Gemini AI response. This is working perfectly! 🎉",
        "Great question! Here's a helpful response from the mock AI.",
        "I understand your message. This is a test response while billing is being set up.",
        "Thanks for chatting! This is a temporary response until the real Gemini API is connected.",
        "Interesting! Let me provide a thoughtful response to your message.",
      ];
      const randomResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      console.log(`🤖 [GEMINI] Mock response: ${randomResponse}`);
      return randomResponse;
    }

    try {
      console.log(`🤖 [GEMINI] Calling API with message: "${message}"`);
      console.log(`🤖 [GEMINI] API URL: ${this.apiUrl}`);
      console.log(`🤖 [GEMINI] API Key: ${this.apiKey.substring(0, 10)}...`);

      // Get relevant knowledge base context
      const knowledgeContext = knowledgebaseService.getRelevantContext(message);
      console.log(
        `📚 [KNOWLEDGEBASE] Context found: ${knowledgeContext ? "Yes" : "No"}`
      );

      // Create enhanced prompt with conversational instructions
      let enhancedPrompt = message;

      if (knowledgeContext) {
        enhancedPrompt = `You are an AI assistant for Dux8 Consulting, an AI consulting firm. 

IMPORTANT: Be conversational, friendly, and concise. Don't dump large paragraphs of text. Instead:
- Give brief, helpful answers
- Ask follow-up questions when appropriate
- Be engaging and human-like
- Use the knowledge base as reference, but don't copy it verbatim
- Keep responses under 3-4 sentences unless the user asks for more detail
- If the user asks for specific information, provide detailed responses from the knowledge base

Knowledge base reference:
${knowledgeContext}

User Question: ${message}

Please provide a conversational, concise response based on the Dux8 Consulting knowledge base.`;
      } else {
        // If no specific context found, provide general Dux8 overview
        const overview = knowledgebaseService.getServiceOverview();
        enhancedPrompt = `You are an AI assistant for Dux8 Consulting. 

IMPORTANT: Be conversational, friendly, and concise. Don't dump large paragraphs of text. Instead:
- Give brief, helpful answers
- Ask follow-up questions when appropriate
- Be engaging and human-like
- Use the knowledge base as reference, but don't copy it verbatim
- Keep responses under 3-4 sentences unless the user asks for more detail

${overview}

User Question: ${message}

Please provide a conversational, concise response. If the user is asking about Dux8 Consulting services or information, use the provided overview. For general questions, provide helpful assistance.`;
      }

      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      };

      console.log(
        `🤖 [GEMINI] Request body length: ${enhancedPrompt.length} characters`
      );

      const response = await axios.post(
        `${this.apiUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 second timeout for larger context
        }
      );

      console.log(`🤖 [GEMINI] Response status: ${response.status}`);
      console.log(
        `🤖 [GEMINI] Response data:`,
        JSON.stringify(response.data, null, 2)
      );

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]
      ) {
        const aiResponse = response.data.candidates[0].content.parts[0].text;
        console.log(
          `🤖 [GEMINI] AI Response: ${aiResponse.substring(0, 100)}...`
        );
        return aiResponse;
      } else {
        console.error(`🤖 [GEMINI] Invalid response structure:`, response.data);
        throw new Error("Invalid response structure from Gemini API");
      }
    } catch (error) {
      console.error(`🤖 [GEMINI] API Error:`, error.message);
      console.error(
        `🤖 [GEMINI] Error details:`,
        error.response?.data || "No response data"
      );
      console.error(`🤖 [GEMINI] Status code:`, error.response?.status);
      // Return a fallback response if API fails
      return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
  }
}

module.exports = new GeminiService();
