export function toBool(booleanString: undefined | string): boolean {
    return (
        typeof booleanString == 'string' &&
        booleanString.toLowerCase() == 'true'
    )
}
