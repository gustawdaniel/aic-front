<script lang="ts" setup>

import {useUser} from "~/composables/user";
import {useToken} from "#imports";

const user = useUser();
</script>

<template>
  <div class="min-h-full">
    <NavBar/>

    <div class="py-10">
      <!--      <header>-->
      <!--        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">-->
      <!--          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Profile</h1>-->
      <!--        </div>-->
      <!--      </header>-->
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div class="bg-white p-6">
            <div class="sm:flex sm:items-center sm:justify-between">
              <div class="sm:flex sm:space-x-5">
                <div class="flex-shrink-0">
                  <img class="mx-auto h-20 w-20 rounded-full" :src="user.avatar" alt=""/>
                </div>
                <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p class="text-sm font-medium text-gray-600">Nice to see you:</p>
                  <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ user.full_name }}</p>
                  <p class="text-sm font-medium text-gray-600">{{ user.email }}</p>
                </div>
              </div>

              <div v-if="user.roles && user.roles.includes('admin')" class="mt-5 flex justify-center sm:mt-0">
                <span
                    class="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                  Admin
                </span>
              </div>
            </div>

            <ApiKeyInput class="mt-6"/>

            <AccessToken/>

<!--            <p>User ID: {{user.id}}</p>-->

          </div>


          <AdminPanel v-if="user.roles && user.roles.includes('admin')"/>



        </div>
      </main>
    </div>
  </div>
</template>

<style scoped></style>
