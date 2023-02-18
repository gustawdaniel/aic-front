import {Source} from "~/intefaces/Source";

export const useSources = () => {
  return useState<Source[]>('sources', () => [])
}
