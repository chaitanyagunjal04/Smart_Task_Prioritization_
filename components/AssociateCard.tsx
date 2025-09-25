import React from 'react';
import { ProcessedAssociate } from '../types';

interface AssociateCardProps {
  associate: ProcessedAssociate;
}

const AssociateCard: React.FC<AssociateCardProps> = ({ associate }) => {
  const { total, jira, serviceNowIncident, serviceNowTask, serviceNowProblem } = associate.currentWorkload;
  
  return (
    <div className="bg-slate-800 p-4 rounded-md shadow-sm border border-slate-700/50 animate-fade-in">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-lg mr-3 flex-shrink-0">
          {associate.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-slate-200">{associate.name}</h3>
          <p className="text-sm text-slate-400">
            Workload: <span className="font-semibold text-slate-200">{total}</span> In Progress
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-slate-500 mb-2">SKILLS</h4>
        <div className="flex flex-wrap gap-1">
          {associate.skills.map(skill => (
            <span key={skill} className="bg-slate-700 text-slate-300 px-2 py-0.5 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-700/50">
          <h4 className="text-xs font-semibold text-slate-500 mb-2">IN-PROGRESS BREAKDOWN</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
            {jira > 0 && <p>Jira: <span className="font-semibold text-blue-400">{jira}</span></p>}
            {serviceNowIncident > 0 && <p>INC: <span className="font-semibold text-red-400">{serviceNowIncident}</span></p>}
            {serviceNowTask > 0 && <p>TASK: <span className="font-semibold text-green-400">{serviceNowTask}</span></p>}
            {serviceNowProblem > 0 && <p>PRB: <span className="font-semibold text-yellow-400">{serviceNowProblem}</span></p>}
            {total === 0 && <p className="text-slate-500 italic">No active tasks.</p>}
          </div>
      </div>

    </div>
  );
};

export default AssociateCard;