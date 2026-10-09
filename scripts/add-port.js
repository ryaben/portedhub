import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libraryDirectory = path.join(projectRoot, "public", "games");
const indexPath = path.join(libraryDirectory, "index.json");
const validPortTypes = ["original", "clone", "crossover", "console"];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function filenameFromUrl(value) {
  const pathname = new URL(value).pathname;
  const encodedFilename = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (!encodedFilename) {
    return "";
  }

  let filename = encodedFilename;
  try {
    filename = decodeURIComponent(encodedFilename);
  } catch {
    // Keep the URL-encoded filename when its escape sequence is malformed.
  }
  return filename.split(/[\\/]/).pop();
}

function isScreenshotPath(value, portDirectory) {
  if (path.isAbsolute(value)) {
    return false;
  }

  const relativePath = path.relative(portDirectory, path.resolve(portDirectory, value));
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

async function main() {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answers = input[Symbol.asyncIterator]();
  let createdDirectory;
  let temporaryIndexPath;

  async function ask(label, { defaultValue, optional = false, validate } = {}) {
    while (true) {
      const suffix = defaultValue ? ` (${defaultValue})` : "";
      process.stdout.write(`${label}${suffix}: `);
      const { value: answer, done } = await answers.next();
      if (done) {
        throw new Error("Input ended before all prompts were answered.");
      }
      const response = answer.trim();
      const value = response || defaultValue || "";

      if (!value && optional) {
        return "";
      }
      if (!value) {
        console.error("This field is required.");
        continue;
      }
      if (validate && !validate(value)) {
        console.error("Please enter a valid value.");
        continue;
      }
      return value;
    }
  }

  try {
    console.log("Add a port to PortedHub. Press Ctrl+C to cancel.\n");

    const title = await ask("Port/game title");
    const defaultId = slugify(title);
    if (!defaultId) {
      throw new Error("The title cannot be converted into a port ID.");
    }
    const id = await ask("Port ID", {
      defaultValue: defaultId,
      validate: (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
    });
    const genre = await ask("Genre");
    const description = await ask("Description");
    const screenshotUrl = await ask("Screenshot image URL (optional)", {
      optional: true,
      validate: isHttpUrl,
    });
    const suggestedScreenshot = screenshotUrl ? filenameFromUrl(screenshotUrl) : "";
    const screenshot = await ask("Screenshot filename (optional)", {
      defaultValue: suggestedScreenshot,
      optional: !screenshotUrl,
      validate: (value) => isScreenshotPath(value, path.join(libraryDirectory, id)),
    });

    const creatorName = await ask("Creator name");
    const social = await ask("Creator social URL (optional)", {
      optional: true,
      validate: isHttpUrl,
    });
    const website = await ask("Playable website URL", {
      validate: isHttpUrl,
    });
    const type = await ask("Type (original/clone/crossover/console)", {
      defaultValue: "original",
      validate: (value) => validPortTypes.includes(value.toLowerCase()),
    });

    const port = {
      title,
      ...(screenshot ? { screenshot } : {}),
      genre,
      description,
      creator: {
        name: creatorName,
        ...(social ? { social } : {}),
      },
      website,
      type: type.toLowerCase(),
    };

    const portIds = JSON.parse(await readFile(indexPath, "utf8"));
    if (!Array.isArray(portIds) || portIds.some((portId) => typeof portId !== "string")) {
      throw new Error(`${indexPath} must contain a JSON array of port IDs.`);
    }
    if (portIds.includes(id)) {
      throw new Error(`A port with ID "${id}" is already registered.`);
    }

    const portDirectory = path.join(libraryDirectory, id);
    await mkdir(portDirectory);
    createdDirectory = portDirectory;
    if (screenshotUrl) {
      const response = await fetch(screenshotUrl);
      if (!response.ok) {
        throw new Error(
          `Could not download screenshot: ${response.status} ${response.statusText}`,
        );
      }
      const screenshotPath = path.join(portDirectory, screenshot);
      await mkdir(path.dirname(screenshotPath), { recursive: true });
      await writeFile(screenshotPath, Buffer.from(await response.arrayBuffer()), {
        flag: "wx",
      });
    }
    await writeFile(
      path.join(portDirectory, "game.json"),
      `${JSON.stringify(port, null, 2)}\n`,
      { flag: "wx" },
    );

    temporaryIndexPath = path.join(libraryDirectory, `.index-${process.pid}.tmp`);
    await writeFile(
      temporaryIndexPath,
      `${JSON.stringify([...portIds, id], null, 2)}\n`,
      { flag: "wx" },
    );
    await rename(temporaryIndexPath, indexPath);
    temporaryIndexPath = undefined;
    createdDirectory = undefined;

    console.log(`\nAdded "${title}" (${id}) to the port library.`);
    console.log(`Port data: public/games/${id}/game.json`);
    if (screenshotUrl) {
      console.log(`Screenshot downloaded to public/games/${id}/${screenshot}`);
    } else if (screenshot) {
      console.log(`Copy the screenshot to public/games/${id}/${screenshot}`);
    }
  } catch (error) {
    if (temporaryIndexPath) {
      await rm(temporaryIndexPath, { force: true });
    }
    if (createdDirectory) {
      await rm(createdDirectory, { recursive: true, force: true });
    }
    throw error;
  } finally {
    input.close();
  }
}

main().catch((error) => {
  console.error(`Could not add port: ${error.message}`);
  process.exitCode = 1;
});
