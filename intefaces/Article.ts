export interface ArticleComponent {
  id: string
  xpath: string[],
  text: string,
  finish_reason: string
  ai_requests: string[]
}

export type ArticleState = 'new' | 'queued' | 'rejected' | 'verification' | 'published';

interface ArticleVersion {
  hash: string,
  up: object[],
  down: object[],
}

export interface ArticlePayload {
  request_id: string
  components:  ArticleComponent[],
  user_id: string
  state: ArticleState
}

export interface SingleArticle {
  id: string
  state: ArticleState
  components: ArticleComponent[]
  user_id: string,
  request_id: string,
  versions: Array<ArticleVersion>
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
