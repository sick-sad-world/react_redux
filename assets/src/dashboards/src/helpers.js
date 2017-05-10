export function makeUrl(dashboard) {
  dashboard.url = dashboard.name.toLowerCase().replace(' ', '-');
}
