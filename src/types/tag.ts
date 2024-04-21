export interface TagFile {
    name: string
    category: string[]
    restricted: boolean | null
    content: Record<string, TagFileItem>
}

export interface TagFileItem {
    name: string
    description: string | null
    image: string | null
    wikiURL: string | null
    alias: string[] | null
    restricted: boolean | null
}

export interface Tag {
    key: string,
    alias: string[] | null
    name: string
    category: string[]
    description: string | null
    image: string | null
    wikiURL: string | null
    restricted: boolean | null
}

export interface Tags {
    tags: Tag[]
    tagsPostCount: Record<string, number>
}

export interface CategoryHierarchy {
    [key: string]: CategoryHierarchy | null
}