import { Article, SingleArticle } from "~/intefaces/Article";
import axios from "axios";
import { useToken } from "~/composables/token";
import {handleError} from '#imports'
export const useArticles = () => {
  return useState<Article[]>('articles', () => [])
}

export const useSelectedArticle = () => {
  return useState<SingleArticle|undefined>('selected-article', () => undefined)
}

export  async function getSingleArticle(id: string) {
  const singleArticleState = useSelectedArticle();
  const config = useRuntimeConfig()
  const token = useToken();

  const {data} = await axios.get<SingleArticle>(config.public.apiUrl + `/article/${id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  singleArticleState.value = data;
}

export async function clearSingleArticle() {
  const singleArticleState = useSelectedArticle();
  singleArticleState.value = undefined;
}

export async function syncArticle() {
  const config = useRuntimeConfig()
  const token = useToken();
  const article = useSelectedArticle();
  if(!article.value) {
    throw new Error(`No article to sync`);
  }

  try {
    await axios.put(config.public.apiUrl + `/article/${ article.value.id }`, {
      components: article.value.components,
      state: article.value.state,
    }, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
  } catch (e) {
    handleError(e)
  }
}
