<script lang="ts" setup>
import {DialogTitle} from '@headlessui/vue'
import {InformationCircleIcon} from '@heroicons/vue/24/outline'
import {getMessage, handleError, useModal, useToken} from "#imports";
import axios from "axios";
import {useTargets} from "~/composables/targets";
import {Target} from "~/intefaces/Target";
import Swal from "sweetalert2";
import {fixUrl} from "~/composables/helpers";

function closeModal() {
  const modal = useModal();
  modal.value.component = undefined
  modal.value.context = undefined
}

const config = useRuntimeConfig();

const url = ref<string>('');
const type = ref<'ghost' | 'wordpress'>('wordpress');

const username = ref<string>('');
const password = ref<string>('');
const apiKey = ref<string>('');

const token = useToken();

const targets = useTargets();

async function addTarget() {
  if (url) {
    let payload: {
      url: string, type: 'wordpress' | 'ghost', auth: {
        username?: string,
        password?: string,
        key?: string
      }
    } = {
      url: fixUrl(url.value),
      type: type.value,
      auth: {}
    }

    if(!payload.url) {
      return handleError(Error('You have to add your platform url!'))
    }

    if (payload.type === 'wordpress') {
      payload.auth = {
        username: username.value,
        password: password.value
      }
      if(!payload.auth.username || !payload.auth.password) {
        return handleError(Error('You have to add admin username and password to your wordpress Author, Editor or Administrator!'))
      }
    } else {
      payload.auth = {
        key: apiKey.value
      }
      if(!payload.auth.key) {
        return handleError('You have to add admin api key for your blog!')
      }
    }

    try {
      const {data} = await axios.post<Target>(config.public.apiUrl + '/target', payload, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      targets.value.push({...data,});
      closeModal();
    } catch (e) {
      return handleError(e)
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
      <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
        <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">Add target</DialogTitle>
        <div class="mt-2 w-full">
          <div>
            <label for="company-website" class="block text-sm font-medium text-gray-700">Target Url</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 sm:text-sm">https://</span>
              </div>
              <input type="text"
                     class="block w-full rounded-md border-gray-300 pl-16 focus:border-indigo-500 focus:ring-indigo-500 sm:pl-14 sm:text-sm"
                     placeholder="www.example.com"
                     v-model="url"
              />


            </div>
          </div>

        </div>

        <div class="mt-2">
          <div class="flex justify-start">
            <div class="flex items-center space-x-4">
              <label
                  class="inline-flex items-center"
                  :class="{ 'font-bold': type === 'wordpress' }"
              >
                <input
                    type="radio"
                    class="form-radio"
                    name="radio-group"
                    value="wordpress"
                    v-model="type"
                >
                <span class="ml-2">wordpress</span>
              </label>

              <label
                  class="inline-flex items-center"
                  :class="{ 'font-bold': type === 'ghost' }"
              >
                <input
                    type="radio"
                    class="form-radio"
                    name="radio-group"
                    value="ghost"
                    v-model="type"
                >
                <span class="ml-2">ghost</span>
              </label>


            </div>
          </div>
        </div>

        <div class="mt-2 w-full" v-show="type === 'wordpress'">
          <div>
            <label for="company-website" class="block text-sm font-medium text-gray-700">Username</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <input type="text"
                     class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     v-model="username"
              />
            </div>
          </div>
        </div>

        <div class="mt-2 w-full" v-show="type === 'wordpress'">
          <div>
            <label for="company-website" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <input type="text"
                     class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     v-model="password"
              />
            </div>
          </div>
        </div>

        <div class="mt-2 w-full" v-show="type === 'ghost'">
          <div>
            <label for="company-website" class="block text-sm font-medium text-gray-700">Admin Api Key</label>
            <div class="relative mt-1 rounded-md shadow-sm">
              <input type="text"
                     class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     v-model="apiKey"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
    <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
      <button type="button"
              class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              @click="addTarget">Add
      </button>
      <button type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              @click="closeModal" ref="cancelButtonRef">Close
      </button>
    </div>
  </div>
</template>

<style scoped></style>
