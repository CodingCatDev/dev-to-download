const fetchMyArticles = require("./lib/fetchMyArticles.js");
const fetchUserArticles = require("./lib/fetchUserArticles.js");

(async () => {
  if (!process.env.DEV_NOT_MINE) {
    try {
      await fetchMyArticles.fetchMyArticles();
    } catch (error) {
      console.error(error);
    }
  }
  if (process.env.DEV_USER) {
    try {
      await fetchUserArticles.fetchUserArticles();
    } catch (error) {
      console.error(error);
    }
  }
})();
