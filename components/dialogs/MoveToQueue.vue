<script lang="ts" setup>
import {Article} from "~/intefaces/Article";
import {getArticleTitle} from "~/composables/getArticleTitle";
import {NewspaperIcon,} from '@heroicons/vue/20/solid'
import {useModal, useToken} from "#imports";
import axios from "axios";
import {useArticles} from "~/composables/articles";

const modal = useModal()

const header = ref<string>('');
const text = ref<string>('');
const code = ref<string>('');

const config = useRuntimeConfig();

async function upsertProcessingTemplate(): Promise<string> {
  const {data} = await axios.post(config.public.apiUrl + `/processing-template`, {
    header: header.value,
    text: text.value,
    code: code.value,
  }, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  return data.id;
}

const token = useToken();
const articles = useArticles();

async function moveArticlesToQueue() {
  const processingTemplateId = await upsertProcessingTemplate();

  console.log("processingTemplateId");

  for(const {id} of props.articles) {

    const article = articles.value.find((art) => art.id === id);
    if (article) {
      article.state = 'queued'

      const {data} = await axios.put(config.public.apiUrl + `/article/${article.id}`, {
        state: 'queued',
        processing_template_id: processingTemplateId
      }, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
    }
  }

  closeModal()
}

function closeModal() {
  modal.value.component = undefined;
  modal.value.context = undefined;
}

const props = defineProps<{ articles: Article[] }>()
</script>

<template>
  <div>
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">Process Articles</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Set prompts for AI to process parts of article.</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            <p class="mt-2">Headers</p>
          </dt>
          <dd class=" text-sm text-gray-900 sm:col-span-2 sm:mt-0">

            <input type="text"
                   class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   placeholder="Change title to more bold 😎"
                   v-model="header"
            />

          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500"><p class="mt-2">Texts</p></dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <input type="text"
                   class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   placeholder="Add little bit humor to this text 🤪"
                   v-model="text"
            />
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500"><p class="mt-2">Code</p></dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <input type="text"
                   class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   placeholder="Rewrite this code to Rust 🦀"
                   v-model="code"
            />
          </dd>
        </div>
        <div class="bg-white px-4 py-5  sm:px-6">
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0">
            <ul role="list" class="divide-y divide-gray-200 rounded-md border border-gray-200">

              <li v-for="article in props.articles" class="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                <div class="flex w-0 flex-1 items-center">
                  <NewspaperIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true"/>
                  <span class="ml-2 w-0 flex-1 truncate">{{ getArticleTitle(article) }}</span>
                </div>
                <!--                  <div class="ml-4 flex-shrink-0">-->
                <!--                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Download</a>-->
                <!--                  </div>-->
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>

    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="moveArticlesToQueue">Add
      </button>
      <button type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              @click="closeModal" ref="cancelButtonRef">Close
      </button>
    </div>
  </div>
</template>

<style scoped></style>
