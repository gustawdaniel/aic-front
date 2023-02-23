export interface Target {
    id: string,
    url: string,
    type: string,
    auth: {
        username?: string,
        password?: string,
        key?: string
    }
}
