import { GoogleGenAI } from "@google/genai"; // import GoogleGenAI to interact with Google's generative AI services
import dotenv from "dotenv"; // import dotenv to load environment variables from a .env file into process.env
import Course from "../models/courseModel.js"; // import Course model to interact with course data stored in the database
dotenv.config(); // load environment variables so sensitive configuration like API keys is available at runtime

export const searchWithAi = async ( // define an asynchronous function to handle AI-powered search logic which takes the following arguments
  req, // HTTP request object to access request data such as body and headers
  res // HTTP response object to send structured responses back to the client
) => {
  try {
    const { input } = req.body; // extract the search input provided by the client to use as the AI query

    if (!input) return res.status(400).json({ message: "Search query is required" }); // validate that input exists to prevent unnecessary AI calls and return a client error if missing

    const ai = new GoogleGenAI({}); // create a new GoogleGenAI instance to communicate with the AI service

    const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

- App Development  
- AI/ML  
- AI Tools  
- Data Science  
- Data Analytics  
- Ethical Hacking  
- UI UX Designing  
- Web Development  
- Others  
- Beginner  
- Intermediate  
- Advanced  

Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

Query: ${input}
`

    const response = await ai.models.generateContent({ // request AI-generated content using the provided prompt to derive a refined search keyword
      model: "gemini-2.5-flash", // specify the Gemini model variant optimized for fast content generation
      contents: prompt, // pass the constructed prompt to guide the AI response
    });

    const keyword = response.text; // extract the generated keyword text from the AI response to use as a fallback search term

    const courses = await Course.find({ // query the database to find published courses matching the user input
      isPublished: true, // restrict results to courses that are publicly available
      // apply a case-insensitive regex filter using the user input across the following course fields: title, subtitle, description, category, and level
      $or: [
        { title: { $regex: input, $options: "i" } },
        { subTitle: { $regex: input, $options: "i" } },
        { description: { $regex: input, $options: "i" } },
        { category: { $regex: input, $options: "i" } },
        { level: { $regex: input, $options: "i" } }
      ]
    });

    if (courses.length > 0) return res.status(200).json(courses); // short-circuit response when direct input search yields results

    else {
      const courses = await Course.find({ // run a fallback query using the AI-derived keyword
        isPublished: true, // limit results to published courses only
        // reuse the same multi-field regex strategy with the generated keyword
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { subTitle: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { level: { $regex: keyword, $options: "i" } }
        ]
      });
      
      return res.status(200).json(courses); // return results from the AI-assisted search
    }
  } catch (error) {
    console.log(error); // log runtime errors for debugging visibility
  }
}