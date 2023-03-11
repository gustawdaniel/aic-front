interface QueuedElement {
    type: string
    progress: number
}

interface QueuedInput {
    id: string,
    type: string,
    progress: number
}

export const useQueues = () => {
    return useState<Map<string, QueuedElement>>('queues', () => new Map())
}

export function setQueue(input: QueuedInput) {
    const q = useQueues();

    if(input.progress === 1) {
        q.value.delete(input.id)
    } else {
        q.value.set(input.id, {
            progress: input.progress,
            type: input.type
        });
    }
}
