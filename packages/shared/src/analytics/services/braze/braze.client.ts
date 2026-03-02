'use client';

import type { User } from '@braze/web-sdk';
import { captureError } from '@shared-observability/service';

export class BrazeClientSession {
  private debug: boolean;

  private token: string;

  private isInitialized = false;

  private isInitializing: Promise<void> | null = null;

  private brazeClient: {
    openSession: () => void;
    getUser: () => User | undefined;
  } | null = null;

  constructor(params: { token: string; debug?: boolean }) {
    const { token, debug = false } = params;

    this.token = token;
    this.debug = debug;
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.isInitializing) {
      return this.isInitializing;
    }

    this.isInitializing = new Promise((resolve, reject) => {
      import('./braze.client.exports')
        .then(({ initialize, openSession, getUser }) => {
          const wasInitialized = initialize(this.token, {
            baseUrl: 'sdk.fra-02.braze.eu',
            enableLogging: this.debug
          });

          if (!wasInitialized) {
            captureError({ messageOrError: 'Braze SDK failed to initialize!' });
          }

          this.isInitialized = true;
          this.brazeClient = { openSession, getUser };

          resolve();
        })
        .catch((error) => {
          captureError({ messageOrError: error });
          reject(error);
        })
        .finally(() => {
          this.isInitializing = null;
        });
    });

    return this.isInitializing;
  }

  private async setEmail(params: { email: string }): Promise<void> {
    const { email } = params;

    await this.initialize();

    const currentUser = this.brazeClient?.getUser();

    if (!currentUser) {
      captureError({ messageOrError: 'Braze user not found!' });

      return;
    }

    currentUser.setEmail(email);
  }

  async openSession(): Promise<void> {
    await this.initialize();

    this.brazeClient?.openSession();
  }

  async addToEmailSubscriptionGroup(params: {
    email: string;
    subscriptionGroupId: string;
  }): Promise<boolean> {
    const { email, subscriptionGroupId } = params;

    await this.setEmail({ email });

    const currentUser = this.brazeClient?.getUser();

    if (!currentUser) {
      captureError({ messageOrError: 'Braze user not found!' });

      return false;
    }

    const wasSubscriptionSet =
      currentUser.addToSubscriptionGroup(subscriptionGroupId);

    if (!wasSubscriptionSet) {
      captureError({
        messageOrError: `Braze subscription group ${subscriptionGroupId} failed to set for ${email}!`
      });
    }

    return wasSubscriptionSet;
  }
}
