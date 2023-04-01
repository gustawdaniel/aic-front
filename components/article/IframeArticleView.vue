<script lang="ts" setup>
import {Article} from "~/intefaces/Article";
import {computed} from "#imports";

const props = defineProps<{article: Article}>();

const article = computed<Article>(() => props.article);
</script>

<template>
  <div>
    <iframe :src="article.request.url" frameborder="1" class="w-full h-full min-h-half"/>
  </div>
</template>

<style>
.min-h-half {
  min-height: 50vh;
}
</style>
