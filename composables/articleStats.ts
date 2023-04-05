import { ArticleGroupSingleResult } from "~/intefaces/ArticleGroupSingleResult";
import axios from "axios";
import { useToken, handleError } from "#imports";
import { ArticleState } from "~/intefaces/Article";

export const useArticleStats = () => {
  return useState<Array<ArticleGroupSingleResult>>('article-stats', () => [])
}

export async function loadArticleStats(search: string) {
  const config = useRuntimeConfig()
  const token = useToken();
  const articleStats = useArticleStats();
  try {
    const res = await axios.get(config.public.apiUrl + `/article-count-by-stata?${ new URLSearchParams({search}) }`, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    articleStats.value = res.data;
  } catch (e) {
    handleError(e)
  }
}

export function moveBetweenState(amount: number, initialState: ArticleState, finalState: ArticleState) {
  console.log("moveBetweenState", amount, initialState, finalState);
  const articleStats = useArticleStats();
  console.log("1", JSON.stringify(articleStats.value));
  articleStats.value = articleStats.value.map((stat) => {
    if (stat.state === initialState) {
      return {
        ...stat,
        _count: {
          _all: stat._count._all - amount
        }
      }
    }
    if (stat.state === finalState) {
      return {
        ...stat,
        _count: {
          _all: stat._count._all + amount
        }
      }
    }
    return stat;
  })
  console.log("2", JSON.stringify(articleStats.value));
}
