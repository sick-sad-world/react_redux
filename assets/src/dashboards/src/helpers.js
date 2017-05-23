export function makeUrl(dashboard) {
  return {
    ...dashboard,
    url: dashboard.name.toLowerCase().replace(' ', '-')
  };
}
