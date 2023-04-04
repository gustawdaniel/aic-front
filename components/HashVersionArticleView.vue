<script lang="ts" setup>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import RenderedArticleView from "~/components/article/RenderedArticleView.vue";

const isLoading = ref<boolean>(false);

import { ArticleComponent, ArticlePayload, SingleArticle } from "~/intefaces/Article";
import { computed, useToken } from "#imports";
import axios from "axios";

const props = defineProps<{ article: SingleArticle, hash: string }>();

const article = computed<SingleArticle>(() => props.article);

const components = ref<ArticleComponent[]>([])

onMounted(async () => {
  try {
    isLoading.value = true;
    const config = useRuntimeConfig()
    const token = useToken();
    const {data} = await axios.get<ArticlePayload>(config.public.apiUrl + `/article/${ article.value.id }/version/${ props.hash }`, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    components.value = data.components;
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false;
  }
});

async function applyVersion() {
  try {
    isLoading.value = true;
    const config = useRuntimeConfig()
    const token = useToken();

    console.log("token", token.value);
    const {data} = await axios.put<SingleArticle>(config.public.apiUrl + `/article/${ article.value.id }/version/${ props.hash }`, {}, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    await getSingleArticle(data.id)
  } catch (error) {
    handleError(error)
  } finally {
    isLoading.value = false;
  }
}

</script>

<template>
  <div></div>
  <div>
    <loading v-model:active="isLoading"
             :can-cancel="true"
             :is-full-page="false"/>

    <div v-if="!isLoading && components">

      <button
          @click="applyVersion"
          type="button"
              class="w-full rounded bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        Apply this version
      </button>


      <RenderedArticleView :article="{components}"/>
    </div>
  </div>
</template>

<style scoped></style>
