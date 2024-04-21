import type Decimal from "decimal.js-light";

export type TagItemType = 'tag' | 'group'

export type TagItem = TagItemSimple | TagItemGroup

export interface TagItemGroup {
    label: string
    type: 'group'
    weight: Decimal
    children: TagItem[]
    parent: TagItemGroup | null
}

export interface TagItemSimple {
    label: string
    name: string
    type: 'tag'
    weight: Decimal
    children: null
    parent: TagItemGroup | null
}

export interface Cart {
    positive: TagItem[]
    negative: TagItem[]
}

export type TagDirection = 'positive' | 'negative'