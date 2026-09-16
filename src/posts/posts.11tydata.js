export default {
  layout: "layouts/post.njk",
  pageType: "article",
  eleventyComputed: {
    pageKey: (data) => /^movies?$/.test(String(data.category || "").toLowerCase())
      ? "movies" : /^essays?$/.test(String(data.category || "").toLowerCase()) ? "essays" : "archive",
    permalink: (data) => data.draft || data.placeholder
      ? false : `/posts/${data.page.fileSlug}/index.html`,
    eleventyExcludeFromCollections: (data) => Boolean(data.draft || data.placeholder)
  }
};
