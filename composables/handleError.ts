import Swal from "sweetalert2";

export const handleError = (error: unknown) => {
    return Swal.fire(
        'Error!',
        getMessage(error),
        'error'
    )
}
