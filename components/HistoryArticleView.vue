<script lang="ts" setup>
import { SingleArticle } from "~/intefaces/Article";
import {computed} from "#imports";

const props = defineProps<{article: SingleArticle}>();

const article = computed<SingleArticle>(() => props.article);

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/vue/24/outline'
import RenderedArticleView from "~/components/article/RenderedArticleView.vue";

const versions = computed<Array<{hash: string}>>(() => {
  return article.value.versions.map((version) => {
    return {
      hash: version.hash
    }
  })
});


</script>

<template>

  <div class="bg-white">
    <div class="mx-auto px-6 mt-4">
      <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
        <h2 class="text-2xl font-bold leading-10 tracking-tight text-gray-900">Versions hashes</h2>
        <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
          <Disclosure as="div" v-for="version in versions" :key="version.hash" class="pt-6" v-slot="{ open }">
            <dt>
              <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                <span class="text-base font-semibold leading-7">{{ version.hash }}</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusSmallIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                  <MinusSmallIcon v-else class="h-6 w-6" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
              <p class="text-base leading-7 text-gray-600">
                <HashVersionArticleView :hash="version.hash" :article="article"/>
              </p>
            </DisclosurePanel>
          </Disclosure>
        </dl>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
