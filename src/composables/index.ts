export function useToast() {
    const state = reactive({
        msg: 'toast',
        type: 'text',
        show: false,
        cover: false,
        title: '',
        bottom: '',
        center: true,
    })
    function openToast(type: string, msg: string, cover: boolean = false) {
        state.show = true;
        state.msg = msg;
        state.type = type;
        state.cover = cover;
    }
    return { state, openToast }
}