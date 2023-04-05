import { ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions } from "vue";

interface ModalState {
  component: DefineComponent<{}, {}, any, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin> | undefined,
  context: any
  settings: { fullWidth: boolean }
}

export const useModal = () => {
  return useState<ModalState>('modal', () => ({component: undefined, context: undefined, settings: {fullWidth: false}}))
}


export function closeModal() {
  const modal = useModal();
  modal.value.component = undefined
  modal.value.context = undefined
  modal.value.settings = {fullWidth: false}
}
