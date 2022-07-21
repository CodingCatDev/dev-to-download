require("dotenv").config({ path: __dirname + "/../.env" });
const fs = require("fs");
const axios = require("axios");
const directories = require("../util/directories");
const jfm = require("json-to-frontmatter-markdown");

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
};
exports.fetchMyArticles = fetchMyArticles;
