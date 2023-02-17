<script lang="ts" setup>
import Login from "~/components/Login.vue";
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex justify-center flex-col bg-gray-100">
    <!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
    <div class="mx-auto max-w-3xl">
      <div class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
        <div class="px-4 py-5 sm:px-6">
          <h1 class="text-center">Login to AIC</h1>
          <!-- Content goes here -->
          <!-- We use less vertical padding on card headers on desktop than on body sections -->
        </div>
        <client-only>
          <div class="px-4 py-5 sm:p-6">
            <!-- Content goes here -->
            <Login/>
          </div>
        </client-only>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
