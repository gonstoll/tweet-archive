export function searchParamsToString(params: URLSearchParams) {
  return [...params].map(([key, value]) => `${key}=${value}`).join('&')
}
