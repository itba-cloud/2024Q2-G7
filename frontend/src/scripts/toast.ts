import { toast } from "react-toastify";

const options = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

export function showToast(
    message: string,
    state: "success" | "error" = "success"
) {
    if (state === "success") {
        toast.success(message, { ...options, position: "bottom-right" });
    } else {
        toast.error(message, { ...options, position: "bottom-right" });
    }
}
