import React, { useState, useMemo, useCallback } from 'react';
import { Task, TaskStatus, TaskPriority, ProcessedAssociate, WorkloadBreakdown } from './types';
import { tasksData } from './data/tasks';
import { associatesData } from './data/associates';
import TaskCard from './components/TaskCard';
import AssociateCard from './components/AssociateCard';
import { getAIPrioritizationAndAssignments } from './services/geminiService';
import { BrainCircuitIcon } from './components/Icons';
import SortControls from './components/SortControls';


const priorityOrder: { [key in TaskPriority]: number } = {
    [TaskPriority.HIGHEST]: 5,
    [TaskPriority.HIGH]: 4,
    [TaskPriority.MEDIUM]: 3,
    [TaskPriority.LOW]: 2,
    [TaskPriority.LOWEST]: 1,
};

const statusOrder: { [key in TaskStatus]: number } = {
    [TaskStatus.IN_PROGRESS]: 1,
    [TaskStatus.DONE]: 2,
    [TaskStatus.NEW]: 0,
};


const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [unassignedSortKey, setUnassignedSortKey] = useState('aiPriorityScore');
  const [assignedSortKey, setAssignedSortKey] = useState('status');

  const associatesWithWorkload: ProcessedAssociate[] = useMemo(() => {
    return associatesData.map(assoc => {
        const workload: WorkloadBreakdown = {
            total: 0,
            jira: 0,
            serviceNowIncident: 0,
            serviceNowTask: 0,
            serviceNowProblem: 0,
        };

        tasks
            .filter(task => task.status === TaskStatus.IN_PROGRESS && task.assignedTo === assoc.id)
            .forEach(task => {
                workload.total++;
                if (task.id.startsWith('ZA-')) {
                    workload.jira++;
                } else if (task.id.startsWith('INC')) {
                    workload.serviceNowIncident++;
                } else if (task.id.startsWith('TASK')) {
                    workload.serviceNowTask++;
                } else if (task.id.startsWith('PRB')) {
                    workload.serviceNowProblem++;
                }
            });

        return { ...assoc, currentWorkload: workload };
    });
  }, [tasks]);

  const unassignedTasks = useMemo(() => {
    const filtered = tasks.filter(task => task.status === TaskStatus.NEW && !task.assignedTo);
    
    return filtered.sort((a, b) => {
        switch (unassignedSortKey) {
            case 'aiPriorityScore':
                return (b.aiPriorityScore || 0) - (a.aiPriorityScore || 0);
            case 'priority':
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'complexity':
                return b.complexity - a.complexity;
            default:
                 return (b.aiPriorityScore || 0) - (a.aiPriorityScore || 0);
        }
    });
  }, [tasks, unassignedSortKey]);

  const assignedTasks = useMemo(() => {
    const filtered = tasks.filter(task => task.status !== TaskStatus.NEW || task.assignedTo);

    return filtered.sort((a, b) => {
        switch(assignedSortKey) {
            case 'status':
                return statusOrder[a.status] - statusOrder[b.status];
            case 'priority':
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'assignee': {
                const nameA = associatesWithWorkload.find(assoc => assoc.id === a.assignedTo)?.name || 'zzz';
                const nameB = associatesWithWorkload.find(assoc => assoc.id === b.assignedTo)?.name || 'zzz';
                return nameA.localeCompare(nameB);
            }
            default:
                return statusOrder[a.status] - statusOrder[b.status];
        }
    });

  }, [tasks, associatesWithWorkload, assignedSortKey]);

  const handleRunAIAnalysis = useCallback(async () => {
    const tasksToAnalyze = tasks.filter(task => task.status === TaskStatus.NEW && !task.assignedTo);
    if (tasksToAnalyze.length === 0) {
      setError("No unassigned tasks to process.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUnassignedSortKey('aiPriorityScore');
    
    setTasks(currentTasks => 
        currentTasks.map(t => ({...t, suggestedTo: null, aiPriorityScore: undefined, aiReasoning: undefined }))
    );

    try {
      const recommendations = await getAIPrioritizationAndAssignments(tasksToAnalyze, associatesWithWorkload);
      
      setTasks(currentTasks => {
        const updatedTasks = [...currentTasks];
        recommendations.forEach(recommendation => {
          const taskIndex = updatedTasks.findIndex(t => t.id === recommendation.taskId);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex].suggestedTo = recommendation.suggestedAssociateId;
            updatedTasks[taskIndex].aiPriorityScore = recommendation.priorityScore;
            updatedTasks[taskIndex].aiReasoning = recommendation.reasoning;
          }
        });
        return updatedTasks;
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [tasks, associatesWithWorkload]);
  
  const handleAcceptSuggestion = useCallback((taskId: string, associateId: string) => {
    setTasks(prevTasks => {
        return prevTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, assignedTo: associateId, status: TaskStatus.IN_PROGRESS, suggestedTo: null };
            }
            return task;
        });
    });
  }, []);


  return (
    <div className="flex flex-col h-screen bg-slate-900 overflow-hidden">
      <header className="flex-shrink-0 bg-slate-950/80 backdrop-blur-sm border-b border-slate-700 px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
                <BrainCircuitIcon className="w-8 h-8 text-brand-primary" />
                <h1 className="text-xl font-bold text-slate-200">
                  Smart Task Prioritization
                </h1>
            </div>
             <p className="text-sm text-slate-400 hidden md:block">AI-powered assignments for Jira & ServiceNow</p>
        </div>
      </header>
      
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-6 lg:p-8 overflow-hidden">
        
        {error && (
            <div className="lg:col-span-3 bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg text-center animate-fade-in -mb-4">
              <strong>Error:</strong> {error}
            </div>
        )}
          
        {/* Unassigned Column */}
        <section className="flex flex-col gap-4 overflow-hidden">
           <div className="flex justify-between items-center flex-shrink-0">
             <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-200">Unassigned</h2>
                <span className="bg-slate-700 text-slate-200 text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full">{unassignedTasks.length}</span>
             </div>
             <SortControls 
                options={[
                    { key: 'aiPriorityScore', label: 'AI Score' },
                    { key: 'priority', label: 'Priority' },
                    { key: 'complexity', label: 'Complexity' },
                ]}
                activeSortKey={unassignedSortKey}
                onSortChange={setUnassignedSortKey}
             />
           </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleRunAIAnalysis}
              disabled={isLoading || unassignedTasks.length === 0}
              className="w-full flex items-center justify-center gap-3 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                  </>
              ) : (
                  <>
                  <BrainCircuitIcon className="w-6 h-6"/>
                  <span>AI Prioritize & Assign</span>
                  </>
              )}
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-2 min-h-0">
            {unassignedTasks.length > 0 ? (
                unassignedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      associates={associatesData}
                      onAccept={handleAcceptSuggestion} 
                    />
            ))
            ) : (
                <div className="text-center py-10 bg-slate-800 rounded-lg">
                    <p className="text-slate-400">No unassigned tasks. Great job team!</p>
                </div>
            )}
          </div>
        </section>

        {/* In Progress / Done Column */}
        <section className="flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-200">In Progress / Done</h2>
                <SortControls
                    options={[
                        { key: 'status', label: 'Status' },
                        { key: 'priority', label: 'Priority' },
                        { key: 'assignee', label: 'Assignee' },
                    ]}
                    activeSortKey={assignedSortKey}
                    onSortChange={setAssignedSortKey}
                />
            </div>
           <div className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-2 min-h-0">
              {assignedTasks.map(task => (
                <TaskCard key={task.id} task={task} associates={associatesData} onAccept={handleAcceptSuggestion} />
              ))}
           </div>
        </section>

        {/* Team Workload Column */}
        <section className="flex flex-col gap-4 overflow-hidden">
           <h2 className="text-xl font-bold text-slate-200 flex-shrink-0">Team Workload</h2>
           <div className="flex-1 space-y-3 overflow-y-auto pr-2 -mr-2 min-h-0">
              {associatesWithWorkload
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(associate => (
                <AssociateCard key={associate.id} associate={associate} />
              ))}
           </div>
        </section>
        
      </main>
    </div>
  );
};

export default App;