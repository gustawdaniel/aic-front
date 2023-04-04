import {ArticleComponent} from "~/intefaces/Article";
import { DialogResponse } from "~/intefaces/Gpt3Interface";
import { syncAiRequestCache } from "#imports";

export const useSelectedArticleComponents = () => {
    return useState<Map<string, ArticleComponent>>('selected-article-components', () => new Map())
}

export const useArticleComponentsAnswers = () => {
    return useState<Map<string, DialogResponse>>('article-component-answers', () => new Map())
}

export const selectArticleComponent = (component: ArticleComponent) => {

    const manyState = useSelectedArticleComponents();

    if(manyState.value.has(component.id)) {
        manyState.value.delete(component.id)
    } else {
        manyState.value.set(component.id, component)
        syncAiRequestCache(component.ai_requests).catch(handleError)
    }
}
