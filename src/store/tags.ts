import {defineStore} from "pinia";
import {CategoryHierarchy, Tag, Tags} from "@/types/tag.ts";
import {useSettingsStore} from "@/store/settings.ts";
import {LRUCache} from "lru-cache";
import {calcTagScore, calcTagScoreInCategory} from "@/utils/tag-score.ts";
import {group} from "@/utils/array-group.ts";

const filterCache = new LRUCache<string, (Tag & { score: number })[]>({
    max: 50,
    allowStale: true,
    updateAgeOnGet: true
})

export const useTagStore = defineStore('tags', {
    state: (): Tags => ({
       tags: [],
       tagsPostCount: {}
    }),
    getters: {
        categoryHierarchy(state) {
            const settings = useSettingsStore()
            const duplicate: Record<string, boolean> = {}
            const filtered = state.tags
                .filter(tag => settings.showRestricted || !tag.restricted)
                .map(({ category: categoryList }) => categoryList.join("/"))
                .filter(category => !(duplicate[category] = category in duplicate))
                .sort()
                .map(category => category.split("/"))
            console.log(filtered)
            const categoryHierarchy: CategoryHierarchy = {}
            for (const categoryList of filtered) {
                let parent = categoryHierarchy
                for (const [index, category] of categoryList.entries()) {
                    if (index < categoryList.length - 1) {
                        if (!parent[category]) {
                            parent[category] = {}
                        }
                        parent = parent[category] as CategoryHierarchy
                    } else {
                        parent[category] = null
                    }
                }
            }
            return categoryHierarchy
        },
        categorySize(state) {
            const size: Record<string, number> = {}
            for (const tag of state.tags) {
                const key = tag.category.join("/")
                size[key] = (size[key] || 0) + 1
            }
            return size
        },
        tagTotalSize(state) {
            return state.tags.length
        },
        tagsByCategory(state) {
            const settings = useSettingsStore()
            const filtered = state.tags.filter(tag => settings.showRestricted || !tag.restricted);
            return group(filtered, (tag) => tag.category.join('/'))
        },
        allTagsWithAlias: function (state) {
            const settings = useSettingsStore()
            const entries = state.tags
                .filter(tag => settings.showRestricted || !tag.restricted)
                .flatMap(tag =>  tag.alias
                    ? [[tag.key, tag], ...tag.alias.map(alias => [alias, tag])]
                    : [[tag.key, tag]])
            return Object.fromEntries(entries)
        },
    },
    actions: {
        async load() {
            const tags = (await import('@/data/tags.json')).default as Tag[]
            const tagsPostCount: Record<string, number> = (await import('@/data/danbooru_tag_post_count.json')).default
            this.tags = tags;
            this.tagsPostCount = tagsPostCount;
        },
        filterTags(category: string[], query: string) {
            const settings = useSettingsStore()
            const categoryKey = category.join('/')
            if (!this.tagsByCategory[categoryKey]) {
                return []
            }
            if (!query) {
                return this.tagsByCategory[categoryKey].sort((
                    t1, t2
                ) => (this.tagsPostCount[t2.key] ?? 0) - (this.tagsPostCount[t1.key] ?? 0))
            }
            const lcQuery = query.toLowerCase()
            const normalizeQueries = lcQuery
                .split(/_|\s/)
                .filter(s => !!s)
                .sort((s1, s2) => s2.length - s1.length)
            const cacheKey = JSON.stringify([category, normalizeQueries])
            const cached = filterCache.get(cacheKey)
            if (cached) {
                return cached
            }
            const result = normalizeQueries.reduce<(Tag & {score: number })[]>(
                (
                    metas, normalizeQuery
                ) => metas
                    .map(meta => calcTagScoreInCategory(meta, lcQuery, normalizeQuery))
                    .filter(meta => meta.score > 0),
                this.tags
                    .filter(tag => (settings.showRestricted || !tag.restricted)
                        && tag.category.join('/') === categoryKey)
                    .map(tag => ({ ...tag, score: 0 }))
            )
                .sort(({ score: a }, { score: b }) => b - a)
            filterCache.set(cacheKey, result)
            return result
        },
        searchTags(query: string) {
            const settings = useSettingsStore()
            const lcQuery = query.toLowerCase()
            const normalizeQueries = lcQuery
                .split(/_|\s/)
                .filter(s => !!s)
                .sort((s1, s2) => s2.length - s1.length)
            const cacheKey = JSON.stringify(['global', normalizeQueries])
            const cached = filterCache.get(cacheKey)
            if (cached) {
                return cached
            }
            const result = normalizeQueries.reduce<(Tag & {score: number })[]>(
                (
                    metas, normalizeQuery
                ) => metas
                    .map(meta => calcTagScore(meta, lcQuery, normalizeQuery))
                    .filter(meta => meta.score > 0),
                this.tags
                    .filter(tag => (settings.showRestricted || !tag.restricted))
                    .map(tag => ({ ...tag, score: 0 }))
            )
                .sort(({ score: a }, { score: b }) => b - a)
            filterCache.set(cacheKey, result)
            return result
        }
    }
})