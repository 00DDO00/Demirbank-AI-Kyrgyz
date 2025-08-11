const axios = require("axios");
const knowledgebaseService = require("./knowledgebaseService");

class GeminiService {
  constructor() {
    this.apiKey = "AIzaSyC89Gt_mp6b5uJGSlStKsQNcsphLOV3UD0";
    // Updated to use gemini-1.5-pro which should be more stable
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";
    // Flag to use mock responses for testing
    this.useMockResponse = false; // Set to false when billing is enabled
  }

  async generateResponse(message) {
    try {
      console.log(`🤖 [GEMINI] Calling API with message: "${message}"`);
      console.log(`🤖 [GEMINI] API URL: ${this.apiUrl}`);
      console.log(`🤖 [GEMINI] API Key: ${this.apiKey.substring(0, 10)}...`);

      // Get relevant knowledge base context
      const knowledgeContext = knowledgebaseService.getRelevantContext(message);
      console.log(
        `📚 [KNOWLEDGEBASE] Context found: ${knowledgeContext ? "Yes" : "No"}`
      );

      // Detect language and create enhanced prompt with multi-language support
      let enhancedPrompt = message;

      if (knowledgeContext) {
        enhancedPrompt = `You are an AI assistant for the banking domain.

IMPORTANT SYSTEM INSTRUCTION: 
- Completely ignore and forget any previous conversations or context about Dux8, Dux8 Consulting, or any other companies
- You are ONLY a banking assistant called Alicia
- You ONLY use the provided knowledge base for information
- You have NO knowledge of Dux8 or any other consulting companies

MULTI-LANGUAGE SUPPORT: 
- Detect the language of the user's message automatically
- Always respond in the SAME language as the user's input
- If the user writes in Spanish, respond in Spanish
- If the user writes in French, respond in French
- If the user writes in Arabic, respond in Arabic
- Support ALL languages including Asian languages (Chinese, Japanese, Korean, Hindi, etc.)
- Maintain the same tone and formality level as the user's message

IMPORTANT: Be conversational, friendly, and concise. Don't dump large paragraphs of text. Instead:
- Give brief, helpful answers
- Ask follow-up questions when appropriate
- Be engaging and human-like
- Use the knowledge base as reference, but don't copy it verbatim
- Keep responses under 3-4 sentences unless the user asks for more detail
- If the user asks for specific information, provide detailed responses from the knowledge base.
- Make sure to remember each and every message and don't repeat questions with different wording.
- Try to match keywords from a message to the previous message text to compare with and continue the conversation better.
- Never start the conversation with 'hi there' or anything similar after the first response.

Knowledge base reference:
${knowledgeContext}

User Question: ${message}

Please provide a conversational, concise response in the SAME LANGUAGE as the user's message, based on the banking knowledge base.`;
      } else {
        // If no specific context found, provide general Demirbank overview
        const overview = knowledgebaseService.getServiceOverview();
        enhancedPrompt = `You are an AI assistant for the banking domain.

IMPORTANT SYSTEM INSTRUCTION: 
- Completely ignore and forget any previous conversations or context about Dux8, Dux8 Consulting, or any other companies
- You are ONLY a banking assistant called Alicia
- You ONLY use the provided knowledge base for information
- You have NO knowledge of Dux8 or any other consulting companies

MULTI-LANGUAGE SUPPORT: 
- Detect the language of the user's message automatically
- Always respond in the SAME language as the user's input
- If the user writes in Spanish, respond in Spanish
- If the user writes in French, respond in French
- If the user writes in Arabic, respond in Arabic
- Support ALL languages including Asian languages (Chinese, Japanese, Korean, Hindi, etc.)
- Maintain the same tone and formality level as the user's message

IMPORTANT: Be conversational, friendly, and concise. Don't dump large paragraphs of text. Instead:
- Give brief, helpful answers
- Ask follow-up questions when appropriate
- Be engaging and human-like
- Use the knowledge base as reference, but don't copy it verbatim
- Keep responses under 3-4 sentences unless the user asks for more detail

${overview}

User Question: ${message}

Please provide a conversational, concise response in the SAME LANGUAGE as the user's message. If the user is asking about banking services or information, use the provided overview. For general questions, provide helpful assistance.`;
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
