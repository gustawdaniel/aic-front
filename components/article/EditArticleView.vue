<script lang="ts" setup>
import { Article } from "~/intefaces/Article";
import { computed, selectArticleComponent, useArticleComponentsAnswers, useSelectedArticleComponents } from "#imports";

const props = defineProps<{ article: Article }>();
const selectedComponents = useSelectedArticleComponents();
const answers = useArticleComponentsAnswers();
const article = computed<Article>(() => props.article);
</script>

<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
    <div class="bg-white">
      <div class=" divide-y">
<!--        <pre>{{selectedComponents}}</pre>-->
<!--        <pre>{{article.components}}</pre>-->
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
              <p class="text-base leading-7 text-gray-600 whitespace-pre-line	" :contenteditable="true">{{ component.text }}</p>
            </dd>
            <template v-if="selectedComponents.has(component.id)">
              <dt class="lg:col-span-1"></dt>
              <dd class="mt-4 lg:col-span-11 lg:mt-0">
                <textarea class="text-base leading-7 w-full text-gray-600" :value="answers.has(component.id) ? answers.get(component.id).message.content : ''"/>
              </dd>
            </template>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
