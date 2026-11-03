// Type definitions for Kantor AI Option A

export interface SubMetric {
  label: string;
  value: string | number;
  icon: string;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray';
}

export interface Trending {
  change: number;
  percent: number;
  direction: 'up' | 'down' | 'flat';
}

export interface Alert {
  type: 'positive' | 'warning' | 'error';
  text: string;
}

export type StafStatus = 'idle' | 'working' | 'pending' | 'complete';

export interface StafMetric {
  role_key: string;
  name: string;
  emoji: string;
  rank: number;

  // Primary counter
  primaryCount: number;
  primaryLabel: string;

  // Sub-metrics
  subMetrics: SubMetric[];

  // Status
  status: StafStatus;
  statusLabel: string;

  // Trending
  trending?: Trending;

  // Alert
  alert?: Alert;

  // Animate flag
  animating?: boolean;
}

export interface LeaderboardState {
  staf: Map<string, StafMetric>;
  lastUpdated: Date;
}

// Activity types
export type ActivityType =
  | 'lead_found'
  | 'draft_created'
  | 'approved'
  | 'deal_closed'
  | 'report'
  | 'on_call'
  | 'typing';

export interface ActivityData {
  [key: string]: any;
  count?: number;
  quality?: number;
  leadId?: string;
  hotness?: number;
  amount?: string;
  actor?: string;
}

export interface Activity {
  id: string;
  timestamp: Date;
  actor: string; // role_key
  type: ActivityType;
  data: ActivityData;
  animate: boolean;
}

// Mock event (internal format)
export interface MockEvent {
  timestamp: Date;
  actor: string;
  type: ActivityType;
  data: ActivityData;
}

// Office floor structure
export interface OfficeStaf {
  role_key: string;
  name: string;
  position: { x: number; y: number };
  desk: { x: number; y: number; width: number; height: number };
  activity?: 'idle' | 'searching' | 'typing' | 'on_call' | 'celebrating';
  currentMessage?: string;
}

export interface OfficeFloor {
  name: string;
  level: number;
  staf: OfficeStaf[];
}
