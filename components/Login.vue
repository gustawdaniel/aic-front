<script lang="ts" setup>
import axios from "axios";
import {useRouter} from "#imports";
import {useToken} from '~/composables/token'
import {useUser} from '~/composables/user'

const config = useRuntimeConfig()
const router = useRouter();

if(process.client) {
  window.googleLoginCallback = (userData) => {
    console.log("ud", userData);
    axios.post(config.public.apiUrl + '/google-verify', {
      credential: userData.credential
    }).then((res) => {
      const token = useToken()
      const user = useUser()

      console.log("pl", res.data);
      token.value = res.data.token;
      console.log("token", token.value);
      user.value = res.data.user;
      router.push('/');
    }).catch(console.error)
  }
}



// console.log("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
</script>

<template>
  <div id="g_id_onload"
       :data-client_id="config.public.googleClientId"
       data-callback="googleLoginCallback"
       data-context="signin"
       data-ux_mode="popup"
       data-auto_select="true"
       data-itp_support="true">
  </div>

  <div class="g_id_signin"
       data-type="standard"
       data-shape="pill"
       data-theme="outline"
       data-text="continue_with"
       data-size="large"
       data-logo_alignment="left">
  </div>
</template>

<style scoped></style>
