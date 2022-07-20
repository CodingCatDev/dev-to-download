const fetchMyArticles = require("./lib/fetchMyArticles.js");
const fetchUserArticles = require("./lib/fetchUserArticles.js");

(async () => {
  try {
    await fetchMyArticles.fetchMyArticles();
  } catch (error) {
    console.error(error);
  }

  if (process.env.DEV_USER) {
    try {
      await fetchUserArticles.fetchUserArticles();
    } catch (error) {
      console.error(error);
    }
  }
})();
