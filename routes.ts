import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for questions
  app.get('/api/questions', async (req, res) => {
    try {
      // First try to load from public directory
      let questionsPath = path.resolve('./public/questions.json');
      
      // Fallback to attached_assets if public file doesn't exist
      if (!fs.existsSync(questionsPath)) {
        questionsPath = path.resolve('./attached_assets/questions.json');
      }
      
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
      res.json(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
      res.status(500).json({ error: 'Failed to load questions' });
    }
  });

  // API endpoint for careers
  app.get('/api/careers', async (req, res) => {
    try {
      // First try to load from public directory
      let careersPath = path.resolve('./public/careers.json');
      
      // Fallback to attached_assets if public file doesn't exist
      if (!fs.existsSync(careersPath)) {
        careersPath = path.resolve('./attached_assets/careers.json');
      }
      
      const careersData = JSON.parse(fs.readFileSync(careersPath, 'utf-8'));
      res.json(careersData);
    } catch (error) {
      console.error('Error loading careers:', error);
      res.status(500).json({ error: 'Failed to load careers' });
    }
  });

  // Profession info API using OpenAI
  app.post("/api/profession-info", async (req, res) => {
    try {
      const { profession } = req.body;
      
      if (!profession) {
        return res.status(400).json({ error: "Missing profession name" });
      }
      
      // Import OpenAI
      const OpenAI = require('openai');
      
      // Create an OpenAI API client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      // Create the prompt for OpenAI
      const prompt = `
I need detailed information about the profession: ${profession}.
Please provide the following information in JSON format:
1. title: The official title of this profession
2. description: A detailed description (2-3 paragraphs)
3. skills: An array of 5-7 key skills needed for this profession
4. education: Educational requirements for this profession
5. salary: Typical salary range
6. outlook: Job growth outlook for the next 5-10 years

Return ONLY valid JSON without any additional text. Format the response as a parseable JSON object.
`;
      
      // Call the OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: "You are a career information assistant that provides accurate and helpful information about professions in JSON format." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2  // Lower temperature for more consistent outputs
      });
      
      // Parse the response and send it back
      const responseText = completion.choices[0].message.content;
      const responseData = JSON.parse(responseText);
      
      res.json(responseData);
    } catch (error) {
      console.error("Error fetching profession info:", error);
      res.status(500).json({ 
        error: "Failed to fetch profession information",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Serve static files from public folder
  app.use(express.static(path.resolve('./public')));

  const httpServer = createServer(app);

  return httpServer;
}
