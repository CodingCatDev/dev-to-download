require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const axios = require("axios");
const directories = require("../util/directories");

const fetchUserArticles = async () => {
  if (!process.env.DEV_KEY || !process.env.DEV_USER) {
    throw "Add DEV_KEY and DEV_USER to .env";
  }
  const per_page = process.env.DEV_PER_PAGE || 1000;

  const contentDir = `/content/${process.env.DEV_USER}`;
  directories.dirCleanCreate(contentDir);

  const URL = `https://dev.to/api/articles`;

  const userOptions = {
    headers: { "api-key": process.env.DEV_KEY },
    params: { per_page, username: process.env.DEV_USER },
  };

  try {
    const res = await axios.get(URL, userOptions);

    for (const orgArticle of res.data) {
      const options = {
        headers: { "api-key": process.env.DEV_KEY },
      };
      const response = await axios.get(
        `https://dev.to/api/articles/${orgArticle.id}`,
        options
      );
      const article = response.data;
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
  } catch (error) {
    console.error("ERROR:", JSON.stringify(error));
  }
};
exports.fetchUserArticles = fetchUserArticles;
