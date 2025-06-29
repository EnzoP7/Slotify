import { toast } from "sonner";

export function showSuccessToast(msg: string, desc?: string) {
  toast.success(msg, { description: desc });
}

export function showInfoToast(msg: string, desc?: string) {
  toast(msg, { description: desc });
}

export function showErrorToast(msg: string, desc?: string) {
  toast.error(msg, { description: desc });
}
