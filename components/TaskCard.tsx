import React from 'react';
import { Task, TaskPriority, TaskSource, Associate, TaskStatus } from '../types';
import { JiraIcon, ServiceNowIcon, UserIcon, CheckCircleIcon } from './Icons';

const priorityIconStyles: { [key in TaskPriority]: { color: string; icon: string } } = {
  [TaskPriority.HIGHEST]: { color: 'text-red-500', icon: '▲' },
  [TaskPriority.HIGH]: { color: 'text-orange-400', icon: '▲' },
  [TaskPriority.MEDIUM]: { color: 'text-yellow-400', icon: '▬' },
  [TaskPriority.LOW]: { color: 'text-blue-400', icon: '▼' },
  [TaskPriority.LOWEST]: { color: 'text-green-500', icon: '▼' },
};


const TaskCard: React.FC<{ task: Task; associates: Associate[]; onAccept: (taskId: string, associateId: string) => void; }> = ({ task, associates, onAccept }) => {
  const pIcon = priorityIconStyles[task.priority];
  const assignedAssociate = associates.find(a => a.id === task.assignedTo);
  const suggestedAssociate = associates.find(a => a.id === task.suggestedTo);

  return (
    <div className="bg-slate-800 rounded-md p-3 shadow-md border border-transparent hover:border-brand-primary transition-colors duration-200 animate-fade-in group">
      <div className="flex justify-between items-start mb-3">
        <p className="text-sm text-slate-200 font-medium pr-2">{task.title}</p>
        {task.aiPriorityScore !== undefined && (
            <div title="AI Priority Score" className="flex-shrink-0 text-xs font-bold text-slate-300 bg-slate-700/80 px-2 py-0.5 rounded">
                {task.aiPriorityScore}
            </div>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
            {task.source === TaskSource.JIRA ? <JiraIcon className="w-4 h-4" /> : <ServiceNowIcon className="w-4 h-4" />}
            <span className="font-mono">{task.id}</span>
            <span title={task.priority} className={`font-extrabold text-lg leading-none ${pIcon.color}`}>{pIcon.icon}</span>
        </div>
        
         <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-700 text-slate-300 whitespace-nowrap">{task.module}</span>
      </div>

       {suggestedAssociate && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between animate-fade-in">
            <div className="group relative flex items-center gap-2 text-sm text-purple-400">
                <UserIcon className="w-4 h-4" />
                <span>Suggested: {suggestedAssociate.name}</span>
                {task.aiReasoning && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                       <p className="font-bold mb-1 text-purple-300">AI Reasoning:</p>
                       {task.aiReasoning}
                    </div>
                )}
            </div>
            <button 
              onClick={() => onAccept(task.id, suggestedAssociate.id)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-green-600/20 text-green-300 px-2.5 py-1 rounded-md hover:bg-green-500 hover:text-white transition-colors"
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              Accept
            </button>
        </div>
      )}

      {assignedAssociate && !suggestedAssociate && (
        <div className={`mt-3 pt-3 border-t border-slate-700/50 flex items-center text-sm ${task.status === TaskStatus.DONE ? 'text-green-400' : 'text-slate-400'}`}>
          {task.status === TaskStatus.DONE ? <CheckCircleIcon className="w-4 h-4 mr-2"/> : <UserIcon className="w-4 h-4 mr-2"/>}
          <span>{task.status === TaskStatus.DONE ? 'Completed by' : 'Assigned to'} {assignedAssociate.name}</span>
        </div>
      )}

    </div>
  );
};

export default TaskCard;