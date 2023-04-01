<script lang="ts" setup>
import {DialogTitle} from '@headlessui/vue'
import {InformationCircleIcon} from '@heroicons/vue/24/outline'
import { handleError, useModal, useToken } from "#imports";
import axios from "axios";
import {useSources} from "~/composables/sources";
import {Source} from "~/intefaces/Source";

function closeModal() {
  const modal = useModal();
  modal.value.component = undefined
  modal.value.context = undefined
}

const config = useRuntimeConfig();

const url = ref<string>('');
const token = useToken();

const sources = useSources();

function addHttps(url: string): string {
  return `https://` + url.replace(`https://`, '');
}

async function addSource() {
  if (url) {
    try {
      const {data} = await axios.post<Omit<Source, '_count'>>(config.public.apiUrl + '/source', {url: addHttps(url.value)}, {
        headers: {
          Authorization: `Bearer ${ token.value }`
        }
      });
      sources.value.push({...data, _count: {requests: 0}});
      closeModal();
    } catch (e) {
      handleError(e)
    }
  }
}
</script>

<template>
  <div>
    <div class="sm:flex sm:items-start">
      <div
          class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
        <InformationCircleIcon class="h-6 w-6 text-blue-600" aria-hidden="true"/>
      </div>
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Add source</DialogTitle>
        <div class="mt-2">
          <div>
            <label for="company-website" class="block text-sm font-medium text-gray-700">Source Url</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">https://</span>
              </div>
              <input type="text" name="company-website" id="company-website"
                     class="block w-full rounded-md border-gray-300 pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:pl-14 sm:text-sm"
                     placeholder="www.example.com"
                     v-model="url"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="addSource">Add
      </button>
      <button type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              @click="closeModal" ref="cancelButtonRef">Close
      </button>
    </div>
  </div>
</template>

<style scoped></style>
