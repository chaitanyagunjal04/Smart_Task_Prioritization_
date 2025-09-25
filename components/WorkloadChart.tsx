import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Associate } from '../types';

interface WorkloadChartProps {
  data: Associate[];
}

const getWorkloadColor = (workload: number) => {
  if (workload >= 8) return '#EF4444'; // red-500
  if (workload >= 5) return '#F59E0B'; // amber-500
  return '#22C55E'; // green-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="font-bold text-slate-200">{label}</p>
          <p className="text-brand-secondary">Workload: <span className="font-semibold">{payload[0].value} tasks</span></p>
        </div>
      );
    }
    return null;
  };


const WorkloadChart: React.FC<WorkloadChartProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 70,
        }}
      >
        <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            stroke="#334155"
            interval={0}
            angle={-60}
            textAnchor="end"
        />
        <YAxis 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            stroke="#334155"
            allowDecimals={false}
            width={30}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
        <Bar dataKey="currentWorkload" radius={[4, 4, 0, 0]}>
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getWorkloadColor(entry.currentWorkload)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkloadChart;
