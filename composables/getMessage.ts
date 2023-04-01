import {AxiosError} from "axios";

export function getMessage(e: unknown) {
    if (e instanceof AxiosError) {
        return e.response?.data.message ?? e.message
    }
    if (e instanceof Error) {
        return e.message
    } else {
        return `unknown error`
    }
}
