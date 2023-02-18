<script lang="ts" setup>
import {useModal, useRouter} from "#imports";

import {useUser} from "~/composables/user";
import {useToken} from "~/composables/token";

const token = useToken()
const user = useUser()

const router = useRouter();

// https://accounts.google.com/gsi/client
useHead({
  script: [{
    async: true,
    src: 'https://accounts.google.com/gsi/client',
    defer: true
  }]
})

onMounted(() => {
  console.log("t", token.value);

})

if (token.value) {
  console.log("token", token.value);
} else {
  console.log("location.href",);

  if (!location.href.endsWith('/login')) {
    location.href = '/login';
  }
}

</script>

<template>
  <div>
    <slot/>

    <ModalFrame/>
  </div>
</template>

<style scoped></style>
