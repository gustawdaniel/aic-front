import {Article} from "~/intefaces/Article";
import axios from "axios";
import { useToken } from "~/composables/token";

export const useArticles = () => {
  return useState<Article[]>('articles', () => [])
}

export const useSelectedArticle = () => {
  return useState<Article|undefined>('selected-article', () => undefined)
}

export async function syncArticle() {
  const config = useRuntimeConfig()
  const token = useToken();
  const article = useSelectedArticle();
  if(!article.value) {
    throw new Error(`No article to sync`);
  }

  await axios.put(config.public.apiUrl + `/article/${article.value.id}`, {
    components: article.value.components,
    state: article.value.state,
  }, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
}
