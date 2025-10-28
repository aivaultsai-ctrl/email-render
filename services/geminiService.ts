import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export const generateLeadEmails = async (lead: Lead): Promise<GeneratedEmail[]> => {
  try {
    const prompt = `
      You are an elite sales development representative known for crafting hyper-personalized B2B cold outreach that gets replies.
      Your task is to write exactly 3 distinct, compelling, and concise outreach emails for the following lead. Your goal is to book a meeting.

      **Lead Information:**
      - Company Name: ${lead.companyName}
      - Contact Name: ${lead.contactName}
      - Contact Email: ${lead.contactEmail}
      - Website: ${lead.website}
      - Industry/Niche: ${lead.niche}

      **Instructions for Hyper-Personalization:**
      1.  **Analyze the Lead:** Scrutinize the lead's company name, website, and niche to infer their business model, target audience, and potential challenges.
      2.  **Create Specific Hooks:** For each email, create a unique and highly specific opening line. Do NOT use generic phrases like "Hope you're having a good week."
          - **Idea 1 (Industry Trend):** Reference a recent trend or statistic in the lead's niche ('${lead.niche}') and connect it to a potential opportunity for them.
          - **Idea 2 (Website Observation):** Act as if you've visited their website (${lead.website}). Mention something specific you (hypothetically) found impressive, like a case study, a recent blog post title, or their company mission. Example: "Saw your recent case study with [Client Type] and was impressed with the results you achieved."
          - **Idea 3 (Problem-Solving Angle):** Identify a common pain point for businesses like theirs and hint at a solution.
      3.  **Value Proposition:** Clearly and concisely state the value you can provide.
      4.  **Call-to-Action:** Each email must have a clear, low-friction call-to-action (e.g., "Would you be open to a brief 15-minute call next week to explore this?").

      **Output Format:**
      - Structure your response as a JSON object with a single key "emails".
      - The value of "emails" must be an array of 3 JSON objects.
      - Each object must have two keys: "subject" (string, make this catchy and personalized) and "body" (string).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emails: {
              type: Type.ARRAY,
              description: "An array of 3 distinct, personalized outreach emails.",
              items: {
                type: Type.OBJECT,
                properties: {
                  subject: {
                    type: Type.STRING,
                    description: "The subject line of the email."
                  },
                  body: {
                    type: Type.STRING,
                    description: "The body content of the email."
                  }
                },
                required: ["subject", "body"]
              }
            }
          }
        }
      }
    });

    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.emails && Array.isArray(jsonResponse.emails) && jsonResponse.emails.length > 0) {
      return jsonResponse.emails;
    }
    
    throw new Error("AI did not return the expected email format.");

  } catch (error) {
    console.error("Error generating lead emails:", error);
    throw new Error("Failed to generate emails. The AI may be experiencing issues.");
  }
};