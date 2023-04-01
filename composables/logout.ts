import {useToken} from "~/composables/token";
import {useUser} from "~/composables/user";
import {useRouter} from "#app";

const token = useToken();
const user = useUser();
const router = useRouter();

export const logout = () => {
  token.value = '';
  user.value = null;
  // @ts-ignore
  console.log("window.google", window.google);
  // window.google.accounts.id.disableAutoSelect();
  location.href = '/login';
}
