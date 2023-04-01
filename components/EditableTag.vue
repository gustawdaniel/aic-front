<script lang="ts" setup>
const props = defineProps<{
  modelValue: string,
  active: boolean,
}>();

const emit = defineEmits(['update:modelValue', 'remove', 'unselect', 'select', 'save'])

const value = computed<string>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const editable = ref<boolean>(false);

import {TrashIcon, PencilIcon, CheckIcon} from '@heroicons/vue/20/solid'
</script>

<template>
  <div class="flex rounded-md shadow-sm m-1 rounded-md cursor-pointer border"
       :class="{ 'border-indigo-600': props.active, 'border-gray-200': !props.active }"
       :title="value">
    <div class="relative flex flex-grow items-stretch focus-within:z-10" @click="emit(props.active ? 'unselect' : 'select')">
      <input
          :disabled="!editable" type="text" v-model="value"
          class="block w-full rounded-none rounded-l-md border-0 py-1.5 w-full text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
      />
    </div>
    <button v-if="!editable" @click="editable = true" type="button"
            class="relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
      <PencilIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
    </button>
    <button v-else-if="editable" @click="editable = false; emit('save')" type="button"
            class="relative -ml-px inline-flex items-center gap-x-1.5 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
      <CheckIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
    </button>
    <button @click="emit('remove')" type="button"
            class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
      <TrashIcon class="-ml-0.5 h-4 w-4 text-gray-400" aria-hidden="true"/>
    </button>
  </div>
</template>

<style scoped></style>
