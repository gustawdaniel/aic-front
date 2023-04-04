import { Gpt3Message } from "~/intefaces/Gpt3Interface";
import axios from "axios";
import { useToken } from "~/composables/token";
import { useSelectedArticle } from "#imports";

export const useAiRequestCache = () => {
  return useState<Map<string, Gpt3Message[]>>('ai-request-cache', () => new Map())
}

export async function syncAiRequestCache(keys: string[]) {
  const cache = useAiRequestCache();

  const config = useRuntimeConfig()
  const token = useToken();

  const notExisingKeys = keys.filter(key => !cache.value.has(key));

  let params = new URLSearchParams();
  notExisingKeys.forEach(key => {
    cache.value.set(key, []);
    params.append('ids', key)
  });
  console.log(params.toString());

  if (params.toString().length) {

    const {data} = await axios.get<[string, Gpt3Message[]][]>(config.public.apiUrl + `/ai-request?${ params.toString() }`, {
      headers: {
        Authorization: `Bearer ${ token.value }`
      }
    });

    for (const [key, value] of data) {
      cache.value.set(key, value);
    }
  }
}


export function getHistoricMessagesForComponentUsingCache(id: string): Gpt3Message[] {
  const article = useSelectedArticle();
  const cache = useAiRequestCache();
  const messages: Gpt3Message[] = [];

  if (article.value) {
    const articleComponent = article.value.components.find(c => c.id === id);

    if (articleComponent) {
      for (const id of articleComponent.ai_requests) {
        const cachedMessages = cache.value.get(id);
        if (cachedMessages) {
          messages.push(...cachedMessages);
        }
      }
    }
  }

  return messages;
}
