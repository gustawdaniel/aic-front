import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";

export const useModal = () => {
  return useState<DefineComponent<{}, {}, any, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin> | undefined>('modal', () => undefined)
}
