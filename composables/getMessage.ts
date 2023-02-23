export function getMessage(e: unknown) {
    if (e instanceof Error) {
        return e.message
    } else {
        return `unknown error`
    }
}
