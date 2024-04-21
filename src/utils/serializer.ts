import {TagItem} from "@/types/cart.ts";
import Decimal from "decimal.js-light";

function addWeight(content: string, weight: Decimal) {
    return weight.toDecimalPlaces(8).equals(1)
        ? content
        : `(${content}:${weight.toDecimalPlaces(8)})`
}

export function serialize(items: TagItem[]): string {
    return items.map(item => {
        if (item.type === 'tag') {
            const name = item.name
                .replaceAll('\\', '\\\\')
                .replaceAll('(', '\\(')
                .replaceAll(')', '\\)')
                .replaceAll('[', '\\[')
                .replaceAll(']', '\\]')
            return addWeight(name, item.weight)
        }
        if (item.type === 'group' && item.children?.length > 0) {
            return addWeight(serialize(item.children), item.weight)
        }
    })
        .filter(s => s)
        .join(', ')
}