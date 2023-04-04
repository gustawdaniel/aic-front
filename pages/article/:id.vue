<script lang="ts" setup>

import {useRoute, useToken} from "#imports";

const route = useRoute()
const article = useSelectedArticle();
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import ComponentsArticleView from "~/components/article/ComponentsArticleView.vue";
import RenderedArticleView from "~/components/article/RenderedArticleView.vue";
import DeveloperArticleView from "~/components/article/DeveloperArticleView.vue";
import IframeArticleView from "~/components/article/IframeArticleView.vue";
import EditArticleView from "~/components/article/EditArticleView.vue";
import { getSingleArticle, useSelectedArticle } from "~/composables/articles";

async function getArticle() {
  isLoading.value = true;
  await getSingleArticle(String(route.params.id));
  isLoading.value = false;
}

onMounted(() => {
  getArticle()
})

const views:Array<{id: SingleArticleView, title: string}> = [
  {id: 'default', title: 'Default View'},
  {id: 'components', title: 'Components View'},
  {id: 'rendered', title: 'Rendered View'},
  {id: 'developer', title: 'Developer View'},
  {id: 'iframe', title: 'Iframe View'},
  {id: 'history', title: 'History View'},
]

type SingleArticleView = 'components' | 'rendered' | 'developer' | 'iframe' | 'default' | 'history';

const selectedView = ref<SingleArticleView>('default');

function selectView(view: SingleArticleView) {
  selectedView.value = view;
}


</script>

<template>
  <div class="min-h-full">
    <NavBar/>
    <Gpt3ContextManager/>

    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="true"/>

    <div class="py-10" v-if="article">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {{ article ? article.title : 'Loading...' }}
          </h1>

          <div>
            <fieldset class="mt-4">
              <legend class="sr-only">View type</legend>
              <div class="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <!-- Heading Elements -->

                <div v-for="view in views" :key="view.id" class="flex items-center">
                  <input :id="view.id" name="notification-method" type="radio" @change="selectView(view.id)"
                         :checked="view.id === selectedView"
                         class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                  <label :for="view.id" class="ml-3 block text-sm font-medium text-gray-700">{{ view.title }}</label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </header>

      <main>
        <ComponentsArticleView v-if="selectedView === 'components'" :article="article"/>
        <RenderedArticleView v-else-if="selectedView === 'rendered'" :article="article"/>
        <DeveloperArticleView v-else-if="selectedView === 'developer'" :article="article"/>
        <IframeArticleView v-else-if="selectedView === 'iframe'" :article="article"/>
        <HistoryArticleView v-else-if="selectedView === 'history'" :article="article"/>
        <div v-else-if="selectedView === 'default'" class="grid grid-cols-5 gap-4">
          <ArticleEditBar class="h-screen sticky top-0"/>
          <EditArticleView :article="article" class="col-span-2"/>
          <IframeArticleView :article="article" class="col-span-2"/>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
