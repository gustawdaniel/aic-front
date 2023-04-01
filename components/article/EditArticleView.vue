<script lang="ts" setup>
import {Article} from "~/intefaces/Article";
import {computed, selectArticleComponent} from "#imports";

const props = defineProps<{article: Article}>();

const article = computed<Article>(() => props.article);
</script>

<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
    <div class="bg-white">
      <div class=" divide-y divide-gray-900/10">
        <dl class="  divide-y divide-gray-900/10">
          <div v-for="(component, number) in article.components" :key="number"
               class="py-3 lg:grid lg:grid-cols-12 lg:gap-8"
               @click="selectArticleComponent(number, component)"
          >
            <dt class="text-base font-semibold leading-7 text-gray-900 lg:col-span-1">
              <div class="flex justify-between">
                <span>{{ component.xpath[0] }}</span>
                <span>{{ component.finish_reason }}</span>
              </div>
            </dt>
            <dd class="mt-4 lg:col-span-11 lg:mt-0">
              <p class="text-base leading-7 text-gray-600">{{ component.text }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
