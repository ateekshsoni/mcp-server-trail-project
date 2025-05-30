# Model Context Protocol (MCP) Server Project

This project demonstrates integration between a client application and an MCP (Model Context Protocol) server, allowing for AI-powered interactions with tool execution capabilities.

## Project Overview

This application consists of two main components:
- A **client** that connects to Google's Gemini AI model and an MCP server
- An **MCP server** that registers and provides tools for the AI model to use

The system allows users to interact with the Gemini AI model through a command-line interface. The AI can respond to user queries and execute specialized tools hosted on the MCP server, such as posting tweets or performing calculations.

## Architecture

```
├── client/              # Client application
│   ├── .env             # Environment variables for client
│   ├── index.js         # Client implementation
│   └── package.json     # Client dependencies
└── server/              # MCP server
    ├── .env             # Environment variables for server
    ├── index.js         # Server implementation
    ├── mcp.tool.js      # Tool implementations
    └── package.json     # Server dependencies
```

## Features

- AI chat interface using Google's Gemini model
- Tool execution through MCP protocol
- Available tools:
  - `addTwoNumbers`: Performs addition of two numbers
  - `createPost`: Creates a post on Twitter/X

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Twitter/X API credentials

### Server Setup
1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the `.env` file with your Twitter API credentials:
   ```
   TWITTER_API_KEY=your_api_key
   TWITTER_API_KEY_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   ```
4. Start the server:
   ```
   node index.js
   ```

### Client Setup
1. Navigate to the client directory:
   ```
   cd client
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the `.env` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the client:
   ```
   node index.js
   ```

## Usage

1. Start the server first, then the client
2. When the client connects, you'll see a prompt for input
3. Type your question or request
4. The AI will respond directly or use one of the tools if needed

Example interactions:
- "What's 25 plus 17?" (Uses the addTwoNumbers tool)
- "Post a tweet that says 'Hello from my MCP project!'" (Uses the createPost tool)

## How It Works

1. The client connects to the MCP server via SSE (Server-Sent Events)
2. The server registers available tools with input schemas using Zod validation
3. User queries are sent to Google's Gemini AI model
4. If the AI determines a tool should be used, it makes a function call
5. The function call is routed through the MCP client to the MCP server
6. The server executes the requested tool and returns results
7. Results are presented to the user and added to chat history

## Technologies Used

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - For MCP implementation
- [@google/genai](https://www.npmjs.com/package/@google/genai) - For Gemini AI integration
- [Express](https://www.npmjs.com/package/express) - Web server framework
- [twitter-api-v2](https://www.npmjs.com/package/twitter-api-v2) - Twitter API client
- [zod](https://www.npmjs.com/package/zod) - Schema validation
