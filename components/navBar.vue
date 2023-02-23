<script lang="ts" setup>
import {Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import {Bars3Icon, BellIcon, XMarkIcon, MagnifyingGlassIcon} from '@heroicons/vue/24/outline'
import {useUser} from "~/composables/user";
import {useToken} from "~/composables/token";
import {useRoute, useSearch} from "#imports";

const token = useToken()
const user = useUser()

const route = useRoute()

console.log("route", route.path);

const navigation = [
  {name: 'Dashboard', href: '/', current: route.path === '/'},
  {name: 'Sources', href: '/sources', current: route.path === '/sources'},
  {name: 'Targets', href: '/targets', current: route.path === '/targets'},
  {name: 'Articles', href: '/articles', current: route.path === '/articles'},
]
const userNavigation = [
  {name: 'Your Profile', href: '/profile'},
  {name: 'Settings', href: '/settings'},
  {name: 'Sign out', href: '/logout'},
]

window.HW_config = {
  selector: ".hw", // CSS selector where to inject the badge
  account: "xGGP6x"
}

useHead({
  script: [{
    async: true,
    src: 'https://cdn.headwayapp.co/widget.js'
  }]
})

const serach = useSearch();
</script>

<template>
  <Disclosure as="nav" class="border-b border-gray-200 bg-white" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="flex flex-shrink-0 items-center">
            <img class="block h-8 w-auto lg:hidden"
                 src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
            <img class="hidden h-8 w-auto lg:block"
                 src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/>
          </div>
          <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
            <nuxt-link v-for="item in navigation" :key="item.name" :to="item.href"
                       :class="[item.current ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium']"
                       :aria-current="item.current ? 'page' : undefined">{{ item.name }}
            </nuxt-link>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div class="hw"></div>

          <div class="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end" v-show="serach.enabled">
            <div class="w-full max-w-lg lg:max-w-xs">
              <label for="search" class="sr-only">Search</label>
              <div class="relative text-gray-400 focus-within:text-gray-600 ">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
                  <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true"/>
                </div>
                <input id="search"
                       v-model="serach.text"
                       class="block w-full rounded-md border border-transparent bg-white py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 focus:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:text-sm"
                       placeholder="Search" type="search" name="search"/>
              </div>
            </div>
          </div>

          <button type="button"
                  class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true"/>
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                  class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span class="sr-only">Open user menu</span>
                <img class="h-8 w-8 rounded-full" :src="user.avatar" alt=""/>
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                  class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <nuxt-link :to="item.href"
                             :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">{{
                      item.name
                    }}
                  </nuxt-link>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
              class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true"/>
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true"/>
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 pt-2 pb-3">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href"
                          :class="[item.current ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800', 'block pl-3 pr-4 py-2 border-l-4 text-base font-medium']"
                          :aria-current="item.current ? 'page' : undefined">{{ item.name }}
        </DisclosureButton>
      </div>
      <div class="border-t border-gray-200 pt-4 pb-3">
        <div class="flex items-center px-4">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" :src="user.avatar" alt=""/>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-gray-800">{{ user.full_name }}</div>
            <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
          </div>


          <button type="button"
                  class="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true"/>
          </button>
        </div>
        <div class="mt-3 space-y-1">
          <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href"
                            class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            {{ item.name }}
          </DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<style scoped></style>
