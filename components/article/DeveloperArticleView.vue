<script lang="ts" setup>
import {  SingleArticle } from "~/intefaces/Article";
import {computed} from "#imports";

const props = defineProps<{article: SingleArticle}>();

const article = computed<SingleArticle>(() => props.article);
</script>

<template>
  <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
    <pre>{{article}}</pre>
  </div>
</template>

<style scoped></style>
