<script lang="ts" setup>
import { SingleArticle } from "~/intefaces/Article";
import { computed } from "#imports";

const props = defineProps<{ article: Pick<SingleArticle, 'components'> }>();

const article = computed<Pick<SingleArticle, 'components'>>(() => props.article);

onMounted(() => {
  console.log("article.value");
});

const classes = {
  'h1': 'text-3xl font-bold leading-tight',
  'h2': 'text-2xl font-bold leading-tight',
  'h3': 'text-xl font-bold leading-tight',
  'h4': 'text-lg font-bold leading-tight',
  'h5': 'text-base font-bold leading-tight',
  'h6': 'text-sm font-bold leading-tight',
  'p': 'text-base leading-relaxed',
  'li': 'list-disc',
  'code': 'text-sm font-mono bg-gray-100 px-1 rounded',
};
</script>

<template>
    <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4 border-gray-200 border-dashed border">
        <template v-for="(component, number) in article.components" :key="number">
            <img :src="component.text" v-if="component.xpath[0] === 'img'" :alt="component.text" class="py-1">
            <component v-else :is="component.xpath[0]" :class="classes[component.xpath[0]]" class="py-1">
                {{ component.text }}
            </component>
        </template>
    </div>
</template>

<style scoped></style>
