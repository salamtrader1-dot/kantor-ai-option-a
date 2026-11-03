/**
 * Export utilities for Kantor AI
 */

import { Activity, StafMetric } from './types';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((h) => {
          const value = row[h];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportActivitiesToCSV = (activities: Activity[]) => {
  const typeLabels: Record<string, string> = {
    lead_found: '🔎 Lead Found',
    draft_created: '📝 Draft Created',
    approved: '✅ Approved',
    deal_closed: '🎉 Deal Closed',
    report: '📊 Report',
    on_call: '📱 On Call',
    typing: '⌨️ Typing',
  };

  const data = activities.map((a) => ({
    timestamp: new Date(a.timestamp).toLocaleString(),
    actor: a.actor,
    type: typeLabels[a.type] || a.type,
    details: JSON.stringify(a.data),
  }));

  exportToCSV(data, `kantor-activities-${new Date().toISOString().split('T')[0]}`);
};

export const exportLeaderboardToCSV = (stafList: StafMetric[]) => {
  const data = stafList.map((s, idx) => ({
    rank: idx + 1,
    name: s.name,
    role: s.role_key,
    score: s.primaryCount,
    status: s.status,
    department: 'N/A', // Would come from real DB
  }));

  exportToCSV(data, `kantor-leaderboard-${new Date().toISOString().split('T')[0]}`);
};

export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateReport = (stafList: StafMetric[], activities: Activity[]): string => {
  const date = new Date().toLocaleString();
  const topPerformer = stafList[0];
  const totalActivities = activities.length;
  const activityTypes = new Set(activities.map((a) => a.type)).size;

  return `
KANTOR AI VIRTUAL - DAILY REPORT
Generated: ${date}

SUMMARY
-------
Total Staff: ${stafList.length}
Total Activities: ${totalActivities}
Activity Types: ${activityTypes}

TOP PERFORMER
${topPerformer.emoji} ${topPerformer.name} - ${topPerformer.primaryCount} ${topPerformer.primaryLabel}

LEADERBOARD
-----------
${stafList.map((s, i) => `${i + 1}. ${s.emoji} ${s.name.padEnd(15)} | ${s.primaryCount} ${s.primaryLabel}`).join('\n')}

NOTES
-----
- Click staff cards for detailed profiles
- Use filters to narrow down data
- Export data for external analysis
`;
};
