<script lang="ts" setup>
import { handleError, useToken } from "#imports";
import axios from "axios";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { User } from "~/intefaces/User";

const users = ref<User[]>([]);
const isLoading = ref<boolean>(false);
const config = useRuntimeConfig()
const token = useToken();

async function loadUsers() {
  try {
    isLoading.value = true;
    const {data} = await axios.get(config.public.apiUrl + '/user', {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    users.value = data;
  } catch (e) {
    handleError(e)
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

    const prevToken = useCookie<string>('prevToken');
    prevToken.value = token.value ?? '';
    const prevUser = useCookie<{ email: string; avatar: string; full_name: string; }>('prevUser');
    prevUser.value = user.value ?? {email: '', avatar: '', full_name: ''};

    const {data} = await axios.post(config.public.apiUrl + '/impersonate', {id: userId}, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    })

    token.value = data.token;
    user.value = data.user;

    location.reload();
  } catch (e) {
    handleError(e)
  } finally {
    isLoading.value = false;

  }
}

const roles = ["admin", "hacker", "pro"];

import { useToast } from "vue-toastification";


async function changeRole(userId: string, role: string, checked: boolean, name: string) {
  try {
    await axios.post(config.public.apiUrl + `/user/role`, {id: userId, role, checked}, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });
    useToast().success(`Role ${ role } ${ checked ? 'added' : 'removed' } for ${ name }`);
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="true"/>

<!--    <pre class="break-words whitespace-pre-wrap bg-gray-100 text-gray-900 p-4 rounded-lg shadow-lg"><code-->
<!--            class="text-sm font-mono">{{ token }}</code></pre>-->

    <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        <li v-for="person in users" :key="person.email"
            class="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
            <div class="flex w-full items-center justify-between space-x-6 p-6">
                <div class="flex-1 truncate">
                    <div class="flex items-center space-x-3">
                        <h3 class="truncate text-sm font-medium text-gray-900">{{ person.full_name }}</h3>
                        <span
                                class="inline-block flex-shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                                v-for="role in person.roles" :key="role">{{ role }}</span>
                    </div>
                    <p class="mt-1 truncate text-sm text-gray-500">{{ person.email }}</p>
                </div>
                <img class="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" :src="person.avatar" alt=""/>
            </div>
            <div class="flex justify-between items-center">
                <div v-for="role in roles" :key="role">
                    <label class="cursor-pointer">
                        <input type="checkbox"
                               :checked="person.roles.includes(role)"
                               @change="changeRole(person.id, role, $event.target.checked, person.full_name)"
                               class="m-1"
                        />
                        {{ role }}
                    </label>
                </div>
            </div>
            <div>
                <div class="-mt-px flex divide-x divide-gray-200">
                    <div class="flex w-0 flex-1">
                        <button @click="impersonate(person.id)"
                                class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
                            <KeyIcon class="h-5 w-5 text-gray-400" aria-hidden="true"/>
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

    <div class="mx-4 mt-4">
        <router-link to="/errors" type="button"
                     class="rounded bg-red-800 px-2 w-full py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800">
            Errors
        </router-link>
    </div>

</template>

<style scoped></style>
