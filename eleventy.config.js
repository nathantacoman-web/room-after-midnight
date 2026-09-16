const shortMonths = [
  "Jan.", "Feb.", "March", "April", "May", "June",
  "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."
];

const longMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function asDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function postsNewestFirst(collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/posts/*.md")
    .filter((post) => !post.data.draft && !post.data.placeholder)
    .sort((first, second) => second.date - first.date);
}

function absoluteUrl(url, siteUrl) {
  return new URL(url, siteUrl).toString();
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "script.js": "script.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addGlobalData("buildYear", () => new Date().getFullYear());
  eleventyConfig.addGlobalData("buildTimestamp", () => new Date().toISOString());

  eleventyConfig.addFilter("shortDate", (value) => {
    const date = asDate(value);
    return `${shortMonths[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
  });

  eleventyConfig.addFilter("archiveDate", (value) => {
    const date = asDate(value);
    return `${longMonths[date.getUTCMonth()]} ${date.getUTCDate()}`;
  });

  eleventyConfig.addFilter("htmlDate", (value) => asDate(value).toISOString().slice(0, 10));
  eleventyConfig.addFilter("isoDate", (value) => asDate(value).toISOString());
  eleventyConfig.addFilter("rfc822Date", (value) => asDate(value).toUTCString());
  eleventyConfig.addFilter("absoluteUrl", absoluteUrl);
  eleventyConfig.addFilter("limit", (items, count) => (items || []).slice(0, count));
  eleventyConfig.addFilter("groupByYear", (posts) => {
    const groups = [];

    for (const post of posts || []) {
      const year = asDate(post.date).getUTCFullYear();
      let group = groups.find((item) => item.year === year);

      if (!group) {
        group = { year, posts: [] };
        groups.push(group);
      }

      group.posts.push(post);
    }

    return groups;
  });

  eleventyConfig.addCollection("posts", postsNewestFirst);
  eleventyConfig.addCollection("moviePosts", (collectionApi) =>
    postsNewestFirst(collectionApi).filter((post) => /^movies?$/.test(String(post.data.category || "").toLowerCase()))
  );
  eleventyConfig.addCollection("essayPosts", (collectionApi) =>
    postsNewestFirst(collectionApi).filter((post) => /^essays?$/.test(String(post.data.category || "").toLowerCase()))
  );
  eleventyConfig.addCollection("featuredPosts", (collectionApi) =>
    postsNewestFirst(collectionApi).filter((post) => post.data.featured === true && /^movies?$/.test(String(post.data.category || "").toLowerCase()))
  );
  eleventyConfig.addCollection("projectPosts", (collectionApi) =>
    postsNewestFirst(collectionApi).filter((post) => String(post.data.category || "").toLowerCase() === "projects")
  );
  eleventyConfig.addCollection("sitemap", (collectionApi) =>
    collectionApi.getAll().filter((item) => item.url && !item.data.excludeFromSitemap)
  );
}

export const config = {
  dir: {
    input: "src",
    includes: "_includes",
    data: "_data",
    output: "_site"
  },
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  templateFormats: ["md", "njk"]
};
