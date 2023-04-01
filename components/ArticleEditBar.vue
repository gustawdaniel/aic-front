<script lang="ts" setup>

import {
  useSelectedGpt3Prompts,
  useSelectedArticleComponent,
  useSelectedGpt3Contexts,
  askGpt3,
  computed, selectArticleComponent, syncArticle, handleError
} from "#imports";
import { Gpt3Message } from "~/intefaces/Gpt3Interface";
import Swal from "sweetalert2";
import { useSelectedArticle } from "~/composables/articles";

const prompt = useSelectedGpt3Prompts();
const context = useSelectedGpt3Contexts();
const selectedArticleComponent = useSelectedArticleComponent();

const inputText = ref<string>('');
const answerText = ref<string>('');

const actionsDisabled = computed<boolean>(() => {
  return !selectedArticleComponent.value
})

async function askGpt(prompt: string, text: string) {
  const messages: Gpt3Message[] = [];
  if (context.value && context.value.value) {
    messages.push({
      role: 'system',
      content: context.value.value
    })
  }
  messages.push({
    role: 'user',
    content: prompt + '\n\n' + text
  })

  answerText.value = 'Loading...'

  const interval = setInterval(() => {
    answerText.value = answerText.value + '.'
  }, 100)

  try {
    const data = await askGpt3(messages)

    clearInterval(interval);

    answerText.value = data.message.content
  } catch (e) {
    handleError(e)
  }
}

watch(selectedArticleComponent, (n) => {
  if (n) {
    inputText.value = n.component.text
    if (inputText.value && prompt.value && prompt.value.value) {
      askGpt(prompt.value.value, inputText.value)
    }
  } else {
    inputText.value = '';
  }
})

watch(prompt, (n) => {
  if (n) {
    console.log(n.value);
    if (n.value && inputText.value) {
      askGpt(n.value, inputText.value);
    }
  }
})

watch(context, () => {
  if (inputText.value && prompt.value && prompt.value.value) {
    askGpt(prompt.value.value, inputText.value)
  }
})

const article = useSelectedArticle();

function prepend() {
  if (!article.value || !selectedArticleComponent.value) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }

  article.value.components.splice(selectedArticleComponent.value.index, 0, {
    text: answerText.value,
    finish_reason: 'stop',
    xpath: ['p']
  })
}

function replace() {
  if (!article.value || !selectedArticleComponent.value) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }
  article.value.components[selectedArticleComponent.value.index] = {
    text: answerText.value,
    finish_reason: 'stop',
    xpath: ['p']
  }
}

function append() {
  if (!article.value || !selectedArticleComponent.value) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }
  article.value.components.splice(selectedArticleComponent.value.index + 1, 0, {
    text: answerText.value,
    finish_reason: 'stop',
    xpath: ['p']
  })
}

async function save() {
  try {
    await syncArticle()
    return Swal.fire('Article saved!', `Ok!`, 'success')
  } catch (e) {
    return Swal.fire('Error occurred!', getMessage(e), 'error')
  }
}
</script>

<template>
  <div>
    <Gpt3PromptManager/>

    <div class="mt-2">
      <textarea class="w-full" v-model="inputText"/>
      <textarea class="w-full" v-model="answerText"/>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <button :disabled="actionsDisabled" class="btn" @click="prepend">Prepend</button>
      <button :disabled="actionsDisabled" class="btn" @click="replace">Replace</button>
      <button :disabled="actionsDisabled" class="btn" @click="append">Append</button>
    </div>

    <button :disabled="actionsDisabled" class="btn w-full mt-1" @click="save">Save Article</button>
  </div>
</template>

<style scoped></style>
