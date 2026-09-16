# Driveway Avenue

This is a lightweight Eleventy site. Edit source files in `src/`; Eleventy writes the publishable result to `_site/`.

## Install and run

Install dependencies once:

```bash
npm install
```

Start the local server:

```bash
npm run start
```

Open `http://localhost:8080/`.

Build the production site:

```bash
npm run build
```

Run the production checks after building:

```bash
npm run check
```

Or build and check in one command:

```bash
npm run verify
```

## Add real content

The site currently has no published posts or recommendations. Empty homepage modules and category lists are hidden. Projects is retained as an unpublished template for later use.

### Movie articles and essays

Create a Markdown file in `src/posts/`. Its filename determines its URL: `/posts/<filename>/index.html` (also accessible as `/posts/<filename>/`). Keep filenames stable after publishing.

Supply YAML front matter with your actual `title`, `date` (YYYY-MM-DD), `category`, and `description`, followed by the actual article text. Use `category: Movies` for movie articles or `category: Essays` for essays on any subject. Singular Movie/Essay and lowercase forms also work.

Set `draft: true` while writing. Drafts and posts marked `placeholder: true` generate no public page and are excluded from the homepage, category pages, archive, feed, and sitemap. Remove `draft` or set it to `false` when ready to publish.

You can also run `npm run new-post`. It asks for your actual title, category, description, and publication date, refuses to overwrite existing files, and creates an unpublished draft with an empty body. It does not invent a date or article text.

The five newest published movie articles appear in Fresh Off the Press. If no movie articles are published, that section is hidden. Essays appear on Essays, in the Archive, and in the Atom feed, with their article URLs unchanged. Movie articles and essays share the existing article layout.

### Featured homepage article

Add `featured: true` to a published movie article. If multiple movie articles are flagged, the newest is featured. If none is flagged, the spotlight section is hidden. Essays are excluded from the homepage spotlight.

Optional image fields are `featuredImage` (a public path under `/assets/`), `featuredImageAlt` (meaningful alt text), and `featuredImageCaption` (your actual caption). Place image files in `src/assets/`; Eleventy copies them to `_site/assets/`. Existing `heroImage`, `heroAlt`, and `heroImageCaption` fields are also supported. A featured post without an image uses a text-only layout rather than sample artwork. No image is required to publish.

### Tonight’s Stack

Edit `src/_data/recommendations.json`, currently an empty array. Add one object per real recommendation with `title` (movie title) and `description` (your short one-line recommendation). Array order controls display order; numbering is automatic. Three entries work well, but no minimum or filler is required. These recommendations need no post, date, image, or URL and do not appear in the article feed or archive. An empty array hides Tonight’s Stack.

Run `npm run verify` before publishing. Clean `_site/` before checking after removing posts so old generated files do not linger.

## Branding, colors, and launch configuration

The site name, tagline, author, navigation, social image, and production URL live in `src/_data/site.json`.

`site.url` is `https://drivewayavenue.com`. That one setting supplies canonical URLs, the Atom feed, sitemap URLs, robots.txt sitemap reference, and social metadata.

The print-inspired design uses warm paper, near-black ink, brick red, sun-faded yellow, and a smaller dusty-blue accent. Adjust the palette in the custom properties at the top of `style.css`:

```css
--paper
--paper-deep
--ink
--red
--yellow
--blue
```

The typography pairs Barlow Condensed display lettering, Source Serif 4 editorial text, Libre Franklin labels, and restrained Caveat annotations. An original SVG supplies subtle paper grain; the contact-sheet composition uses the featured article’s own image when supplied. Mobile layouts stack the spread and simplify offsets.

The reusable HTML shell is in `src/_includes/layouts/base.njk`, article pages use `src/_includes/layouts/post.njk`, and Eleventy configuration lives in `eleventy.config.js`.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` installs dependencies with `npm ci`, runs the production build, and deploys `_site/` through GitHub Pages. The generated `CNAME` file supplies `drivewayavenue.com` to GitHub Pages. Before enabling it, create the repository, set **Settings → Pages → Source** to **GitHub Actions**, and point the custom domain to this site in GitHub Pages settings.
