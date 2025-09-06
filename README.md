# Voice-Powered AI Portfolio & Assistant

This is a Next.js-based personal portfolio website enhanced with a sophisticated, voice-powered AI assistant. The project leverages a modern tech stack including Next.js, React, Tailwind CSS for styling, ShadCN for UI components, and Genkit with the Gemini API for its intelligent features. The UI/UX is designed with a sleek, glassmorphism aesthetic.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Genkit](https://firebase.google.com/docs/genkit)
- **AI Models**: Google Gemini (Speech-to-Text, Chat, Text-to-Speech)
- **Data Persistence**: [Airtable](https://www.airtable.com/) for logging interactions.
- **Deployment**: Firebase App Hosting

---

## UI/UX Design

The visual design of this application is centered around a clean, modern, and futuristic "glassmorphism" aesthetic.

- **Theme**: Dark mode is the primary theme, creating a sophisticated and focused user experience.
- **Color Palette**: The palette is defined in `src/app/globals.css` using HSL CSS variables, allowing for easy theme customization.
  - **`--background`**: `33 20% 92%` (A very dark, almost black, neutral color for backgrounds)
  - **`--foreground`**: `0 0% 3.9%` (White/off-white for text)
  - **`--primary`**: `28 100% 50%` (A vibrant orange, used for calls-to-action and highlights)
  - **`--accent`**: `39 100% 50%` (A bright yellow, used for secondary highlights and interactive elements)
- **Key Design Elements**:
  - **Glassmorphism**: Achieved using `backdrop-blur` and semi-transparent background colors (e.g., `bg-white/10`). This creates a frosted-glass effect over background elements.
  - **Floating Orb**: The voice assistant is represented by a floating orb, which is draggable and expands into a chat interface upon interaction.
  - **Consistent UI**: ShadCN UI components provide a consistent and accessible set of building blocks (buttons, dialogs, etc.) that are styled to match the overall theme.

---

## File Structure

The project follows a standard Next.js App Router structure.

```
.
├── src/
│   ├── app/                      # Main application routes
│   │   ├── api/                  # (Optional) API routes
│   │   ├── about/                # Example "About" page
│   │   │   └── page.tsx
│   │   ├── globals.css           # Global styles and theme variables
│   │   ├── layout.tsx            # Root layout for the application
│   │   └── page.tsx              # Home page
│   │
│   ├── ai/                       # All AI-related logic
│   │   ├── client-flows.ts       # Client-side functions to call Genkit flows
│   │   ├── dev.ts                # Genkit dev server entry point
│   │   ├── flows/                # Server-side Genkit flows
│   │   │   └── gemini-assistant-flow.ts # Core logic for the AI assistant
│   │   ├── genkit.ts             # Genkit initialization and configuration
│   │   └── types.ts              # Zod schemas and TypeScript types for AI
│   │
│   ├── components/               # Reusable React components
│   │   ├── assistant/            # Components for the Voice Assistant UI
│   │   │   └── voice-assistant.tsx
│   │   ├── portfolio/            # Components specific to the portfolio pages
│   │   └── ui/                   # ShadCN UI components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── use-toast.ts
│   │
│   ├── lib/                      # Utility functions
│   │   └── utils.ts              # (e.g., cn for Tailwind class merging)
│   │
│   └── services/                 # Services for interacting with external APIs
│       └── airtable.ts           # Service for saving data to Airtable
│
├── public/                       # Static assets (images, fonts)
├── .env                          # Environment variables (needs to be created)
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
└── tailwind.config.ts            # Tailwind CSS configuration
```

---

## Getting Started

### 1. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following variables.

```env
# Your Google Gemini API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Airtable Configuration (for saving conversation logs)
AIRTABLE_API_KEY="YOUR_AIRTABLE_API_KEY"
AIRTABLE_BASE_ID="YOUR_AIRTABLE_BASE_ID"
AIRTABLE_TABLE_NAME="YOUR_AIRTABLE_TABLE_NAME"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

This project uses two concurrent development servers: one for the Next.js frontend and one for the Genkit AI flows.

- **Run the Next.js app:**
  ```bash
  npm run dev
  ```
  This will start the frontend on `http://localhost:9002`.

- **Run the Genkit server:**
  In a separate terminal, run:
  ```bash
  npm run genkit:watch
  ```
  This starts the Genkit development server, which provides the API endpoints that the frontend calls.

### 4. Open the Application

Navigate to `http://localhost:9002` in your browser to see the application running.
