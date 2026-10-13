export const EDITORIAL_TIME_ZONE = 'America/Argentina/Buenos_Aires';
export function editorialDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: EDITORIAL_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const get = type => parts.find(part => part.type === type).value;
  return get('year') + '-' + get('month') + '-' + get('day') + 'T12:00:00-03:00';
}
