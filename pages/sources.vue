<script lang="ts" setup>
import axios from "axios";
import {useToken} from '~/composables/token';
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const config = useRuntimeConfig()
const token = useToken();

const isLoading = ref<boolean>(false);

const sources = ref<Array<{ id: string, url: string, type: string, _count: { requests: number } }>>([])

async function loadSources() {
  isLoading.value = true;
  const {data} = await axios.get(config.public.apiUrl + '/source', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  isLoading.value = false;
  sources.value = data;
}

onMounted(async () => {
  return loadSources()
})

function addSource() {
  return Swal.fire(
      'Not implemented!',
      `This button will be available soon`,
      'warning'
  );
}

async function request(sourceId: string) {
  console.log("sourceId", sourceId);
  isLoading.value = true;
  const {data} = await axios.post(config.public.apiUrl + '/request', {
    source_id: sourceId
  },{
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });
  isLoading.value = false;
  await Swal.fire(
      'Content Collected!',
      `It took only ${data.time}ms!`,
      'success'
  );

  return loadSources();
}
</script>

<template>
  <div class="min-h-full">
    <NavBar/>

    <loading v-model:active="isLoading"
             :can-cancel="false"
             :is-full-page="true"/>

    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Sources</h1>
              <p class="mt-2 text-sm text-gray-700">RSS that are monitored to download content.</p>
              <!--                    <h1 class="text-xl font-semibold text-gray-900">Users</h1>-->
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button type="button"
                      @click="addSource"
                      class="block rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Add source
              </button>
            </div>
          </div>

        </div>
      </header>
      <main>
        <!--        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">-->
        <!-- Replace with your content -->
        <!--          <div class="px-4 py-8 sm:px-0">-->
        <!--            <div class="h-96 rounded-lg border-4 border-dashed border-gray-200">-->


        <div class="mx-auto max-w-7xl px-6 lg:px-8">

          <div class="mt-8 flow-root">
            <div class="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead>
                  <tr>
                    <th scope="col" class="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Type
                    </th>
                    <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Url</th>
                    <th scope="col" class="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Requests</th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-6 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                  <tr v-for="source in sources" :key="source.email">
                    <td class="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {{ source.type }}
                    </td>
                    <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{{ source.url }}</td>
                    <td class="whitespace-nowrap py-4 px-3 text-sm text-gray-500">{{ source._count.requests }}</td>

                    <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                      <span @click="request(source.id)" class="text-indigo-600 hover:text-indigo-900 cursor-pointer">Request<span
                          class="sr-only">, {{ source.url }}</span></span>
                    </td>

<!--                    TODO -->
<!--                    <td class="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">-->
<!--                      <a href="#" class="text-indigo-600 hover:text-indigo-900">Edit<span-->
<!--                          class="sr-only">, {{ source.url }}</span></a>-->
<!--                    </td>-->
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>


        <!--            </div>-->
        <!--          </div>-->
        <!-- /End replace -->
        <!--        </div>-->
      </main>
    </div>
  </div>
</template>

<style scoped></style>