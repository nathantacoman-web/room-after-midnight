# Room After Midnight

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

## Publish a post

Create Markdown files in `src/posts/`. The filename becomes the URL, so `src/posts/stormy-weather.md` publishes to `/posts/stormy-weather/`.

You can create a post manually with front matter like this:

```md
---
title: "Stormy Weather"
date: 2026-08-27
category: "Thoughts"
description: "There's nothing like a good storm when you've got somewhere safe to be."
---

Write your article here.
```

Or run:

```bash
npm run new-post
```

The prompt asks for a title, category, description, and an optional date. Leaving the date blank uses today. It creates a correctly formatted file in `src/posts/` and refuses to overwrite an existing post.

Posts appear automatically in the Archive and the five newest appear on Home. Use `category: "Movies"` to include a post in Movie Writing, or `category: "Projects"` to include it in Project Updates. Other categories stay in the mixed Home feed and Archive.

For a featured image, add these fields to a post and keep the image file in a passthrough-copied public location when you add one:

```yaml
featuredImage: "/images/storm.jpg"
featuredImageAlt: "Rain moving across a dark window"
featuredImageCaption: "A storm arriving."
```

`featuredImageAlt` is important: describe meaningful images, or deliberately use an empty alt only for a decorative image.

## Branding, colors, and launch configuration

The site name, tagline, author, navigation, social image, and production URL live in `src/_data/site.json`.

`site.url` is `https://roomaftermidnight.com`. That one setting supplies canonical URLs, the Atom feed, sitemap URLs, robots.txt sitemap reference, and social metadata.

Change the dusty-blue accent palette in the custom properties at the top of `style.css`:

```css
--color-accent
--color-accent-deep
--color-accent-light
```

The reusable HTML shell is in `src/_includes/layouts/base.njk`, article pages use `src/_includes/layouts/post.njk`, and Eleventy configuration lives in `eleventy.config.js`.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` installs dependencies with `npm ci`, runs the production build, and deploys `_site/` through GitHub Pages. The generated `CNAME` file supplies `roomaftermidnight.com` to GitHub Pages. Before enabling it, create the repository, set **Settings → Pages → Source** to **GitHub Actions**, and point the custom domain to this site in GitHub Pages settings.
