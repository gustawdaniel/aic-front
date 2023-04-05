<script lang="ts" setup>
const messages = [
  {
    id: 1,
    subject: 'Its your happy day, because you are in the right place',
    sender: 'Daniel Gustaw',
    datetime: '05-04-2023',
    preview: 'This is easter egg page with code: "IMPLEMENT_NOTIFICATION" that allow for you to get free 10 publications. Write email to gustaw.daniel@gmail.com with this code to get this gift',
  },
  // More messages...
]
</script>

<template>
  <div class="min-h-full">
    <NavBar/>
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="message in messages" :key="message.id"
          class="relative bg-white px-4 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50">
        <div class="flex justify-between space-x-3">
          <div class="min-w-0 flex-1">
            <a href="#" class="block focus:outline-none">
              <span class="absolute inset-0" aria-hidden="true"/>
              <p class="truncate text-sm font-medium text-gray-900">{{ message.sender }}</p>
              <p class="truncate text-sm text-gray-500">{{ message.subject }}</p>
            </a>
          </div>
          <time :datetime="message.datetime" class="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
            {{ message.time }}
          </time>
        </div>
        <div class="mt-1">
          <p class="line-clamp-2 text-sm text-gray-600">{{ message.preview }}</p>
        </div>
      </li>
    </ul>

  </div>

</template>

<style scoped></style>
