export function safeParseJson(data: any, fallback: any = []): any {
  if (!data) return fallback;
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    if (data.includes(',')) {
      return data.split(',').map((s: string) => s.trim());
    }
    return [data];
  }
}
