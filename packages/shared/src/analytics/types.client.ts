export type EventNameBase = string;
export type PageNameBase = string;

export interface AnalyticsClientPageEventBase<
  PageName extends PageNameBase,
  Properties extends Record<string, unknown> = Record<string, unknown>
> {
  pageName: PageName;
  properties?: Properties;
}

export type AnalyticsClientEventPropertiesBase = {
  eventName: string;
  properties: Record<string, unknown>;
};
