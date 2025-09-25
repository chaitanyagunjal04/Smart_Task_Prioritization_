import { GoogleGenAI, Type } from "@google/genai";
import { Task, ProcessedAssociate } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AIPrioritizationResult {
  taskId: string;
  suggestedAssociateId: string;
  reasoning: string;
  priorityScore: number;
}

const BATCH_SIZE = 10; // Process tasks in batches for faster parallel execution

const generatePromptForBatch = (tasks: Task[], associates: ProcessedAssociate[]) => {
  // Note: Task description is omitted to reduce prompt size and improve speed.
  // The AI can infer context from the title, module, and priority.
  const prompt = `
    You are an expert AI assistant integrated into a Smart Task Prioritization Dashboard for a telecom project. Your job is to analyze tasks from Jira (ZA-xxxx) and ServiceNow(INCxxxxxx, TASKxxxxxx, PRBxxxxx), with telecom modules like SFDC(CRM), BRM, BPM, IIB, SOA, GIS, OSS, ServiceNow and Billing. You must prioritize tasks and recommend the best associate for assignment.

    **Your Tasks:**
    1.  **Prioritize:** Analyze each task and assign a "Priority Score" from 1 to 100 (100 being the most urgent and important).
    2.  **Assign:** Recommend the best-suited associate for each task.

    **Prioritization Criteria (use these to calculate the Priority Score):**
    *   **Urgency:** The task's priority field (e.g., 'Highest', 'High'). This is a primary factor.
    *   **Business Impact:** A measure of how critical the task is for the business (scale of 1-5).
    *   **Complexity:** How difficult the task is (scale of 1-5). Higher complexity for high-impact tasks should increase priority.
    *   **Dependencies:** Tasks that block others are more critical.
    *   **Implicit Factors:** Consider that 'Highest' priority tasks often have strict SLAs and tasks with 'Fix', 'Critical', 'Production', or 'INC' (Incident) in the title/ID are very urgent. Assume complex tasks have longer historical resolution times.

    **Associate Assignment Criteria:**
    *   **Skill Match:** The most important factor. Match the task's needs (inferred from title, and telecom 'module' mentioned) with the associate's skills.
    *   **Workload Balancing:** Prefer associates with a lower 'currentWorkload' (number of IN-PROGRESS tasks).
    *   **Past Performance:** (Assume associates with strong skill matches have performed well on similar tasks in the past).

    **Input Data:**

    **Associates:**
    ${JSON.stringify(associates.map(a => ({ id: a.id, name: a.name, skills: a.skills, currentWorkload: a.currentWorkload.total })), null, 2)}

    **Unassigned Tasks (This Batch):**
    ${JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, priority: t.priority, complexity: t.complexity, businessImpact: t.businessImpact, dependencies: t.dependencies, module: t.module })), null, 2)}

    **Output:**
    Provide a JSON object with a list of prioritized tasks and assignment suggestions. For each task, provide the task ID, a suggested associate ID, a priority score, and a brief reasoning for your recommendation.
  `;
  return prompt;
};


export const getAIPrioritizationAndAssignments = async (
  tasks: Task[],
  associates: ProcessedAssociate[]
): Promise<AIPrioritizationResult[]> => {

  const taskBatches: Task[][] = [];
  for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
    taskBatches.push(tasks.slice(i, i + BATCH_SIZE));
  }

  try {
    const batchPromises = taskBatches.map(batch => {
      const prompt = generatePromptForBatch(batch, associates);
      return ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for lower latency
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    taskId: { type: Type.STRING },
                    suggestedAssociateId: { type: Type.STRING },
                    reasoning: { type: Type.STRING },
                    priorityScore: { type: Type.NUMBER }
                  },
                  required: ["taskId", "suggestedAssociateId", "reasoning", "priorityScore"]
                }
              }
            },
            required: ["recommendations"]
          },
        },
      });
    });

    const responses = await Promise.all(batchPromises);
    
    const allRecommendations: AIPrioritizationResult[] = [];
    for (const response of responses) {
      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);
      if (result.recommendations) {
        allRecommendations.push(...result.recommendations);
      }
    }

    return allRecommendations;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get AI assignment suggestions.");
  }
};