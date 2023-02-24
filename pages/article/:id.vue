<script lang="ts" setup>

import {useRoute, useToken} from "#imports";
import axios from "axios";
import {Article} from "~/intefaces/Article";

const route = useRoute()
const article = ref<Article | undefined>();
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();
import {getArticleTitle} from "~/composables/getArticleTitle";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

async function getArticle() {
  isLoading.value = true;
  const {data} = await axios.get<Article>(config.public.apiUrl + `/article/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  isLoading.value = false;
  article.value = data;
}

onMounted(() => {
  getArticle()
})

const views = [
  { id: 'components', title: 'Components View' },
  { id: 'rendered', title: 'Rendered View' },
  { id: 'developer', title: 'Developer View' },
]

type SingleArticleView = 'components' | 'rendered' | 'developer';

const selectedView = ref<SingleArticleView>('components');

function selectView(view: SingleArticleView) {
  selectedView.value = view;
}

const faqs = [
  {
    id: 1,
    question: "What's the best thing about Switzerland?",
    answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
]

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
  <div class="min-h-full">
    <NavBar/>

    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="true"/>

    <div class="py-10" v-if="article">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">{{ article ? getArticleTitle(article) : 'Loading...' }}</h1>
          <p class="mt-2 text-sm text-gray-700">Articles parsed form requests that you send to your sources.</p>

          <div>
            <fieldset class="mt-4">
              <legend class="sr-only">View type</legend>
              <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <!-- Heading Elements -->


                <div v-for="view in views" :key="view.id" class="flex items-center">
                  <input :id="view.id" name="notification-method" type="radio" @change="selectView(view.id)" :checked="view.id === selectedView" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <label :for="view.id" class="ml-3 block text-sm font-medium text-gray-700">{{ view.title }}</label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </header>
      <main>
        <div v-if="selectedView === 'components'" class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
          <div class="bg-white">
            <div class=" divide-y divide-gray-900/10">
<!--              <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>-->
              <dl class="mt-10  divide-y divide-gray-900/10">
                <div v-for="(component, number) in article.components" :key="number" class="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                  <dt class="text-base font-semibold leading-7 text-gray-900 lg:col-span-1">
                    <div class="flex justify-between">
                      <span>{{ component.xpath[0] }}</span>
                      <span>{{component.finish_reason}}</span>
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
        <div v-else-if="selectedView === 'rendered'" class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4 border-gray-200 border-dashed border">
          <template v-for="(component, number) in article.components" :key="number">
            <component :is="component.xpath[0]" :class="classes[component.xpath[0]]" class="py-1">{{component.text}}</component>
          </template>
        </div>
        <div v-else-if="selectedView === 'developer'" class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
          <pre>{{article}}</pre>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
