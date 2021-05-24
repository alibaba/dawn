export default function <T = string>(params?: T | T[] | null): T[] {
  if (!params) {
    return [];
  } else if (Array.isArray(params)) {
    return params;
  }
  return [params];
}
