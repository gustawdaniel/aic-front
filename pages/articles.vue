<script lang="ts" setup>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import axios from "axios";
import {useToken} from "~/composables/token";
import {computed, useRouter} from "#imports";
import {CheckIcon, XMarkIcon, BookOpenIcon} from '@heroicons/vue/24/solid'
import {Article} from "~/intefaces/Article";
import {ucfirst} from "~/composables/ucfirst";
import {getArticleTitle} from "~/composables/getArticleTitle";

const router = useRouter();

const articles = ref<Article[]>([]);
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();

async function loadArticles() {
  isLoading.value = true;
  const {data} = await axios.get(config.public.apiUrl + '/article', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  isLoading.value = false;
  articles.value = data;
}

onMounted(() => {
  loadArticles();
})

const openTab = ref<string>('new');

const tabs = computed(() => {
  const states = ['new', 'queued', 'rejected', 'verification', 'accepted'];

  return states.map((state) => ({
    name: ucfirst(state),
    id: state,
    count: articles.value.filter(art => art.state === state).length,
    current: openTab.value === state
  }))
})

function setTab(id: string): void {
  openTab.value = id;
}

function readArticle(articleId: string) {
  router.push(`/article/${articleId}`);
}

async function queueArticle(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);
  if (article) {
    article.state = 'queued'
  }

  const {data} = await axios.put(config.public.apiUrl + `/article/${articleId}`,{state: 'queued'}, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  // todo notification
}

async function rejectArticle(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);
  if (article) {
    article.state = 'rejected'
  }

  const {data} = await axios.put(config.public.apiUrl + `/article/${articleId}`,{state: 'rejected'}, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  // todo notification
}

</script>

<template>
  <div class="min-h-full">
    <NavBar/>

    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="true"/>

    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Articles</h1>
          <p class="mt-2 text-sm text-gray-700">Articles parsed form requests that you send to your sources.</p>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-4">
          <!-- Replace with your content -->
          <div>
            <div class="sm:hidden">
              <label for="tabs" class="sr-only">Select a tab</label>
              <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
              <select id="tabs" name="tabs"
                      class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
              </select>
            </div>
            <div class="hidden sm:block">
              <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                  <span v-for="tab in tabs" :key="tab.name" @click="setTab(tab.id)"
                        :class="[tab.current ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200', 'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm']"
                        :aria-current="tab.current ? 'page' : undefined">
                    {{ tab.name }}
                    <span v-if="tab.count"
                          :class="[tab.current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900', 'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block']">{{
                        tab.count
                      }}</span>
                  </span>
                </nav>
              </div>
            </div>
          </div>
          <!-- /End replace -->

          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Title
                </th>
                <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Components</th>
                <!--                <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">State</th>-->
                <th scope="col" class="relative py-3.5 pl-3 pr-6 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr v-for="article in articles.filter(art => art.state === openTab)" :key="article.id">
                <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  <a :href="article.request.url" target="_blank" class="text-ellipsis">{{ getArticleTitle(article) }}</a>
                </td>
                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{{ article.components.length }}</td>
                <!--                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{{ article.state }}</td>-->

                <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0 flex">
                  <BookOpenIcon class="h-6 w-6 text-blue-500 cursor-pointer" @click="readArticle(article.id)"
                                title="See how our system parsed this article"/>
                  <CheckIcon class="h-6 w-6 text-green-500 cursor-pointer" @click="queueArticle(article.id)"
                             title="Pass article to AI processing with your prompts"/>
                  <XMarkIcon class="h-6 w-6 text-red-500 cursor-pointer" @click="rejectArticle(article.id)"
                             title="Reject article - it will not be processed."/>

                  <!--                      <span @click="request(article.id)" class="text-indigo-600 hover:text-indigo-900 cursor-pointer">Request<span-->
                  <!--                          class="sr-only">, {{ article.url }}</span></span>-->
                </td>

                <!--                    TODO -->
                <!--                    <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">-->
                <!--                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span-->
                <!--                          class="sr-only">, {{ article.url }}</span></a>-->
                <!--                    </td>-->
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
