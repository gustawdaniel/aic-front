export interface ArticleComponent {
  id: string
  xpath: string[],
  text: string,
  finish_reason: string
  ai_requests: string[]
}

export type ArticleState = 'new' | 'queued' | 'rejected' | 'verification' | 'published';

export interface SingleArticle {
  id: string
  state: ArticleState
  components: ArticleComponent[]
  user_id: string,
  request_id: string,
  request: {
    url: string,
    created_at: string // "2023-02-17T06:41:36.339Z"
  }
}

export interface Article {
  components_length: number,
  state: ArticleState,
  id: string,
  title: string,
  source_url: string
}
