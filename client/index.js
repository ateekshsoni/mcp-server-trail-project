//importing the required libraries
import { config } from "dotenv";
import readline from "readline/promises";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
config(); // Load environment variables from .env file
let tools = []; //initialize tools variabl
const ai = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }); // Initialize the GoogleGenerativeAI client with your API key
// Create a new instance of the Model Context Protocol client

const mcpClient = new Client({
  name: "example-client",
  version: "1.0.0",
});

const chatHistory = [];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

mcpClient
  .connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
  .then(async () => {
    console.log("Connected to MCP server");
    const tools = (await mcpClient.listTools()).tools.map((tool) => {
      return {
        name: tool.name,
        description: tool.description,
        parameters: {
          type: tool.inputSchema.type,
          properties: tool.inputSchema.properties,
          required: tool.inputSchema.required,
        },
      };
    });
    console.log("Tools: ", tools);
    chatLoop(); // Start the chat loop after connecting to the server
  });

async function chatLoop() {
  const question = await rl.question("You: ");
  chatHistory.push({
    role: "user",
    parts: [
      {
        text: question,
        type: "text",
      },
    ],
  });
  const response = await ai.models.generateContext({
    model: "gemini-2.0 flash",
    contents: chatHistory,
    config: {
      tools: [
        {
          functionDeclations: tools,
        },
      ],
    },
  });
  console.log("AI: ", response);

  

  const responseText = response.candidates[0].content[0].parts[0].text;
  chatHistory.push({
    role: "model",
    parts: [
      {
        text: responseText,
        type: "text",
      },
    ],
  });
  console.log("Model: ", responseText);

  chatLoop(); // Call chatLoop again to continue the conversation
}
