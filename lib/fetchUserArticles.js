require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const axios = require("axios");
const directories = require("../util/directories");
const pause = require("../util/pause");
const jfm = require("json-to-frontmatter-markdown");

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
      //Slowing down because I am too lazy to deal with 429
      await pause.sleep(process.env.PAUSE || 300);

      const response = await axios.get(
        `https://dev.to/api/articles/${orgArticle.id}`,
        options
      );
      const article = response.data;
      const normalizedTitle = article.title
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toLowerCase();

      const noBody = { ...article };
      delete noBody.body_html;
      delete noBody.body_markdown;
      const fileName = `${normalizedTitle}.md`;

      jfm.default({
        frontmatterMarkdown: {
          frontmatter: Object.entries(noBody).map((item) => {
            return { [`${item.at(0)}`]: item?.at(1) || "" };
          }),
          body: article.body_markdown,
        },
        path: `${__dirname}/..${contentDir}/`,
        fileName,
      });
    }
  } catch (error) {
    console.error("ERROR:", error);
  }
};
exports.fetchUserArticles = fetchUserArticles;
