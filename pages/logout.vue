<script lang="ts" setup>

import {useToken} from "~/composables/token";
import {useUser} from "~/composables/user";
import {useRouter} from "#app";

const token = useToken();
const user = useUser();
const router = useRouter();

onMounted(() => {
  token.value = '';
  user.value = '';
  console.log("window.google", window.google);
  // window.google.accounts.id.disableAutoSelect();
  location.href = '/login';
})

</script>

<template>
  <div>
    Logging out...
  </div>
</template>

<style scoped></style>
