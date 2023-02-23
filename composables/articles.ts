import {Article} from "~/intefaces/Article";

export const useArticles = () => {
  return useState<Article[]>('articles', () => [])
}
