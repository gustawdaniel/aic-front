export interface ArticleComponent {
    "xpath": string[],
    "text": string,
    "versions": string[]
}

export type ArticleState = 'new' | 'queued' | 'rejected' | 'verification' | 'published';

export interface Article {
    id: string
    state:  ArticleState
    components: ArticleComponent[]
    "user_id": string,
    "request_id": string,
    "request": {
        "url": string,
        "created_at": string // "2023-02-17T06:41:36.339Z"
    }
}
