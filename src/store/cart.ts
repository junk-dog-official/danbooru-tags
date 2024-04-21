import {defineStore} from "pinia";
import {Cart, TagDirection, TagItem, TagItemGroup} from "@/types/cart.ts";
import {useTagStore} from "@/store/tags.ts";
import {Tag} from "@/types/tag.ts";
import Decimal from "decimal.js-light";
import {serialize} from "@/utils/serializer.ts";

function tagNameMapper(tagItem: TagItem): string | string[]  {
    switch (tagItem.type) {
        case "tag":
            return tagItem.name
        case "group":
            return tagItem.children.flatMap(t => tagNameMapper(t))
        default:
            return []
    }
}

function removeTag(tagItems: TagItem[], tagName: string) {
    const index = tagItems.findIndex(item => item.type === 'tag' && item.name === tagName)
    if (index !== -1) {
        tagItems.splice(index, 1)
        return
    }
    for (const tagItem of tagItems) {
        if (tagItem.children !== null) {
            removeTag(tagItem.children, tagName)
        }
    }
}

export const useCartStore = defineStore('cart', {
    state: (): Cart => ({
        positive: [],
        negative: []
    }),
    getters: {
        positiveTagNames(state) {
            return state.positive.flatMap(t => tagNameMapper(t))
        },
        negativeTagNames(state) {
            return state.negative.flatMap(t => tagNameMapper(t))
        },
        positiveToString(state) {
            return serialize(state.positive)
        },
        negativeToString(state) {
            return serialize(state.negative)
        }
    },
    actions: {
        positiveExisted(name: string) {
            return this.positiveTagNames.includes(name)
        },
        negativeExisted(name: string) {
            return this.negativeTagNames.includes(name)
        },
        createTagItemByTagName(tagName: string) {
            const tagStore = useTagStore()
            const tag: Tag | null = tagStore.allTagsWithAlias[tagName]
            return tag != null ? {
                label: `${tagName} - ${tag.name}`,
                name: tagName,
                type: 'tag',
                weight: new Decimal(1),
                children: null,
                parent: null
            } as TagItem
            : null
        },
        appendPositiveTag(tagName: string) {
            if (this.positiveExisted(tagName)) {
                return
            }
            const tagItem: TagItem | null = this.createTagItemByTagName(tagName)
            tagItem && this.positive.push(tagItem)
            this.removeNegativeTag(tagName)
        },
        appendNegativeTag(tagName: string) {
            if (this.negativeExisted(tagName)) {
                return
            }
            const tagItem: TagItem | null = this.createTagItemByTagName(tagName)
            tagItem && this.negative.push(tagItem)
            this.removePositiveTag(tagName)
        },
        removeNegativeTag(tagName: string) {
            if (!this.negativeExisted(tagName)) {
                return
            }
            removeTag(this.negative, tagName)
        },
        removePositiveTag(tagName: string) {
            if (!this.positiveExisted(tagName)) {
                return
            }
            removeTag(this.positive, tagName)
        },
        removeTagItem(direction: TagDirection, tagItem: TagItem) {
            if (!tagItem.parent) {
                const root = this[direction]
                root.splice(root.indexOf(tagItem), 1)
                return
            }
            if (tagItem.parent.children.length > 1) {
                const root = tagItem.parent.children
                root.splice(root.indexOf(tagItem), 1)
                return
            }
            tagItem.parent.children = []
            this.removeTagItem(direction, tagItem.parent)
        },
        removeEmptyGroup() {
            // todo
        },
        appendTagItem(direction: TagDirection, tagItem: TagItem) {
            this[direction].push(tagItem)
        },
        createTagGroup(direction: TagDirection, draggingItem: TagItem, dropItem: TagItem) {
            const root = dropItem.parent?.children ?? this[direction]
            const group: TagItemGroup = {
                label: '标签组',
                type: 'group',
                weight: new Decimal(1),
                children: [],
                parent: dropItem.parent
            }
            root.splice(root.indexOf(dropItem), 1, group)
            draggingItem.parent = group
            dropItem.parent = group
            dropItem.children = null
            group.children = [dropItem, draggingItem]
        },
        clear() {
            this.positive = []
            this.negative = []
        },
    }
})