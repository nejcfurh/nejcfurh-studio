import { AnalyticsBot } from './constants';

const analyticsBotMapping = [
  { bot: AnalyticsBot.GOOGLE, userAgent: 'Googlebot' },
  { bot: AnalyticsBot.FACEBOOK, userAgent: 'facebookexternalhit' },
  { bot: AnalyticsBot.TWITTER, userAgent: 'Twitterbot' },
  { bot: AnalyticsBot.LINKEDIN, userAgent: 'LinkedInBot' },
  { bot: AnalyticsBot.SLACK, userAgent: 'Slack' },
  { bot: AnalyticsBot.TELEGRAM, userAgent: 'TelegramBot' },
  { bot: AnalyticsBot.WHATSAPP, userAgent: 'WhatsApp' }
];

export const botNameFromUserAgent = (params: {
  userAgent: string;
}): AnalyticsBot => {
  const { userAgent } = params;

  const lowerCaseUserAgent = userAgent.toLocaleLowerCase();
  const foundBotMapping = analyticsBotMapping.find(
    ({ userAgent: botUserAgent }) =>
      lowerCaseUserAgent.includes(botUserAgent.toLocaleLowerCase())
  );

  if (foundBotMapping) {
    return foundBotMapping.bot;
  }

  return AnalyticsBot.OTHER;
};
