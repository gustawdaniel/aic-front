<script lang="ts" setup>
import { setQueue, useArticles, useQueues, useRouter } from "#imports";

import { useUser } from "~/composables/user";
import { useToken } from "~/composables/token";

const token = useToken()
const user = useUser()

const router = useRouter();

// https://accounts.google.com/gsi/client
useHead({
  script: [{
    async: true,
    src: 'https://accounts.google.com/gsi/client',
    defer: true
  }],
  htmlAttrs: {
    // 'data-theme': 'light'
    // 'data-theme': 'cyberpunk'
    'data-theme': 'wireframe'
  }
})

const articles = useArticles()

onMounted(() => {
  console.log("t", token.value);
  const config = useRuntimeConfig();

  const ws = new WebSocket(`${ (config.public.apiUrl ?? '').replace('http', 'ws') }/queue`)
  ws.onmessage = (event: MessageEvent<string>) => {
    console.log(event.data);
    const data = JSON.parse(event.data) as { id: string, type: 'debug' | 'process-article', progress: number, resource_id: string };
    setQueue(data)
    if (data.type === 'process-article' && data.resource_id && data.progress === 1) {
      const article = articles.value.find((art) => art.id === data.resource_id);
      if (article && article.state !== 'verification') {
        const prevState = article.state;
        console.log("article.state", article.state);
        article.state = 'verification';
        moveBetweenState(1, prevState, 'verification');
      } else {
        moveBetweenState(1, 'queued', 'verification');
      }
    }
  }

})

if (token.value) {
  console.log("token", token.value);
} else {
  console.log("location.href",);

  if (!location.href.endsWith('/login')) {
    location.href = '/login';
  }
}

import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { moveBetweenState } from "~/composables/articleStats";

const queues = useQueues()

const show = ref(true)
</script>

<template>
  <div>
    <!-- Global notification live region, render this permanently at the end of the document -->
    <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:p-6">
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
        <transition enter-active-class="transform ease-out duration-300 transition"
                    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
                    leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    :key="q[0]" v-for="q of Array.from(queues.entries())"
        >
          <div v-if="show"
               class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div class="p-4">
              <div class="flex items-center">
                <div class="flex w-0 flex-1 justify-between">
                  <p class="w-0 flex-1 text-sm font-medium text-gray-900">Queue {{ q[1].type }} - {{ q[0] }}</p>
                </div>
                <!--                <div class="ml-4 flex flex-shrink-0">-->
                <!--                  <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">-->
                <!--                    <span class="sr-only">Close</span>-->
                <!--                    <XMarkIcon class="h-5 w-5" aria-hidden="true" />-->
                <!--                  </button>-->
                <!--                </div>-->
              </div>
              <progress v-if="q[1].progress" class="progress progress-info w-full" :value="q[1].progress" max="1"/>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <slot/>

    <ModalFrame/>
  </div>
</template>

<style>
[data-theme=wireframe] {
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
</style>
