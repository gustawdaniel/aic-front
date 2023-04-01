<script lang="ts" setup>

import {logout} from "~/composables/logout";

onMounted(() => {
  logout()
})
</script>

<template>
  <div>
    Logging out...
  </div>
</template>

<style scoped></style>
