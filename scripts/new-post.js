import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const prompt = createInterface({ input, output });

  try {
    const title = (await prompt.question("Title: ")).trim();
    const suppliedCategory = (await prompt.question("Category (Movies or Essays): ")).trim().toLowerCase();
    const category = /^movies?$/.test(suppliedCategory) ? "Movies" : /^essays?$/.test(suppliedCategory) ? "Essays" : "";
    const description = (await prompt.question("Description: ")).trim();
    const date = (await prompt.question("Publication date YYYY-MM-DD: ")).trim();

    if (!category) throw new Error("Choose Movies or Essays.");
    if (!title) throw new Error("A title is required.");
    if (!description) throw new Error("A description is required.");
    if (!isValidDate(date)) throw new Error("Use a valid date in YYYY-MM-DD format.");

    const slug = slugify(title);
    if (!slug) throw new Error("The title did not produce a usable filename.");

    const postsDirectory = path.join(process.cwd(), "src", "posts");
    const target = path.join(postsDirectory, `${slug}.md`);

    if (await exists(target)) throw new Error(`A post already exists at src/posts/${slug}.md`);

    const frontMatter = [
      "---",
      `title: ${JSON.stringify(title)}`,
      `date: ${date}`,
      `category: ${JSON.stringify(category)}`,
      `description: ${JSON.stringify(description)}`,
      "draft: true",
      "---",
      "",
      ""
    ].join("\n");

    await mkdir(postsDirectory, { recursive: true });
    await writeFile(target, frontMatter, "utf8");
    console.log(`Created src/posts/${slug}.md`);
  } catch (error) {
    console.error(`Could not create post: ${error.message}`);
    process.exitCode = 1;
  } finally {
    prompt.close();
  }
}

main();
