import type { Product } from '@features/configurator/types/types';
import type { AnalyticsClientPageEventBase } from '@shared-analytics/types.client';
import type { PageName } from 'app/constants/data/page.data';

import type { AnalyticsClientEventType } from './constants';

export type EmailSubscriptionEvents = {
  eventName: AnalyticsClientEventType.EMAIL_SUBSCRIBED;
  properties: {
    EmailSubscriptionGroupId: string;
  };
};

export type ConfigSubmissionEvent = {
  eventName: AnalyticsClientEventType.FRIENDS_OF_NATURE_CONFIG;
  properties: {
    name: string;
    email: string;
    timeInAWeek: string;
    whatMattersMost: string[];
    locationCity: string;
    locationState: string;
    locationCountry: string;
  };
};

export type ConfiguratorSubmissionEvent = {
  eventName:
    | AnalyticsClientEventType.WONDER_CONFIGURATOR_DATA
    | AnalyticsClientEventType.WONDER_CONFIGURATOR_DATA_NATURE_CAMERA_ONLY
    | AnalyticsClientEventType.WONDER_CONFIGURATOR_DATA_WONDER_BLOCKS_ONLY;
  properties: {
    email: string;
    product?: Product;
    bundleGardenCamera?: 'starter' | 'enthusiast' | 'hero';
    bundleWonderblocks?: 'starter' | 'enthusiast' | 'hero';
    typeOfWonderblocks?: 'classic' | 'smart';
    materialOfWonderblocks?: 'biodegradable' | 'oceanPlastic' | 'bioBased';
    fovGardenCamera?: 'macro' | 'wide' | 'macroAndWide';
    recordingMode?: 'daytime' | 'nightVision';
    batteryGardenCamera?: 1 | 2 | 'solar';
    flexibleStem?: boolean;
    clipGardenCamera?: boolean;
    hangingMount?: boolean;
    butterflyFeeder?: boolean;
    beeHotel?: boolean;
    bugHotel?: boolean;
    preSeededPots?: boolean;
    totalPrice?: number;
  };
};

export type PaymentSuccessEvent = {
  eventName: AnalyticsClientEventType.PAYMENT_SUCCESS;
  properties: {
    Email: string | null;
    PaymentIntentID: string;
    selectedPaymentMethod?: string;
  };
};

export type PaymentInitiatedEvent = Omit<PaymentSuccessEvent, 'eventName'> & {
  eventName: AnalyticsClientEventType.PAYMENT_INITIATED;
};

type PageViewEvent = AnalyticsClientPageEventBase<PageName>;

export type AnalyticsClientPageEvent = PageViewEvent;

export type AnalyticsClientEvent =
  | EmailSubscriptionEvents
  | ConfiguratorSubmissionEvent;

export type AnalyticsClientPaymentEvent =
  | PaymentSuccessEvent
  | PaymentInitiatedEvent;
