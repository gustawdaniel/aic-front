import {ArticleComponent} from "~/intefaces/Article";

export const useSelectedArticleComponent = () => {
    return useState<{ index: number, component: ArticleComponent } | undefined>('selected-article-component', () => undefined)
}

export const selectArticleComponent = (index: number, component: ArticleComponent) => {
    const state = useSelectedArticleComponent();
    state.value = {index, component};
}
