import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "index.html");
const STORIES_PATH = path.join(ROOT, "data", "stories.json");
const STORIES_LANG_PATH = path.join(ROOT, "data", "storieslanguage.json");
const I18N_PATH = path.join(ROOT, "data", "i18n.json");
const LANGS = ["en", "zh", "ja"];
const ALLOWED_STORY_CATEGORIES = ["character", "life", "other"];

const errors = [];
const warnings = [];

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    errors.push(`Cannot read file: ${filePath} (${err.message})`);
    return "";
  }
}

function readJson(filePath) {
  const text = readText(filePath);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    errors.push(`Invalid JSON: ${filePath} (${err.message})`);
    return null;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function collectI18nKeysFromIndex(html) {
  const keys = new Set();

  const dataI18nRegex = /data-i18n="([^"]+)"/g;
  let match = null;
  while ((match = dataI18nRegex.exec(html)) !== null) {
    keys.add(match[1]);
  }

  const tCallRegex = /t\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = tCallRegex.exec(html)) !== null) {
    keys.add(match[1]);
  }

  // 捕获像 CATEGORY_LABEL_KEYS 这类映射里的 filter_* key（动态调用 t(key)）
  const filterKeyRegex = /['"](filter_[a-z_]+)['"]/g;
  while ((match = filterKeyRegex.exec(html)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

function validateI18n(i18n, requiredKeys) {
  if (!i18n || typeof i18n !== "object" || Array.isArray(i18n)) {
    errors.push("data/i18n.json must be an object.");
    return;
  }

  for (const key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(i18n, key)) {
      errors.push(`Missing i18n key: "${key}"`);
      continue;
    }

    const entry = i18n[key];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`i18n key "${key}" must map to an object.`);
      continue;
    }

    for (const lang of LANGS) {
      if (!isNonEmptyString(entry[lang])) {
        errors.push(`i18n key "${key}" missing or empty translation for "${lang}".`);
      }
    }
  }

  for (const key of Object.keys(i18n)) {
    if (!requiredKeys.has(key)) {
      warnings.push(`Unused i18n key (not referenced in index.html): "${key}"`);
    }
  }
}

function validateStoryLocalImagePath(imgPath, storyIndex) {
  if (!isNonEmptyString(imgPath)) {
    errors.push(`stories[${storyIndex}].img must be a non-empty string.`);
    return;
  }

  if (/^https?:\/\//i.test(imgPath)) {
    warnings.push(`stories[${storyIndex}].img is a remote URL (existence not checked): ${imgPath}`);
    return;
  }

  const resolved = path.resolve(ROOT, imgPath);
  if (!fs.existsSync(resolved)) {
    errors.push(`stories[${storyIndex}].img points to missing file: ${imgPath}`);
  }
}

function validateTranslatableField(story, field, storyIndex) {
  const value = story[field];
  if (isNonEmptyString(value)) {
    warnings.push(`stories[${storyIndex}].${field} is single-language text (translation check skipped).`);
    return;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(
      `stories[${storyIndex}].${field} must be a non-empty string or a translation object with ${LANGS.join("/")}.`
    );
    return;
  }

  for (const lang of LANGS) {
    if (!isNonEmptyString(value[lang])) {
      errors.push(`stories[${storyIndex}].${field} missing or empty translation for "${lang}".`);
    }
  }
}

function validateStories(stories) {
  if (!Array.isArray(stories)) {
    errors.push("data/stories.json must be an array.");
    return;
  }

  const requiredFields = [
    "id",
    "category",
    "featured",
    "img"
  ];
  const optionalFields = new Set(["modal_object_position", "card_object_position"]);

  const categories = new Set();
  const seenIds = new Set();

  stories.forEach((story, idx) => {
    if (!story || typeof story !== "object" || Array.isArray(story)) {
      errors.push(`stories[${idx}] must be an object.`);
      return;
    }

    for (const field of requiredFields) {
      if (!Object.prototype.hasOwnProperty.call(story, field)) {
        errors.push(`stories[${idx}] missing required field: "${field}"`);
      }
    }

    for (const field of Object.keys(story)) {
      if (!requiredFields.includes(field) && !optionalFields.has(field)) {
        warnings.push(`stories[${idx}] contains unknown field: "${field}"`);
      }
    }

    if (!isNonEmptyString(story.id)) {
      errors.push(`stories[${idx}].id must be a non-empty string.`);
    } else if (seenIds.has(story.id)) {
      errors.push(`Duplicate story id detected: "${story.id}"`);
    } else {
      seenIds.add(story.id);
    }

    if (!isNonEmptyString(story.category)) {
      errors.push(`stories[${idx}].category must be a non-empty string.`);
    } else {
      const normalizedCategory = story.category.trim().toLowerCase();
      categories.add(normalizedCategory);
      if (!ALLOWED_STORY_CATEGORIES.includes(normalizedCategory)) {
        errors.push(
          `stories[${idx}].category must be one of: ${ALLOWED_STORY_CATEGORIES.join(", ")} (received: "${story.category}")`
        );
      }
    }

    if (typeof story.featured !== "boolean") {
      errors.push(`stories[${idx}].featured must be boolean.`);
    }

    if (
      Object.prototype.hasOwnProperty.call(story, "modal_object_position") &&
      !isNonEmptyString(story.modal_object_position)
    ) {
      errors.push(`stories[${idx}].modal_object_position must be a non-empty string when provided.`);
    }

    if (
      Object.prototype.hasOwnProperty.call(story, "card_object_position") &&
      !isNonEmptyString(story.card_object_position)
    ) {
      errors.push(`stories[${idx}].card_object_position must be a non-empty string when provided.`);
    }

    validateStoryLocalImagePath(story.img, idx);
  });

  if (categories.size === 0) {
    warnings.push("No story categories detected.");
  }

  return seenIds;
}

function validateStoriesLanguage(storiesLanguage, storyIds) {
  if (!storiesLanguage || typeof storiesLanguage !== "object" || Array.isArray(storiesLanguage)) {
    errors.push("data/storieslanguage.json must be an object.");
    return;
  }

  const textFields = ["title", "tag", "hook", "content"];

  for (const id of storyIds) {
    const entry = storiesLanguage[id];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      errors.push(`storieslanguage missing object for story id "${id}".`);
      continue;
    }

    for (const field of textFields) {
      const fieldObj = entry[field];
      if (!fieldObj || typeof fieldObj !== "object" || Array.isArray(fieldObj)) {
        errors.push(`storieslanguage["${id}"].${field} must be an object with en/zh/ja.`);
        continue;
      }

      if (!isNonEmptyString(fieldObj.en)) {
        if (field === "hook") {
          warnings.push(`storieslanguage["${id}"].${field}.en is empty.`);
        } else {
          errors.push(`storieslanguage["${id}"].${field}.en must be non-empty.`);
        }
      }

      if (!isNonEmptyString(fieldObj.zh)) {
        warnings.push(`storieslanguage["${id}"].${field}.zh is empty (fallback to en).`);
      }

      if (!isNonEmptyString(fieldObj.ja)) {
        warnings.push(`storieslanguage["${id}"].${field}.ja is empty (fallback to en).`);
      }
    }
  }

  for (const id of Object.keys(storiesLanguage)) {
    if (!storyIds.has(id)) {
      warnings.push(`storieslanguage contains unused story id: "${id}"`);
    }
  }
}

function printReport() {
  console.log("Content validation report");
  console.log("========================");
  console.log(`Project root: ${ROOT}`);
  console.log("");

  if (errors.length === 0) {
    console.log("Errors: 0");
  } else {
    console.log(`Errors: ${errors.length}`);
    errors.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
  }

  console.log("");

  if (warnings.length === 0) {
    console.log("Warnings: 0");
  } else {
    console.log(`Warnings: ${warnings.length}`);
    warnings.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
  }
}

function main() {
  const indexHtml = readText(INDEX_PATH);
  const stories = readJson(STORIES_PATH);
  const storiesLanguage = readJson(STORIES_LANG_PATH);
  const i18n = readJson(I18N_PATH);

  if (indexHtml) {
    const requiredI18nKeys = collectI18nKeysFromIndex(indexHtml);
    validateI18n(i18n, requiredI18nKeys);
  }

  const storyIds = validateStories(stories);
  if (storyIds) {
    validateStoriesLanguage(storiesLanguage, storyIds);
  }
  printReport();

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
