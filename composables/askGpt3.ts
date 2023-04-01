import axios, { AxiosResponse } from "axios";
import { DialogResponse, Gpt3Message } from "~/intefaces/Gpt3Interface";
import { useToken } from "~/composables/token";

export const askGpt3 = async (messages: Gpt3Message[]): Promise<DialogResponse> => {
  const config = useRuntimeConfig()
  const token = useToken();

  const {data} = await axios.post<DialogResponse, AxiosResponse<DialogResponse>, { messages: Gpt3Message[] }>(config.public.apiUrl + '/ask', {
    messages
  }, {
    headers: {
      Authorization: `Bearer ${ token.value }`
    }
  });

  return data;

}
