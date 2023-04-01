<script lang="ts" setup>
import {
  deleteGpt3Prompts, getGpt3Prompts, handleError, setGpt3Prompt, useGpt3Prompts,
  useSelectedGpt3Prompts
} from "#imports";

const prompts = useGpt3Prompts()
const selectedPrompt = useSelectedGpt3Prompts()

const id = ref<string>("");
const value = ref<string>("");

async function save() {
  await setGpt3Prompt({
    id: id.value,
    value: value.value
  });
  promptCreationMode.value = false;
  value.value = '';
}

async function remove(ctx: { id: string, value: string }): Promise<void> {
  await deleteGpt3Prompts(ctx);

  if (selectedPrompt.value?.id === ctx.id) {
    selectedPrompt.value = undefined;
  }
}

async function edit(ctx: { id: string, value: string }): Promise<void> {
  await setGpt3Prompt(ctx);
}

onMounted(async () => {
  try {
    await getGpt3Prompts()
  } catch (e) {
    handleError(e)
  }
})

const promptCreationMode = ref<boolean>(true);

function openPromptCreationDialog() {
  promptCreationMode.value = true;
}

function closePromptCreationDialog() {
  promptCreationMode.value = false;
}

function select(ctx: { id: string, value: string }) {
  console.log("select", ctx);
  selectedPrompt.value = ctx;
}

</script>

<template>
  <div>

    <div>
      <div :key="prompt[0]" v-for="prompt in prompts">
        <EditableTag
            v-model="prompt[1].value"
            :active="selectedPrompt?.id === prompt[1].id"
            @select="select(prompt[1])"
            @unselect="select(undefined)"
            @remove="remove(prompt[1])"
            @save="edit(prompt[1])"
        />
      </div>
    </div>

    <div v-if="promptCreationMode">
      <label class="sr-only">Prompt</label>
      <input type="text"
             @keyup.enter="save"
             @keyup.esc="closePromptCreationDialog"
             v-model="value"
             class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
             placeholder="Prompt processing sentence"/>
    </div>


    <div class="mt-2 grid grid-cols-2 gap-2">
      <button type="button"
              v-if="!promptCreationMode"
              @click="openPromptCreationDialog"
              class="col-span-2 relative text-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Create new prompt
      </button>
      <button type="button"
              v-else-if="promptCreationMode"
              @click="save"
              class="relative text-center  mr-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
        Save prompt
      </button>
      <button type="button"
              v-if="promptCreationMode"
              @click="closePromptCreationDialog"
              class="relative text-center  rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
        Cancel
      </button>

    </div>

  </div>
</template>

<style scoped></style>
