import { ArticleState } from "~/intefaces/Article";

export type ArticleGroupSingleResult = {
  _count: {
    _all: number
  },
  state: ArticleState
}
