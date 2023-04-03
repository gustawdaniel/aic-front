import axios from "axios";
import { useToken } from "~/composables/token";
import { handleError } from "~/composables/handleError";
import { IdValue } from "~/intefaces/IdValue";

interface Gpt3Prompt extends IdValue {
}

export const useSelectedGpt3Prompts = () => {
  return useState<Gpt3Prompt | undefined>('selected-gpt3-prompt', () => undefined)
}


export const useGpt3Prompts = () => {
  return useState<Map<string, Gpt3Prompt>>('gpt3-prompts', () => new Map())
}

export async function setGpt3Prompt(prompt: Gpt3Prompt): Promise<Gpt3Prompt | undefined> {
  const config = useRuntimeConfig()
  const token = useToken();

  try {
    const {data} = await axios.put<Gpt3Prompt>(config.public.apiUrl + '/prompt', prompt, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    const state = useGpt3Prompts();
    state.value.set(data.id, data);

    return prompt;
  } catch (error) {
    handleError(error)
  }
}

export async function deleteGpt3Prompts(prompt: Gpt3Prompt): Promise<void> {
  if (!prompt.id) return;

  const config = useRuntimeConfig()
  const token = useToken();
  try {
    const {data} = await axios.delete<Gpt3Prompt>(config.public.apiUrl + '/prompt/' + prompt.id, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    const state = useGpt3Prompts();
    state.value.delete(data.id);
  } catch (error) {
    handleError(error)
  }

  return undefined
}

export async function getGpt3Prompts(): Promise<Gpt3Prompt[] | undefined> {
  const config = useRuntimeConfig()
  const token = useToken();
  try {
    const {data} = await axios.get<Gpt3Prompt[]>(config.public.apiUrl + '/prompt', {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    const state = useGpt3Prompts();
    data.forEach((ctx) => {
      state.value.set(ctx.id, ctx);
    });
    return data
  } catch (error) {
    handleError(error)
  }
}

