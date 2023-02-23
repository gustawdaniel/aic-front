import {ComponentOptionsMixin, ComputedOptions, DefineComponent, MethodOptions} from "vue";

interface ModalState {
    component: DefineComponent<{}, {}, any, ComputedOptions, MethodOptions, ComponentOptionsMixin, ComponentOptionsMixin> | undefined,
    context: any
}

export const useModal = () => {
    return useState<ModalState>('modal', () => ({component: undefined, context: undefined}))
}
