<script lang="ts" setup>
import axios from "axios";
import { useModal } from "~/composables/modal";
import { ErrorsWithGivenStack } from "#components";
import { TrashIcon } from '@heroicons/vue/20/solid'

const config = useRuntimeConfig();
const token = useToken();
const errorTypes = ref<{
  "_count": {
    "_all": 7
  },
  "stack": string
}[]>([]);

async function getErrorTypesUsingAxios() {
  try {
    const {data} = await axios.get(config.public.apiUrl + '/errors-types', {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    errorTypes.value = data;
  } catch (error) {
    handleError(error)
  }
}

async function removeErrorsByStack(stack: string) {
  try {
    const {data} = await axios.delete(config.public.apiUrl + '/errors?' + (new URLSearchParams({stack})).toString(), {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    errorTypes.value = errorTypes.value.filter(type => type.stack !== stack);

  }catch (error) {
    handleError(error)
  }
}


onMounted(() => {
  getErrorTypesUsingAxios();
});

function openStackModal(stack: string) {
  const modal = useModal();
  modal.value.settings = {
    fullWidth: true
  }
  modal.value.context = {
    stack
  }
  modal.value.component = ErrorsWithGivenStack;
}

</script>

<template>
  <div class="min-h-full">
    <NavBar/>

    <article>

      <section v-for="type of errorTypes">
        <div class="bg-gray-900 rounded-md p-4 m-2 relative">
          <pre class="text-gray-400 font-mono">{{ type.stack }}</pre>

          <button @click="openStackModal(type.stack)"
                  class="absolute top-2 right-2 p-2 bg-blue-900 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-indigo-400" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
            </svg>
          </button>

          <button @click="removeErrorsByStack(type.stack)"
                  class="absolute top-10 right-2 p-2 bg-red-900 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            <TrashIcon class="h-3 w-3 text-white"/>
          </button>

          <button
              class="absolute bottom-2 text-white font-bold right-2 px-2 bg-blue-900 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ type._count._all }}
          </button>


        </div>
      </section>

    </article>

  </div>
</template>

<style scoped></style>
