<script lang="ts" setup>
import { Article } from "~/intefaces/Article";
import { getArticleTitle } from "~/composables/getArticleTitle";
import { NewspaperIcon, } from '@heroicons/vue/20/solid'
import {
  useModal,
  useToken,
  useSelectedGpt3Contexts,
  useHeaderPrompt,
  useParagraphPrompt,
  useCodePrompt, computed, useCodePromptEnabled, setQueue, handleError
} from "#imports";
import axios from "axios";
import { useArticles } from "~/composables/articles";
import { uid } from "uid";

const modal = useModal()

onMounted(() => {
  headerPrompt.value.value = 'Przetłumacz ten nagłówek z polskiego na angielski';
  paragraphPrompt.value.value = 'Przetłumacz ten tekst z polskiego na angielski';
})

const headerPrompt = useHeaderPrompt();
const paragraphPrompt = useParagraphPrompt();
const codePrompt = useCodePrompt();
const codePromptEnabled = useCodePromptEnabled();

const selectedContext = useSelectedGpt3Contexts();

const header = computed<string>(() => headerPrompt.value.value);
const text = computed<string>(() => paragraphPrompt.value.value);
const code = computed<string>(() => codePrompt.value.value);

const config = useRuntimeConfig();

async function upsertProcessingTemplate(): Promise<string> {
  try {
    const {data} = await axios.post(config.public.apiUrl + `/processing-template`, {
      context: selectedContext.value?.value ?? '',
      header: header.value,
      text: text.value,
      code: code.value,
    }, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    return data.id;
  } catch (e) {
    handleError(e)
    return '';
  }
}

const token = useToken();
const articles = useArticles();

async function moveArticlesToQueue() {
  const processingTemplateId = await upsertProcessingTemplate();
  let error = null;
  console.log("processingTemplateId");

  for (const {id} of props.articles) {

    if(error) {
      handleError(error);
      return;
    }

    const queue_id = uid();

    setQueue({
      type: 'process-article',
      id: queue_id,
      progress: 0
    })

    const article = articles.value.find((art) => art.id === id);
    if (article) {
      article.state = 'queued'

      try {
        const {data} = await axios.put(config.public.apiUrl + `/article/${ article.id }`, {
          state: 'queued',
          processing_template_id: processingTemplateId,
          queue_id
        }, {
          headers: {
            Authorization: `Bearer ${ token.value }`
          }
        });
      } catch (e) {
        error = e;
      }
    }
  }

  closeModal()
}

function closeModal() {
  modal.value.component = undefined;
  modal.value.context = undefined;
}

const props = defineProps<{ articles: Article[] }>();

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
            <p class="mt-2">Role</p>
          </dt>
          <dd class=" text-sm text-gray-900 sm:col-span-2 sm:mt-0">

            <textarea v-if="selectedContext" type="text"
                      disabled
                      class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="As a helpful assistant 😇"
                      v-model="selectedContext.value"
            />
            <p v-else class="text-gray-600 my-2">No context selected.</p>

          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            <p class="mt-2">Headers</p>
          </dt>
          <dd class=" text-sm text-gray-900 sm:col-span-2 sm:mt-0">

            <textarea type="text"
                      class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Change title to more bold 😎"
                      v-model="headerPrompt.value"
            />

          </dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500"><p class="mt-2">Texts</p></dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <textarea type="text"
                      class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add little bit humor to this text 🤪"
                      v-model="paragraphPrompt.value"
            />
          </dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6" v-if="codePromptEnabled">
          <dt class="text-sm font-medium text-gray-500"><p class="mt-2">Code</p></dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            <textarea type="text"
                      class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Rewrite this code to Rust 🦀"
                      v-model="codePrompt.value"
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
