<script lang="ts" setup>
import {EyeIcon} from '@heroicons/vue/20/solid'
import axios from "axios";
import {handleError, useToken} from "#imports";
import Swal from "sweetalert2";
import {logout} from "~/composables/logout";

const config = useRuntimeConfig();
const token = useToken();

const type = ref<'text' | 'password'>('password');
const apiKey = ref<string>('');

function toggleType() {
  console.log("t");
  type.value = type.value === 'text' ? 'password' : 'text';
}

onMounted(async () => {
  try {
    const {data} = await axios.get(config.public.apiUrl + '/me?gpt3_api_key=1', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });


    console.log("data", data);

    apiKey.value = data.gpt3_api_key;
  } catch (error) {
    await handleError('You are not correctly logged in. You will be logged out after confirm.')
    logout()
  }
})

async function setApiKey() {
  try {
    await axios.patch(config.public.apiUrl + '/me?gpt3_api_key=1', {
      gpt3_api_key: apiKey.value
    }, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    return Swal.fire(
        'You saved api key!',
        `Now you can use AI to process your content!`,
        'success'
    );
  } catch (e) {
    handleError(e)
  }
}

</script>

<template>
  <div>

    <div>
      <label for="account-number" class="block text-sm font-medium text-gray-700">Open AI Account Api Key</label>

      <div class="flex mt-1">
        <div class="relative rounded-md shadow-sm w-full mr-2">
          <div class="absolute inset-y-0 right-0 flex items-center px-2">
            <input class="hidden js-password-toggle" id="toggle" type="checkbox" @change="toggleType"/>
            <label
                class="select-none rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                for="toggle">
              <EyeIcon class="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true"/>
            </label>
          </div>
          <input :type="type" name="account-number" id="account-number"
                 v-model="apiKey"
                 class="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 text-sm font-mono tracking-wide"
                 placeholder="sk-000000000000000000000000000000000000000000000000"/>
        </div>

        <div class="bg-gray-50 text-right">
          <button type="submit"
                  @click="setApiKey"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm
                   font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
            Save
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped></style>
