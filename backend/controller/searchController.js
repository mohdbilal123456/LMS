import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Course from "../models/courseModel.js";
dotenv.config();

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Initialize Google GenAI client
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        // Simplified prompt
        const prompt = `You are an assistant for an LMS platform.
A user typed: "${input}".
Return the single keyword that best matches from:
App Development, AI/ML, AI Tools, Data Science, Data Analytics,Data Structure,dsa,DSA, Ethical Hacking, UI UX Designing, Web Development, Others, Beginner, Intermediate, Advanced
Return ONLY that keyword, no explanation, no punctuation, no quotes.`;

        // Generate AI response
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // DEBUG: print the full response
        console.log("💡 Full AI Response:", JSON.stringify(response, null, 2));

        // Safe keyword extraction
        let keyword = "";
        if (response?.candidates?.length > 0) {
            const candidate = response.candidates[0];
            if (candidate.content?.parts?.length > 0) {
                keyword = candidate.content.parts[0].text?.trim() || "";
            }
        }



        console.log("🎯 Extracted AI Keyword:", keyword || "(empty, fallback to input)");

        // Helper: build MongoDB query
        const buildQuery = (term) => ({
            isPublished: true,
            $or: [
                { title: { $regex: term, $options: "i" } },
                { subTitle: { $regex: term, $options: "i" } },
                { description: { $regex: term, $options: "i" } },
                { category: { $regex: term, $options: "i" } },
                { level: { $regex: term, $options: "i" } },
            ],
        });

        // First search by user input
        let courses = await Course.find(buildQuery(input));

        // If no results, try AI keyword
        if (courses.length === 0 && keyword) {
            courses = await Course.find(buildQuery(keyword));
        }

        return res.status(200).json(courses);
    } catch (error) {
        console.error("AI search error:", error);
        return res.status(500).json({ message: "Search with AI error" });
    }
};
