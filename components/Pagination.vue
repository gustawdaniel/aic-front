<script lang="ts" setup>
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/vue/20/solid'
import { computed } from "#imports";
import { parseLinkHeader } from "~/composables/parseLinkHeader";
import { ClickableLink } from "~/intefaces/ClickableLink";


const props = defineProps<{
  link: string,
}>()

const headerLinks = computed<{
  first?: {
    rel: 'first',
    url: string,
    page: number
  },
  next?: {
    rel: 'next',
    url: string,
    page: number
  },
  prev?: {
    rel: 'prev',
    url: string,
    page: number
  },
  last?: {
    rel: 'last',
    url: string,
    page: number
  }
}>(() => {
  const links = parseLinkHeader(props.link);
  if (!links) {
    return {}
  }

  Object.keys(links).forEach(key => {
    links[key].page = Number(new URL(links[key].url, `${ window.location.protocol }//${ window.location.host }`).searchParams.get('page'))
  })

  return links;
})

const page = computed<number>(() => {
  return (headerLinks.value.prev?.page ?? 0) + 1
})


const links = computed<Array<ClickableLink>>(() => {
  const pages: Array<ClickableLink> = [];
  pages.push({
    current: true,
    dots: false,
    page: page.value,
    url: '',
  });
  (Object.keys(headerLinks.value) as Array<keyof typeof headerLinks.value>).forEach((key: 'first' | 'next' | 'prev' | 'last') => {
    pages.push({
      current: false,
      dots: false,
      page: headerLinks.value[key]?.page ?? 0,
      url: headerLinks.value[key]?.url ?? ''
    });
  });
  if (headerLinks.value.first && headerLinks.value.prev && headerLinks.value.prev.page - headerLinks.value.first.page > 1) {
    pages.push({
      current: false,
      dots: true,
      page: 0.5 * (headerLinks.value.prev.page + headerLinks.value.first.page),
      url: ''
    });
  }
  if (headerLinks.value.last && headerLinks.value.next && headerLinks.value.last.page - headerLinks.value.next.page > 1) {
    pages.push({
      current: false,
      dots: true,
      page: 0.5 * (headerLinks.value.next.page + headerLinks.value.last.page),
      url: ''
    });
  }

  return pages.sort((a, b) => a.page - b.page)
})

const emit = defineEmits(['setPage']);

function go(link: ClickableLink) {
  if (link.url) {
    emit('setPage', link)
  }
}
</script>

<template>
  <nav class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
    <div class="-mt-px flex w-0 flex-1">
      <a v-if="headerLinks.prev"
         @click="go({dots: false, current: false, url:headerLinks.prev.url, page: headerLinks.prev.page})"
         class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer">
        <ArrowLongLeftIcon class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true"/>
        Previous
      </a>
    </div>
    <div class="hidden md:-mt-px md:flex">

      <component
          :is="link.dots ? 'span' : 'a'" v-for="link in links" @click="go(link)"
          class="inline-flex items-center border-t-2  px-4 pt-4 text-sm font-medium"
          :class="{
            'border-transparent text-gray-500': link.dots,
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer': !link.current && !link.dots,
            'border-indigo-500 text-indigo-600': link.current
           }" :aria-current="link.current ? 'page' : ''">{{ link.dots ? '...' : link.page }}
      </component>
    </div>
    <div class="-mt-px flex w-0 flex-1 justify-end">
      <a v-if="headerLinks.next"
         @click="go({dots: false, current: false, url:headerLinks.next.url, page: headerLinks.next.page})"
         class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer">
        Next
        <ArrowLongRightIcon class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true"/>
      </a>
    </div>
  </nav>
</template>

<style scoped></style>
