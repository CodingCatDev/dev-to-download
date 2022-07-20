require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const axios = require("axios");
const directories = require("../util/directories");

const fetchMyArticles = async () => {
  if (!process.env.DEV_KEY) {
    throw "Add DEV_KEY to .env";
  }
  const per_page = process.env.DEV_PER_PAGE || 1000;
  const contentDir = "/content/myContent";
  directories.dirCleanCreate(contentDir);

  const URL = "https://dev.to/api/articles/me/all";

  const options = {
    headers: { "api-key": process.env.DEV_KEY },
    params: { per_page },
  };

  const res = await axios.get(URL, options);
  for (const article of res.data) {
    const normalizedTitle = article.title
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    const normalizedPublishedAt = article?.published_at?.split("T")[0];
    const fileName = `${normalizedPublishedAt}_${normalizedTitle}.md`;
    const markdown = article.body_markdown.split("\n");

    console.log(`${__dirname}/..${contentDir}/${fileName} created!`);
    fs.writeFileSync(
      `${__dirname}/..${contentDir}/${fileName}`,
      markdown.join("\n"),
      "utf-8"
    );
  }
};
exports.fetchMyArticles = fetchMyArticles;
