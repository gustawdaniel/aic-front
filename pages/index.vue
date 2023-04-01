<script setup lang="ts">
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import axios, {AxiosResponse} from "axios";
import {useToken} from "~/composables/token";
import {handleError, ref, useQueues, useUser} from '#imports';
import dayjs from "dayjs";
import {uid} from "uid";
import {setQueue} from "~/composables/queues";
import {DialogMessage, DialogResponse} from "~/intefaces/Gpt3Interface";
import {askGpt3} from "~/composables/askGpt3";

const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();
const dialog = ref<DialogMessage[]>([])
const question = ref<string>('');

async function messageToGpt3() {
  try {
    isLoading.value = true;
    dialog.value.push({
      text: question.value,
      finish_reason: '',
      role: 'user',
      author: 'me',
      at: dayjs().format('HH:mm:ss')
    });
    const data = await askGpt3([{
      role: 'user',
      content: question.value
    }])
    dialog.value.push({
      text: data.message.content,
      finish_reason: data.finish_reason,
      author: 'ai',
      role: data.message.role,
      at: dayjs().format('HH:mm:ss')
    });
    question.value = '';
  } catch (e) {
    handleError(e);
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
}

let conversations = ref<HTMLElement>();

async function scrollToBottom() {

  console.log("scrollToBottom", conversations.value);

  if (conversations.value) {
    await nextTick();
    conversations.value.scrollTop = conversations.value.scrollHeight;
  }
}

const queues = useQueues()

async function testQueue() {
  const index = uid();

  setQueue({
    type: 'debug',
    id: index,
    progress: 0
  })

  await axios.post<DialogResponse, undefined, { id: string, wait: number }>(config.public.apiUrl + '/queue/debug', {
    id: index,
    wait: 2000,
  }, {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
}

const user = useUser();
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
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard:</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <!-- Replace with your content -->

          <div class="max-h-half-screen flex flex-col border shadow-md bg-white">
            <div class="flex-1 overflow-y-auto scroll-smooth" ref="conversations" :class="{
              'px-4 py-4': dialog.length
            }">

              <div class="chat" :class="message.author === 'me' ? 'chat-end' : 'chat-start'" v-for="message in dialog">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full">
                    <img :src="message.author === 'me' ? user.avatar : '/gpt3.svg'" alt="avatar"/>
                  </div>
                </div>
                <div class="chat-header">
                  {{ message.author === 'me' ? user.full_name : `Gpt3 (${message.role})` }}
                  <time class="text-xs opacity-50">{{ message.at }}</time>
                </div>
                <div class="chat-bubble whitespace-pre-line" v-html="message.text.trim()"/>
                <div class="chat-footer opacity-50">
                  {{ message.author === 'me' ? 'Delivered' : message.finish_reason }}
                </div>
              </div>

            </div>
            <div class="border-t p-2">

              <form @submit.prevent="messageToGpt3" class="rounded-md">

                <div class="mt-2">
              <textarea rows="4" name="comment"
                        @keyup.exact.enter="messageToGpt3"
                        v-model="question"
                        class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"/>
                </div>

                <div class="mt-2 flex justify-end">
                  <button type="submit"
                          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Send
                  </button>
                </div>
              </form>

            </div>
          </div>

          <button class="btn" @click="testQueue">Button</button>


          <pre>{{ queues }}</pre>

          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>
</template>

<style>
.max-h-half-screen {
  max-height: 50vh;
}
</style>
