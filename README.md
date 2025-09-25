# Smart Task Prioritization Dashboard - Proof of Concept

This project is a Proof of Concept (POC) for an AI-powered dashboard designed to streamline task management in a complex telecom project environment. It intelligently analyzes, prioritizes, and suggests assignments for tasks from simulated Jira and ServiceNow queues, leveraging the Google Gemini API.

The interface is designed with a professional, Jira-inspired dark theme, featuring a stable layout with independently scrolling columns for a seamless user experience.

## Key Features

- **High-Performance AI Engine**: Utilizes parallel processing and a low-latency configuration to deliver AI-driven task prioritization and assignment recommendations with significant speed.
- **Intelligent Prioritization**: Automatically analyzes unassigned tasks and assigns a priority score (1-100) based on urgency, business impact, complexity, and keywords.
- **Context-Aware Assignment**: Recommends the best-suited associate by matching task requirements (module, title) against team members' skills and real-time workload.
- **Professional "Jira-Style" UI**: A clean, three-column layout (Unassigned, In Progress/Done, Team Workload) with a dark theme and blue accents allows for easy visualization of the entire workflow.
- **Dynamic Workload Balancing**: Calculates each associate's current workload based only on "In Progress" tasks, providing an accurate, real-time view of team capacity.
- **Granular Workload Breakdown**: Offers a detailed view of each team member's active tasks, broken down by source (Jira, ServiceNow INC, TASK, PRB).
- **One-Click Actions**: Users can accept AI suggestions with a single click, instantly assigning the task and moving it to the "In Progress" queue.
- **Flexible Sorting**: Provides controls to sort tasks by AI Score, Priority, Status, or Assignee.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`gemini-2.5-flash` model)
- **SDK**: `@google/genai`

## Project Structure

```
/
├── components/         # Reusable React components (TaskCard, AssociateCard, etc.)
├── data/               # Mock data for tasks and associates
├── services/           # Service for communicating with the Gemini API
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.html          # Main HTML entry point
└── index.tsx           # React application root
```

## Getting Started

This is a self-contained, client-side application. To run it, you need to provide a Google Gemini API key.

1.  **API Key**: The application expects the API key to be available as an environment variable named `API_KEY`. In a real development environment, you would set this in a `.env` file or your deployment service's configuration.
2.  **Run**: Open the `index.html` file in a modern web browser. The application will load and be ready to use.
3.  **Usage**: Click the "AI Prioritize & Assign" button to have the Gemini API analyze the unassigned tasks and provide recommendations. The results will appear significantly faster due to backend optimizations.