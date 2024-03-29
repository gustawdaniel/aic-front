<script lang="ts" setup>
import {  ArticleComponent, SingleArticle } from "~/intefaces/Article";
import {
  computed,
  selectArticleComponent,
  useAiRequestCache,
  useArticleComponentsAnswers, useSelectedArticle,
  useSelectedArticleComponents
} from "#imports";
import { uid } from "uid";

const props = defineProps<{ article: SingleArticle }>();
const selectedComponents = useSelectedArticleComponents();
const answers = useArticleComponentsAnswers();
const article = computed<SingleArticle>(() => props.article);

const aiRequestCache = useAiRequestCache();

function inputChanged(event: InputEvent, component: ArticleComponent) {
  const selectedArticle = useSelectedArticle();

  console.log("inputChanged", event);
  if(event.target) {
    const newText = (event.target as HTMLParagraphElement).innerText;

    if(selectedArticle.value) {
      const componentToModify = selectedArticle.value.components.find((comp) => comp.id === component.id);
      if(componentToModify ) {
        componentToModify.text = newText;
      }
    }
  }
}

function addArticleComponent() {
  const selectedArticle = useSelectedArticle();

  if(selectedArticle.value) {
    const newComponent: ArticleComponent = {
      id: uid(),
      xpath: ['p'],
      text: '',
      finish_reason: '',
      ai_requests: []
    }
    selectedArticle.value.components.push(newComponent);
  }
}

</script>

<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
    <div class="bg-white">
      <div class=" divide-y">
        <!--        <pre>{{selectedComponents}}</pre>-->
        <!--        <pre>{{ article.components }}</pre>-->
        <!--        <pre>{{aiRequestCache}}</pre>-->
        <dl class="  divide-y">
          <div v-for="(component, number) in article.components" :key="number"
               class="py-3 lg:grid lg:grid-cols-12 lg:gap-8"
               :class="{'border-l-4 pl-4 border-indigo-600': selectedComponents.has(component.id)}"
          >
            <dt class="text-base font-semibold leading-7 text-gray-900 lg:col-span-1"
                @click="selectArticleComponent(component)">
              <div class="flex justify-between">
                <span>{{ component.xpath[0] }}</span>
                <span>{{ component.finish_reason }}</span>
              </div>
            </dt>
            <dd class="mt-4 lg:col-span-11 lg:mt-0">
              <img :src="component.text" v-if="component.xpath[0] === 'img'" :alt="component.text">
              <p v-else class="text-base leading-7 text-gray-600 whitespace-pre-line	" :contenteditable="true"
                 @input="(event) => inputChanged(event, component)">{{ component.text }}</p>
            </dd>
            <template v-if="selectedComponents.has(component.id)">
              <dt class="lg:col-span-1"></dt>
              <dd class="mt-4 lg:col-span-11 lg:mt-0">
                <textarea class="text-base leading-7 w-full text-gray-600"
                          :value="answers.has(component.id) ? answers.get(component.id).message.content : ''"/>
              </dd>
            </template>
          </div>
          <button class="btn bg-indigo-500" @click="addArticleComponent">Add component</button>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
