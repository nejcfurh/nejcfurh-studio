import type { BrazeClientSession } from './braze.client';

export interface AnalyticBrazeConfig {
  debug?: boolean;
  token: string;
}

export interface BrazeContextState {
  brazeSession: BrazeClientSession;
}
