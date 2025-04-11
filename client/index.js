//importing the required libraries
import { config } from "dotenv";
import readline from "readline/promises";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { GoogleGenAI } from "@google/genai";
import { text } from "stream/consumers";
config(); // Load environment variables from .env file
let tools = []; //initialize tools variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Initialize the GoogleGenerativeAI client with your API key
// console.log(ai)
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
    tools = (await mcpClient.listTools()).tools.map((tool) => {
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
    chatLoop(); // Start the chat loop after connecting to the server
  });

async function chatLoop(toolCall) {
  if (toolCall) {
    chatHistory.push({
      role: "model",
      parts: [
        {
          text: ` calling tool ${toolCall.name}`,
          type: "text",
        },
      ],
    });

    const toolResult = await mcpClient.callTool({
      name: toolCall.name,
      arguments: toolCall.args,
    });

    chatHistory.push({
      role: "user",
      parts: [
        {
          text: `tool result ${toolResult.content[0].text}`,
          type: "text",
        },
      ],
    });
  } else {
    const question = await rl.question("You: ");
    chatHistory.push({
      role: "user",
      parts: [
        {
          text: question,
        },
      ],
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: chatHistory,
      config: {
        tools: [
          {
            // functionDeclations: tools,
            functionDeclarations: tools,
          },
        ],
      },
    });
    const functionCall = response.candidates[0].content.parts[0].functionCall;
    const responseText =
      response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    if (functionCall) {
      return chatLoop(functionCall);
    }

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

    chatLoop();
  } catch (err) {
    console.error("Error: ", err);
    return; // Exit the function if there is an error
  }
}
