<script lang="ts" setup>
import {useToken} from "~/composables/token";
import {EyeIcon} from '@heroicons/vue/20/solid'
import {computed} from '#imports';

const hidden = ref<boolean>(true);

const token = useToken();

const secureToken = computed<string>((): string => {
  if(hidden.value) {
    return new Array(token.value?.length ?? 100).fill('*').join('')
  }
  return token.value ?? ''
})
</script>

<template>
  <div class="mt-8">
    <div class="flex justify-between">
      <label class="block text-sm font-medium text-gray-700">Your Access Token for this application:</label>
      <label @click="hidden = !hidden" class="select-none rounded text-sm text-gray-600 font-mono cursor-pointer">
        <EyeIcon class="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true"/>
      </label>
    </div>
    <div class="text-xs">
      <pre class="whitespace-pre-wrap break-all bg-gray-900 text-green-600 p-4 rounded-lg shadow-md">{{
          secureToken
        }}</pre>
    </div>
  </div>
</template>

<style scoped></style>
