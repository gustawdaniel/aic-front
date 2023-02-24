<script lang="ts" setup>
import {Article} from "~/intefaces/Article";
import {NewspaperIcon, CheckIcon} from '@heroicons/vue/20/solid'
import {getArticleTitle} from "~/composables/getArticleTitle";
import {useToken} from "~/composables/token";
import {useTargets} from "~/composables/targets";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const props = defineProps<{ articles: Article[] }>()

const config = useRuntimeConfig()
const token = useToken();

const isLoading = ref<boolean>(false);

const targets = useTargets()

async function loadTargets() {
  isLoading.value = true;
  const {data} = await axios.get(config.public.apiUrl + '/target', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  isLoading.value = false;
  targets.value = data;
}

onMounted(async () => {
  await loadTargets();
  if (targets.value.length === 1) {
    selectedTargets.value = [targets.value[0].id]
  }
})

async function confirmPublication() {
  const start = dayjs()
  let errors = 0;
  isLoading.value = true;
  for (const article of props.articles) {
    for (const targetId of selectedTargets.value) {
      try {
        await axios.post(config.public.apiUrl + '/article/' + article.id + '/publish/' + targetId, {},{
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        });
      } catch (error) {
        errors++;
        await Swal.fire(
            'Error!',
            getMessage(error),
            'error'
        );
      }
    }
  }
  isLoading.value = false;
  if (errors) {
    await Swal.fire(
        'Operation finished!',
        `It took ${dayjs().diff(start)}ms but there was ${errors} errors!`,
        'info'
    );
  } else {
    await Swal.fire(
        'Content published!',
        `It took only ${dayjs().diff(start)}ms!`,
        'success'
    );
  }

}

const selectedTargets = ref<Array<string>>([]);
</script>

<template>
  <div>
    <div class="bg-white px-4 py-5  sm:px-6">
      <h1 class="font-bold mb-2">Publish article{{ props.articles.length > 1 ? 's' : '' }}</h1>

      <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
        <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">
          <li v-for="article in props.articles" class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
            <div class="flex w-0 flex-1 items-center">
              <NewspaperIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
              <span class="ml-2 w-0 flex-1 truncate">{{ getArticleTitle(article) }}</span>
            </div>
          </li>
        </ul>
      </dd>

      <p class="my-2">On platforms</p>

      <div class="flex flex-wrap flex-col">
        <div v-for="target in targets" :key="target.id" class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
          <label class="inline-flex items-center">
            <input type="checkbox" :value="target.id" v-model="selectedTargets"
                   class="form-checkbox h-5 w-5 text-indigo-600">
            <span class="ml-2 text-gray-700">{{ target.url }}</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="px-4 py-2 text-white rounded text-sm"
                :class="!selectedTargets.length ? 'bg-gray-400' : 'bg-blue-500'" @click="confirmPublication"
                :disabled="!selectedTargets.length">
          <CheckIcon class="h-5 w-5 inline-block mr-1"/>
          Publish
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
