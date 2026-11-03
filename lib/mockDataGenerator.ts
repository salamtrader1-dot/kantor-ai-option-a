import { MockEvent, ActivityType } from '@/lib/types';

// Helper functions
const addMinutes = (date: Date, minutes: number) => new Date(date.getTime() + minutes * 60000);
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFromArray = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Staff role list
const STAFF_ROLES = [
  { key: 'fathi', name: 'FATHI', emoji: '🔎' },
  { key: 'qela', name: 'QELA', emoji: '💬' },
  { key: 'angel', name: 'ANGEL', emoji: '📥' },
  { key: 'cindy', name: 'CINDY', emoji: '📱' },
  { key: 'faza', name: 'FAZA', emoji: '✍️' },
  { key: 'nana', name: 'NANA', emoji: '🧑‍💼' },
  { key: 'cika', name: 'CIKA', emoji: '📊' },
  { key: 'salam', name: 'SALAM', emoji: '👑' },
];

// Generate mock events for realistic testing
export function generateMockData(startDate: Date, days: number = 7): MockEvent[] {
  const events: MockEvent[] = [];

  for (let day = 0; day < days; day++) {
    const dayStart = addMinutes(startDate, -days * 24 * 60 + day * 24 * 60);

    // FATHI (riset): 12-20 lead per day
    const leadCount = randomBetween(12, 20);
    for (let i = 0; i < leadCount; i++) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(360, 1320)), // 06:00 - 20:00
        actor: 'fathi',
        type: 'lead_found',
        data: {
          count: 1,
          quality: randomBetween(60, 90),
          leadId: `${day}-fathi-${i}`,
        },
      });
    }

    // QELA (komentar): 3-5 draft per day
    const draftCount = randomBetween(3, 5);
    for (let i = 0; i < draftCount; i++) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(360, 1320)),
        actor: 'qela',
        type: 'draft_created',
        data: {
          count: 1,
          draftId: `${day}-qela-${i}`,
        },
      });
    }

    // SALAM (approval): approve 60-80% of drafts
    const approveCount = randomBetween(2, 4);
    for (let i = 0; i < approveCount; i++) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(600, 1200)),
        actor: 'salam',
        type: 'approved',
        data: {
          count: randomBetween(1, 3),
          actor: 'qela',
          draftIds: [`${day}-qela-${i}`],
        },
      });
    }

    // ANGEL (intake): 5-10 lead per day
    const intakeCount = randomBetween(5, 10);
    for (let i = 0; i < intakeCount; i++) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(360, 1320)),
        actor: 'angel',
        type: 'lead_found',
        data: {
          count: 1,
          hotness: randomBetween(3, 10),
          leadId: `${day}-angel-${i}`,
        },
      });
    }

    // CINDY (followup): 2-4 DM per day, 0-2 deal per week
    const dmCount = randomBetween(2, 4);
    for (let i = 0; i < dmCount; i++) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(420, 1260)), // 07:00 - 21:00
        actor: 'cindy',
        type: 'on_call',
        data: {
          leadId: `${day}-cindy-${i}`,
        },
      });
    }

    // CIKA (report): 1 report per day at 07:30
    events.push({
      timestamp: addMinutes(dayStart, 450), // 07:30
      actor: 'cika',
      type: 'report',
      data: {
        leads: leadCount,
        drafts: draftCount,
        intakes: intakeCount,
      },
    });

    // Occasional deal (1-2 per week)
    if (Math.random() > 0.85) {
      events.push({
        timestamp: addMinutes(dayStart, randomBetween(420, 1260)),
        actor: 'cindy',
        type: 'deal_closed',
        data: {
          leadId: `${day}-deal-${Math.random()}`,
          amount: `Rp ${randomBetween(500, 1000)}jt`,
        },
      });
    }
  }

  // Sort by timestamp
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

// Get today's events from generated data
export function getTodayEvents(allEvents: MockEvent[]): MockEvent[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = addMinutes(today, 24 * 60);

  return allEvents.filter(
    (e) => e.timestamp >= today && e.timestamp < tomorrow
  );
}

// Get today's aggregated metrics
export function getLeaderboardMetrics(events: MockEvent[]) {
  const metrics: Record<string, any> = {};

  // Initialize all staff
  STAFF_ROLES.forEach((role) => {
    metrics[role.key] = {
      name: role.name,
      emoji: role.emoji,
      primaryCount: 0,
      primaryLabel: '',
      subMetrics: [],
      status: 'idle',
      statusLabel: '',
      trending: { change: 0, percent: 0, direction: 'flat' as const },
    };
  });

  // Aggregate events
  events.forEach((e) => {
    if (!metrics[e.actor]) return;

    switch (e.actor) {
      case 'fathi':
        metrics.fathi.primaryCount += 1;
        metrics.fathi.primaryLabel = 'Lead found';
        metrics.fathi.status = 'working';
        metrics.fathi.statusLabel = 'Searching...';
        break;

      case 'qela':
        metrics.qela.primaryCount += e.data.count || 1;
        metrics.qela.primaryLabel = 'Draft replies';
        metrics.qela.status = 'working';
        metrics.qela.statusLabel = 'Replying...';
        break;

      case 'angel':
        metrics.angel.primaryCount += 1;
        metrics.angel.primaryLabel = 'Lead intake';
        metrics.angel.status = 'working';
        metrics.angel.statusLabel = 'Processing...';
        break;

      case 'cindy':
        if (e.type === 'deal_closed') {
          metrics.cindy.primaryCount += 1;
          metrics.cindy.primaryLabel = 'Deal closed';
          metrics.cindy.status = 'complete';
          metrics.cindy.statusLabel = '🎉 Deal closed!';
        }
        break;

      case 'cika':
        metrics.cika.status = 'complete';
        metrics.cika.statusLabel = '✅ Report sent';
        break;
    }
  });

  return metrics;
}

// Generate realistic trending data
export function generateTrendingData() {
  const yesterday = addMinutes(new Date(), -24 * 60);
  const yesterdayEvents = generateMockData(yesterday, 1);
  const todayEvents = generateMockData(new Date(), 1);

  const yesterdayLeads = yesterdayEvents.filter(
    (e) => e.actor === 'fathi' && e.type === 'lead_found'
  ).length;
  const todayLeads = todayEvents.filter(
    (e) => e.actor === 'fathi' && e.type === 'lead_found'
  ).length;

  const change = todayLeads - yesterdayLeads;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'flat';

  return {
    change,
    percent: yesterdayLeads > 0 ? Math.round((change / yesterdayLeads) * 100) : 0,
    direction,
  };
}
