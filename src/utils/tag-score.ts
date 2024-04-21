import {Tag} from "@/types/tag.ts";

export function calcTagScoreInCategory(
    meta: Tag & { score: number }, lcQuery: string, normalizeLcQuery: string
) {
    let score = meta.score;
    if (meta.key.toLowerCase() === lcQuery) {
        score += 300
    }
    if (meta.key.toLowerCase().includes(normalizeLcQuery)) {
        score += 100
    }
    if (meta.alias?.some(a => a.toLowerCase() === lcQuery)) {
        score += 90
    }
    if (meta.alias?.some(a => a.toLowerCase().includes(normalizeLcQuery))) {
        score += 70
    }
    if (meta.name.toLowerCase() === lcQuery) {
        score += 50
    }
    if (meta.name.toLowerCase().includes(normalizeLcQuery)) {
        score += 50
    }
    if (meta.description?.toLowerCase() === lcQuery) {
        score += 40
    }
    if (meta.description?.toLowerCase().includes(normalizeLcQuery)) {
        score += 25
    }
    return { ...meta, score }
}

export function calcTagScore(
    meta: Tag & { score: number }, lcQuery: string, normalizeLcQuery: string
) {
    let { score } = calcTagScoreInCategory(meta, lcQuery, normalizeLcQuery)
    if (meta.category.some(c => c.toLowerCase() === lcQuery)) {
        score += 15
    }
    if (meta.category.some(c => c.toLowerCase().includes(normalizeLcQuery))) {
        score += 7
    }
    return { ...meta, score }
}