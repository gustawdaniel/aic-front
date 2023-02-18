<script lang="ts" setup>
import {useToken} from "#imports";
import axios from "axios";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import {User} from "~/intefaces/User";
import Swal from "sweetalert2";

const users = ref<User[]>([]);
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();

function getMessage(e: unknown) {
  if (e instanceof Error) {
    return e.message
  } else {
    return `unknown error`
  }
}

async function loadUsers() {
  try {
    isLoading.value = true;
    const {data} = await axios.get(config.public.apiUrl + '/user', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    users.value = data;
  } catch (e) {
    Swal.fire(
        'Error!',
        getMessage(e),
        'error'
    );
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadUsers();
})

import { KeyIcon } from '@heroicons/vue/20/solid'

const user = useUser();

async function impersonate(userId: string) {
  try {
    isLoading.value = true;

    const prevToken = useCookie('prevToken');
    prevToken.value = token.value;
    const prevUser = useCookie('prevUser');
    prevUser.value = user.value;

    const {data} = await axios.post(config.public.apiUrl + '/impersonate', {id: userId}, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    token.value = data.token;
    user.value = data.user;

    location.reload();
  } catch (e) {
    Swal.fire(
        'Error!',
        getMessage(e),
        'error'
    );
  } finally {
    isLoading.value = false;

  }
}
</script>

<template>
  <loading v-model:active="isLoading"
           :can-cancel="false"
           :is-full-page="true"/>

  <pre class="break-words whitespace-pre-wrap bg-gray-100 text-gray-900 p-4 rounded-lg shadow-lg"><code
      class="text-sm font-mono">{{ token }}</code></pre>

  <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
    <li v-for="person in users" :key="person.email" class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
      <div class="flex w-full items-center justify-between space-x-6 p-6">
        <div class="flex-1 truncate">
          <div class="flex items-center space-x-3">
            <h3 class="truncate text-sm font-medium text-gray-900">{{ person.full_name }}</h3>
            <span class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800" v-for="role in person.roles" :key="role">{{ role }}</span>
          </div>
          <p class="mt-1 truncate text-sm text-gray-500">{{ person.email }}</p>
        </div>
        <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" :src="person.avatar" alt="" />
      </div>
      <div>
        <div class="-mt-px flex divide-x divide-gray-200">
          <div class="flex w-0 flex-1">
            <button @click="impersonate(person.id)" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
              <KeyIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span class="ml-3">Impersonate</span>
            </button>
          </div>
<!--          <div class="-ml-px flex w-0 flex-1">-->
<!--            <a :href="`tel:${person.telephone}`" class="relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">-->
<!--              <PhoneIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />-->
<!--              <span class="ml-3">Call</span>-->
<!--            </a>-->
<!--          </div>-->
        </div>
      </div>
    </li>
  </ul>

<!--  <pre>{{ users }}</pre>-->
</template>

<style scoped></style>
