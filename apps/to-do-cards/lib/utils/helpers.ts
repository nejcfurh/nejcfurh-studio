export function getDate() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return today.toLocaleDateString('en-US', options);
}

export function truncateUrl(url: string, maxLength = 15) {
  return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
}

export function extractImageName(url: string) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}
