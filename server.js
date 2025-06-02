const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { googleSearch } = require("./utils/search");
const { scrapeContent } = require("./utils/scrape");
const { rewriteContent } = require("./utils/rewrite");
const { postToBlogger } = require("./utils/post");

const config = {
  blogId: process.env.BLOG_ID,
  accessToken: process.env.ACCESS_TOKEN,
  openAiKey: process.env.OPENAI_KEY
};

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { message: null });
});

app.post("/generate", async (req, res) => {
  const keywords = req.body.keywords.split("
").map(k => k.trim()).filter(Boolean);
  let log = [];

  for (const keyword of keywords) {
    try {
      const links = await googleSearch(keyword);
      for (const link of links) {
        const article = await scrapeContent(link);
        if (!article || article.content.length < 200) continue;
        const rewritten = await rewriteContent(article.content, config.openAiKey);
        await postToBlogger(config.blogId, config.accessToken, article.title, rewritten);
        log.push(`✅ ${keyword}: ${article.title}`);
        break;
      }
    } catch (err) {
      log.push(`❌ ${keyword}: Gagal proses.`);
    }
  }

  res.render("index", { message: log.join("<br>") });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
