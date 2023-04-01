<script lang="ts" setup>
import { throttle } from 'throttle-debounce';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import axios from "axios";
import { useToken } from "~/composables/token";
import { computed, getMessage, handleError, useModal, useRouter, useSearch, useSelectedGpt3Contexts } from "#imports";
import {
  CheckIcon,
  XMarkIcon,
  BookOpenIcon,
  ArrowUturnLeftIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/solid'
import { Article, ArticleState } from "~/intefaces/Article";
import { ucFirst } from "~/composables/ucfirst";
import { getArticleTitle } from "~/composables/getArticleTitle";
import MoveToQueue from "~/components/dialogs/MoveToQueue.vue";
import { useArticles } from "~/composables/articles";
import PublishConfirmation from "~/components/dialogs/PublishConfirmation.vue";
import dayjs from "dayjs";
import { ClickableLink } from "~/intefaces/ClickableLink";
import WordHighlighter from "vue-word-highlighter";

import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const router = useRouter();

const articles = useArticles()
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();

function setPage(link: ClickableLink) {
  loadArticles(link.url)
}

type SortType = 'id_desc' | 'id_asc' | 'title_asc';

const sortValue = ref<SortType>('id_desc');

const sortOptions = computed<Array<{ name: string, value: SortType, current: boolean }>>(() => {
  const options: Array<{ name: string, value: SortType }> = [
    {name: 'Newest', value: 'id_desc'},
    {name: 'Oldest', value: 'id_asc'},
    {name: 'Alphabetical', value: 'title_asc'},
  ];

  return options.map((v) => ({...v, current: v.value === sortValue.value}))
});

function setSort(value: SortType): void {
  sortValue.value = value;
  loadArticles(articlesUrl.value)
}


type ArticleGroupSingleResult = {
  _count: {
    _all: 253
  },
  state: ArticleState
}

const articleStats = ref<Array<ArticleGroupSingleResult>>([])

const currentUrl = ref<string>('/article?state=new');
const link = ref<string>("");
const search = useSearch();

async function loadArticleStats() {
  try {
    const res = await axios.get(config.public.apiUrl + `/article-count-by-stata?${ new URLSearchParams({search: search.value.text}) }`, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    articleStats.value = res.data;
  } catch (e) {
    handleError(e)
  }
}

async function loadArticles(address: string = '') {
  isLoading.value = true;
  try {
    const url = address.startsWith('https') ? address : (config.public.apiUrl + (address ? address : '/article?state=new'));
    currentUrl.value = url;

    console.log("url", url);

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    const {data, headers} = res;

    articles.value = data;
    link.value = headers.link ?? '';
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false;
  }

}


onMounted(() => {
  loadArticles();
  loadArticleStats()
  search.value.enabled = true;
});

onUnmounted(() => {
  search.value.enabled = false;
})

const openTab = ref<string>('new');

const tabs = computed(() => {
  const states = ['new', 'queued', 'rejected', 'verification', 'published'];

  return states.map((state) => ({
    name: ucFirst(state),
    id: state,
    count: articleStats.value.find(art => art.state === state)?._count._all ?? 0,
    current: openTab.value === state
  }))
})

const articlesUrl = computed<string>(() => `/article?${ new URLSearchParams({
  state: openTab.value,
  search: search.value.text,
  sort: sortValue.value
}) }`);

watch(search.value, (p, n) => {
  console.log("p,n", p, n);
  throttle(1000, (s: { enabled: boolean, text: string }) => {
    console.log('s:', s);
    loadArticles(articlesUrl.value)
    loadArticleStats()
  })(n);
})

function setTab(id: string): void {
  openTab.value = id;
  loadArticles(articlesUrl.value)
}

function readArticle(articleId: string) {
  router.push(`/article/${ articleId }`);
}

async function queueArticle(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);

  const modal = useModal();
  modal.value.context = {
    articles: [article]
  }
  modal.value.component = MoveToQueue;
}

function confirmPublication(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);
  const modal = useModal();
  modal.value.context = {
    articles: [article]
  }
  modal.value.component = PublishConfirmation;

}

async function rejectArticle(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);
  if (article) {
    article.state = 'rejected'
  }

  const {data} = await axios.put(config.public.apiUrl + `/article/${ articleId }`, {state: 'rejected'}, {
    headers: {
      Authorization: `Bearer ${ token.value }`
    }
  });

  // todo notification
}

async function moveToNewArticle(articleId: string) {
  const article = articles.value.find((art) => art.id === articleId);
  if (article) {
    article.state = 'new'
  }

  const {data} = await axios.put(config.public.apiUrl + `/article/${ articleId }`, {state: 'new'}, {
    headers: {
      Authorization: `Bearer ${ token.value }`
    }
  });

  // todo notification
}

async function remove(articleId: string) {
  const {data} = await axios.delete(config.public.apiUrl + `/article/${ articleId }`, {
    headers: {
      Authorization: `Bearer ${ token.value }`
    }
  });

  articles.value = articles.value.filter((art) => art.id !== articleId);

}

const visibleArticles = computed<Article[]>(() => {
  return articles.value
      .filter(art => art.state === openTab.value)
      .filter(art => search.value.text ? (
          art.request?.url.toLowerCase().includes(search.value.text.toLowerCase()) || getArticleTitle(art).toLowerCase().includes(search.value.text.toLowerCase())
      ) : true)
})

function getDateFromMongoId(id: string) {
  const unixTimestamp = parseInt(id.substring(0, 8), 16);
  return new Date(unixTimestamp * 1000);
}


</script>

<template>
  <div class="min-h-full">
    <NavBar/>
    <Gpt3ContextManager/>

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
                <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-6 sm:pr-0">
                  <span class="sr-only">Edit</span>


                  <Menu as="div" class="relative inline-block text-left">
                    <div>
                      <MenuButton
                          class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        Sort
                        <ChevronDownIcon
                            class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"/>
                      </MenuButton>
                    </div>

                    <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                      <MenuItems
                          class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div class="py-1">
                          <MenuItem v-for="option in sortOptions" :key="option.name" v-slot="{ active }">
                            <a @click="setSort(option.value)"
                               :class="[option.current ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']">{{
                                option.name
                              }}</a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>


                </th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr v-for="article in visibleArticles" :key="article.id">
                <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                  <component
                      :is="article.request ? 'a' : 'span'"
                      :href="article.request?.url" target="_blank"
                      class="text-ellipsis">
                    <WordHighlighter :query="search.text">
                      {{
                        getArticleTitle(article).substring(0, 100).trim() + (getArticleTitle(article).length > 100 ? '...' : '')
                      }}
                    </WordHighlighter>
                  </component>
                </td>
                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{{ article.components.length }}</td>
                <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                  {{ dayjs(getDateFromMongoId(article.id)).format('YY-MM-DD') }}
                </td>

                <td class="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0 flex">
                  <BookOpenIcon class="h-6 w-6 text-blue-500 cursor-pointer" @click="readArticle(article.id)"
                                title="See how our system parsed this article"/>
                  <CheckIcon v-if="article.state === 'new'" class="h-6 w-6 text-green-500 cursor-pointer"
                             @click="queueArticle(article.id)"
                             title="Pass article to AI processing with your prompts"/>
                  <XMarkIcon v-if="article.state === 'new'" class="h-6 w-6 text-red-500 cursor-pointer"
                             @click="rejectArticle(article.id)"
                             title="Reject article - it will not be processed."/>
                  <CloudArrowUpIcon v-if="['new', 'verification'].includes(article.state)"
                                    class="h-6 w-6 text-green-500 cursor-pointer"
                                    @click="confirmPublication(article.id)" title="Publish on your platform."/>
                  <ArrowUturnLeftIcon v-if="article.state === 'rejected'" class="h-6 w-6 text-gray-500 cursor-pointer"
                                      @click="moveToNewArticle(article.id)"
                                      title="Return to New Articles."/>
                  <TrashIcon class="h-6 w-6 text-red-500 cursor-pointer"
                             @click="remove(article.id)"
                             title="Remove article from database."/>


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

            <Pagination v-if="link" :link="link" @setPage="setPage"/>
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
