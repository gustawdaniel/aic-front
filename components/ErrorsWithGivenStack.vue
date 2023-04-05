<script lang="ts" setup>
import axios from "axios";
const config = useRuntimeConfig();
const token = useToken();
const errors = ref<any[]>([]);

const props = defineProps<{ stack: string }>();


async function getErrorsUsingAxios() {
  try {
    const {data} = await axios.get(config.public.apiUrl + `/errors?` + (new URLSearchParams({stack: props.stack})).toString(), {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    errors.value = data;
  } catch (error) {
    handleError(error)
  }
}

onMounted(() => {
  getErrorsUsingAxios();
});

</script>

<template>
  <div>
    <pre>{{errors}}</pre>
  </div>
</template>

<style scoped></style>
