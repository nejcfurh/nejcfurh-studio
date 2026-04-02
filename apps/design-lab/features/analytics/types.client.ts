import { PageName } from '@/utils/constants/page.data';
import type { AnalyticsClientPageEventBase } from '@analytics/types.client';

import type { AnalyticsClientEventType, ButtonNameType } from './constants';

export type ButtonTapEvent = {
  eventName: AnalyticsClientEventType.BUTTON_TAP;
  properties: {
    ButtonName: ButtonNameType;
  };
};

type PageViewEvent = AnalyticsClientPageEventBase<PageName>;

export type AnalyticsClientPageEvent = PageViewEvent;

export type AnalyticsClientEvent = ButtonTapEvent;
