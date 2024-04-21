export function group<T, K extends string | number | symbol> (
    array: Array<T>, callbackFn: (element: T, index: number) => K
): Record<K, T[]> {
    const groups = {} as Record<K, T[]>
    for (let i = 0; i < array.length; i++) {
        const element = array[i]
        const key = callbackFn(element, i)
        if (!groups[key]) {
            groups[key] = []
        }
        groups[key].push(element)
    }
    return groups
}