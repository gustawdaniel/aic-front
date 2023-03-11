<script lang="ts" setup>

import {deleteGpt3Contexts, getGpt3Contexts, setGpt3Context, useGpt3Contexts} from "#imports";

const contexts = useGpt3Contexts()
const selectedContext = useSelectedGpt3Contexts()

const id = ref<string>("");
const value = ref<string>("");

async function save() {
  await setGpt3Context({
    id: id.value,
    value: value.value
  });
  contextCreationMode.value = false;
  value.value = '';
}

async function remove(ctx: { id: string, value: string }): Promise<void> {
  await deleteGpt3Contexts(ctx);

  if(selectedContext.value?.id === ctx.id) {
    selectedContext.value = undefined;
  }
}

async function edit(ctx: { id: string, value: string }): Promise<void> {
  await setGpt3Context(ctx);
}

onMounted(() => {
  getGpt3Contexts()
})

const contextCreationMode = ref<boolean>(false);

function openContextCreationDialog() {
  contextCreationMode.value = true;
}

function closeContextCreationDialog() {
  contextCreationMode.value = false;
}

function select(ctx: { id: string, value: string }) {
  console.log("select", ctx);
  selectedContext.value = ctx;
}

import {TrashIcon, PencilIcon, CheckIcon} from '@heroicons/vue/20/solid'
import {useSelectedGpt3Contexts} from "~/composables/gpt3Contexts";

</script>

<template>
  <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
    <div class="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
      <div class="ml-4 mt-4 w-full" v-if="contextCreationMode">
        <div>
          <label for="email" class="sr-only">Email</label>
          <input type="text"
                 @keyup.enter="save"
                 @keyup.esc="closeContextCreationDialog"
                 v-model="value"
                 class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 placeholder="Context explain GPT3 how to behave. Eg.: I am helpful assistant."/>
        </div>
      </div>
      <div class="ml-4 mt-4" v-else-if="!contextCreationMode">
        <div class="flex flex-wrap">
          <div :key="context[0]" v-for="context of Array.from(contexts.entries())">

            <div class="flex rounded-md shadow-sm m-1 rounded-md cursor-pointer"
                 :class="{
                   'border border-indigo-600': selectedContext?.id === context[1].id,
                   'border border-gray-200': selectedContext?.id !== context[1].id
                 }"
                 :title="context[1].value">
              <div class="relative flex flex-grow items-stretch focus-within:z-10" @click="select(context[1])">
                <input
                    :disabled="!context[1].editable"
                    type="text"
                    v-model="context[1].value"
                    class="block w-full rounded-none rounded-l-md border-0 py-1.5 w-full text-gray-900 placeholder:text-gray-400
                       sm:text-sm sm:leading-6"
                />
              </div>
              <button v-if="!context[1].editable" @click="context[1].editable = true" type="button"
                      class="relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                <PencilIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
              </button>
              <button v-else-if="context[1].editable" @click="edit(context[1])" type="button"
                      class="relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                <CheckIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
              </button>
              <button @click="remove(context[1])" type="button"
                      class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
                <TrashIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
              </button>
            </div>

          </div>
        </div>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0">
        <button type="button"
                v-if="!contextCreationMode"
                @click="openContextCreationDialog"
                class="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Create new context
        </button>
        <button type="button"
                v-else-if="contextCreationMode"
                @click="save"
                class="relative inline-flex items-center mr-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Save context
        </button>
        <button type="button"
                v-if="contextCreationMode"
                @click="closeContextCreationDialog"
                class="relative inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
          Cancel
        </button>

      </div>
    </div>
  </div>

</template>

<style scoped></style>
