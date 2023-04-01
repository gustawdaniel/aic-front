<script lang="ts" setup>
import {Article} from "~/intefaces/Article";
import {computed} from "#imports";

const props = defineProps<{article: Article}>();

const article = computed<Article>(() => props.article);
</script>

<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
    <pre>{{article}}</pre>
  </div>
</template>

<style scoped></style>
