<script lang="ts" setup>
import { useHead } from '#imports';

useHead({
  script: [
    {src: 'https://app-cdn.clickup.com/assets/js/forms-embed/v1.js', async: true}
  ]
});
</script>

<template>
    <div class="flex flex-col h-screen">
        <NavBar/>

        <iframe class="grow clickup-embed clickup-dynamic-height"
                src="https://doc.clickup.com/2153842/d/h/21qbj-2385/e3843cc849f3fd6" onwheel="" width="100%"
                height="100%" style="background: transparent; border: 1px solid #ccc;"></iframe>
    </div>
</template>

<style scoped></style>
