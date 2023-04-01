import axios from "axios";
import {useToken} from "~/composables/token";
import {handleError} from "~/composables/handleError";
import {IdValue} from "~/intefaces/IdValue";

interface Gpt3Context extends IdValue {}

export const useSelectedGpt3Contexts = () => {
  return useState<Gpt3Context | undefined>('selected-gpt3-context', () => undefined)
}

export const useGpt3Contexts = () => {
  return useState<Map<string, Gpt3Context>>('gpt3-contexts', () => new Map())
}

export async function setGpt3Context(context: Gpt3Context): Promise<Gpt3Context | undefined> {
  const config = useRuntimeConfig()
  const token = useToken();

  try {
    const {data} = await axios.put<Gpt3Context>(config.public.apiUrl + '/context', context, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    const state = useGpt3Contexts();
    state.value.set(data.id, data);

    return context;
  } catch (error) {
    handleError(error)
  }
}

export async function deleteGpt3Contexts(context: Gpt3Context): Promise<void> {
  if(!context.id) return ;

  const config = useRuntimeConfig()
  const token = useToken();

  const {data} = await axios.delete<Gpt3Context>(config.public.apiUrl + '/context/' + context.id,{
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  const state = useGpt3Contexts();
  state.value.delete(data.id);

  return undefined
}

export async function getGpt3Contexts(): Promise<Gpt3Context[]> {
  const config = useRuntimeConfig()
  const token = useToken();

  const {data} = await axios.get<Gpt3Context[]>(config.public.apiUrl + '/context', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  });

  const state = useGpt3Contexts();
  data.forEach((ctx) => {
    state.value.set(ctx.id, ctx);
  });

  return data
}

