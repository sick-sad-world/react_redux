export default {
  url: "http://api.trendolizer.com/v3/",
  messageTypes: ["error", "success", "message"],
  messageIcons: {},
  getUrl (url) {
    return this.url+(url || "");
  }
}