import yaml from 'js-yaml'
import { fileURLToPath } from "url"
import path from "path"
import { glob } from "glob"
import { TagFile, Tag } from "../types/tag.ts";
import * as fs from "fs";

const dirname = path.dirname(fileURLToPath(import.meta.url))
const tagsDir = path.resolve(dirname, "../../data/tags")

const tagFilePaths = glob.sync("**/*.yaml", { cwd: tagsDir })

const tags: Tag[] = []
tagFilePaths.forEach(filePath => {
    const tagFile: TagFile = yaml.load(fs.readFileSync(path.resolve(tagsDir, filePath), "utf-8")) as TagFile
    Object.entries(tagFile.content).forEach(([key, tagItem]) => {
        const tag: Tag = {
            key,
            name: tagItem.name,
            alias: tagItem.alias,
            category: [...tagFile.category, tagFile.name],
            description: tagItem.description,
            wikiURL: tagItem.wikiURL,
            restricted: filePath.includes("r18") || tagItem.restricted,
            image: null
        }
        tags.push(tag)
    });
})

fs.writeFileSync(path.resolve(dirname, "../data/tags.json"), JSON.stringify(tags))

fs.copyFile(path.resolve(tagsDir, "../danbooru_tag_post_count.json"),
    path.resolve(dirname, "../data/danbooru_tag_post_count.json"),
    () => {})
