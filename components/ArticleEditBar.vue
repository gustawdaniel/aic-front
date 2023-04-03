<script lang="ts" setup>

import {
  useSelectedGpt3Prompts,
  useSelectedArticleComponents,
  useSelectedGpt3Contexts,
  askGpt3,
  computed, syncArticle, handleError
} from "#imports";
import { Gpt3Message } from "~/intefaces/Gpt3Interface";
import Swal from "sweetalert2";
import { useSelectedArticle } from "~/composables/articles";
import { ArticleComponent } from "~/intefaces/Article";
import { useArticleComponentsAnswers } from "~/composables/articleComponent";
import { uid } from "uid";

const prompt = useSelectedGpt3Prompts();
const context = useSelectedGpt3Contexts();
const queuedArticleComponents = ref<Map<string, ArticleComponent>>(new Map());
const selectedArticleComponents = useSelectedArticleComponents();
const answers = useArticleComponentsAnswers()

const actionsDisabled = computed<boolean>(() => {
  return !Boolean(selectedArticleComponents.value.size)
})

async function askGpt(componentId: string, prompt: string, text: string) {
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

  answers.value.set(componentId, {id: '', finish_reason: '', message: {role: 'system', content: 'Loading...'}});

  const interval = setInterval(() => {
    answers.value.set(componentId, {
      id: '',
      finish_reason: '',
      message: {role: 'system', content: answers.value.get(componentId)?.message.content + '.'}
    })
  }, 100)

  try {
    const data = await askGpt3(messages)

    clearInterval(interval);

    answers.value.set(componentId, data)
  } catch (e) {
    handleError(e)
  }
}

watch(selectedArticleComponents, (n) => {
  const added = [...n.entries()].filter(([k, v]) => !queuedArticleComponents.value.has(k));
  const removed = [...queuedArticleComponents.value.entries()].filter(([k, v]) => !n.has(k));

  for (const [k, v] of added) {
    queuedArticleComponents.value.set(k, v);
    console.log("added", k, v, v.text, prompt.value, prompt.value?.value);
    if (v.text && prompt.value && prompt.value.value) {
      askGpt(k, prompt.value.value, v.text)
    }
  }

  for (const [k, v] of removed) {
    queuedArticleComponents.value.delete(k);
    answers.value.delete(k)
  }
}, {
  deep: true
})

watch(prompt, (n) => {
  if (n) {
    console.log(n.value);
    for (const [k, v] of selectedArticleComponents.value.entries()) {
      if (v.text) {
        askGpt(k, n.value, v.text)
      }
    }
  }
})

watch(context, () => {
  for (const [k, v] of selectedArticleComponents.value.entries()) {
    if (v.text && prompt.value && prompt.value.value) {
      askGpt(k, prompt.value.value, v.text)
    }
  }
})

const article = useSelectedArticle();

function prepend() {
  if (!article.value || !selectedArticleComponents.value.size) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }

  for (const [k, v] of selectedArticleComponents.value.entries()) {
    const index = article.value.components.findIndex((x) => x.id === k);
    article.value.components.splice(index, 0, {
      id: uid(),
      text: answers.value.get(k)?.message.content ?? '',
      finish_reason: 'stop',
      xpath: ['p'],
      ai_requests: [...v.ai_requests, answers.value.get(k)?.id].filter((x: string | undefined): x is string => Boolean(x))
    })
  }
}

function replace() {
  if (!article.value || !selectedArticleComponents.value.size) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }
  for (const [k, v] of selectedArticleComponents.value.entries()) {
    const index = article.value.components.findIndex((x) => x.id === k);
    article.value.components[index] = {
      id: uid(),
      text: answers.value.get(k)?.message.content ?? '',
      finish_reason: 'stop',
      xpath: ['p'],
      ai_requests: [...v.ai_requests, answers.value.get(k)?.id].filter((x: string | undefined): x is string => Boolean(x))
    }
  }
}

function append() {
  if (!article.value || !selectedArticleComponents.value.size) {
    return Swal.fire('Select component!', `You have to click on article and select component!`, 'info')
  }
  for (const [k, v] of selectedArticleComponents.value.entries()) {
    const index = article.value.components.findIndex((x) => x.id === k);
    article.value.components.splice(index + 1, 0, {
      id: uid(),
      text: answers.value.get(k)?.message.content ?? '',
      finish_reason: 'stop',
      xpath: ['p'],
      ai_requests: [...v.ai_requests, answers.value.get(k)?.id].filter((x: string | undefined): x is string => Boolean(x))
    })
  }
}

async function save() {
  try {
    await syncArticle()
    return Swal.fire('Article saved!', `Ok!`, 'success')
  } catch (e) {
    return Swal.fire('Error occurred!', getMessage(e), 'error')
  }
}

function selectAllComponents() {
  for (const component of article.value?.components ?? []) {
    selectedArticleComponents.value.set(component.id, component)
  }
}

function deselectAllComponents() {
  selectedArticleComponents.value.clear()
}
</script>

<template>
  <div>
    <Gpt3PromptManager/>

    <button class="btn w-full my-1" @click="selectAllComponents">Select All</button>
    <button class="btn w-full my-1" @click="deselectAllComponents">Deselect All</button>

    <div class="grid grid-cols-3 gap-2">
      <button :disabled="actionsDisabled" class="btn" @click="prepend">Prepend</button>
      <button :disabled="actionsDisabled" class="btn" @click="replace">Replace</button>
      <button :disabled="actionsDisabled" class="btn" @click="append">Append</button>
    </div>

    <button :disabled="actionsDisabled" class="btn w-full mt-1" @click="save">Save Article</button>
  </div>
</template>

<style scoped></style>
