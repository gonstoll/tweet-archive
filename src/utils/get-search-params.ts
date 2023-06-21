export function getSearchParams(params: URLSearchParams) {
  return [...params].map(([key, value]) => `${key}=${value}`).join('&')
}
