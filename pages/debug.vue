<script lang="ts" setup>
import { setQueue, useQueues } from "~/composables/queues";
import { uid } from "uid";
import axios from "axios";
import { DialogResponse } from "~/intefaces/Gpt3Interface";
import { handleError } from "~/composables/handleError";
import { useToken } from "~/composables/token";

useHead({
  meta: [
    {name: 'robots', content: 'noindex'}
  ]
})

const config = useRuntimeConfig()
const token = useToken();

const queues = useQueues()

async function testQueue() {
    const index = uid();

    setQueue({
        type: 'debug',
        id: index,
        progress: 0
    })

    try {
        await axios.post<DialogResponse, undefined, { id: string, wait: number }>(config.public.apiUrl + '/queue/debug', {
            id: index,
            wait: 2000,
        }, {
            headers: {
                Authorization: `Bearer ${ token.value }`
            }
        });
    } catch (e) {
        handleError(e)
    }
}
</script>

<template>
    <div class="min-h-full">
        <NavBar/>

        <div>
            <button class="btn" @click="testQueue">Button</button>


            <pre>{{ queues }}</pre>
        </div>
    </div>
</template>

<style scoped></style>
