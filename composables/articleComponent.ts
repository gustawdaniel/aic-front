import {ArticleComponent} from "~/intefaces/Article";
import { DialogResponse } from "~/intefaces/Gpt3Interface";

export const useSelectedArticleComponents = () => {
    return useState<Map<string, ArticleComponent>>('selected-article-components', () => new Map())
}


export const useArticleComponentsAnswers = () => {
    return useState<Map<string, DialogResponse>>('article-component-answers', () => new Map())
}

export const selectArticleComponent = (index: number, component: ArticleComponent) => {

    const manyState = useSelectedArticleComponents();

    console.log("manyState", manyState, component.id, component);
    if(manyState.value.has(component.id)) {
        manyState.value.delete(component.id)
    } else {
        manyState.value.set(component.id, component)
    }
}
