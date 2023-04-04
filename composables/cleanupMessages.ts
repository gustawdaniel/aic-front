import { Gpt3Message } from "~/intefaces/Gpt3Interface";
// @ts-ignore
import { fuzzy } from "fast-fuzzy";

function dropDuplicatesFromArrayOfObjects<T>(array: T[], key: keyof T): T[] {
  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos;
  });
}

export function dropFuzzyMatchingFromArrayOfObjects<T>(array: T[], key: keyof T): T[] {
  return array.filter((obj, pos, arr) => {
    const current: string = obj[key] as string;
    return Math.max(...arr.filter((_, index) => index > pos).map(el => {
      const compared: string = el[key] as string
      return fuzzy(compared, current) as number
    })) < 0.75;
  });
}

export function cleanupMessages(messages: Gpt3Message[]): Gpt3Message[] {
  return dropFuzzyMatchingFromArrayOfObjects<Gpt3Message>(dropDuplicatesFromArrayOfObjects<Gpt3Message>(messages, 'content'), 'content')
}
