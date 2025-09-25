
import React from 'react';

export const JiraIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.23 2.08c-2.09.2-3.77 1.1-5.12 2.51l.08.07c1.47-1.33 3.19-2.06 5.12-2.31l-.08-.27z"
      fill="#2684FF"
    />
    <path
      d="M12.15 21.93c2.09-.2 3.77-1.1 5.12-2.51l-.08-.07c-1.47 1.33-3.19 2.06-5.12 2.31l.08.27z"
      fill="#2684FF"
    />
    <path
      d="M7.11 4.59C5.7 6.01 4.8 7.82 4.41 9.87l.29-.03c.36-1.95 1.2-3.66 2.53-5.06l-.12-.19z"
      fill="#0052CC"
    />
    <path
      d="M16.89 19.41c1.41-1.42 2.31-3.23 2.7-5.28l-.29.03c-.36 1.95-1.2 3.66-2.53 5.06l.12.19z"
      fill="#0052CC"
    />
  </svg>
);

export const ServiceNowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.28 15.39L6 12.69l1.41-1.41 3.31 3.3 7.07-7.07L19.2 9l-8.48 8.39z"
      fill="#81B54B"
    />
  </svg>
);

export const UserIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

export const BrainCircuitIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0-3.54 19.54" />
        <path d="M12 2a10 10 0 0 1 3.54 19.54" />
        <path d="M12 2v20" />
        <path d="M12 8a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
        <path d="M12 16a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" />
        <path d="M4.5 12.5h-2" />
        <path d="M21.5 12.5h-2" />
        <path d="M12 4.5V2" />
        <path d="M12 22v-2.5" />
    </svg>
);

export const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);
