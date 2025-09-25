export enum TaskSource {
  JIRA = 'Jira',
  SERVICENOW = 'ServiceNow',
}

export enum TaskPriority {
  HIGHEST = 'Highest',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  LOWEST = 'Lowest',
}

export enum TaskStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  source: TaskSource;
  priority: TaskPriority;
  status: TaskStatus;
  complexity: number; // 1-5
  businessImpact: number; // 1-5
  dependencies: string[];
  assignedTo: string | null;
  module: string;
  suggestedTo?: string | null;
  aiPriorityScore?: number;
  aiReasoning?: string;
}

export interface Associate {
  id: string;
  name: string;
  skills: string[];
  currentWorkload: number;
}

export interface WorkloadBreakdown {
  total: number;
  jira: number;
  serviceNowIncident: number;
  serviceNowTask: number;
  serviceNowProblem: number;
}

export interface ProcessedAssociate extends Omit<Associate, 'currentWorkload'> {
  currentWorkload: WorkloadBreakdown;
}
