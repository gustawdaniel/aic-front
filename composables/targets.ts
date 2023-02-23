import {Target} from "~/intefaces/Target";

export const useTargets = () => {
  return useState<Target[]>('targets', () => [])
}
