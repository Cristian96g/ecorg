import { toast } from "react-toastify";

const baseOptions = {
  position: "top-right",
  autoClose: 3200,
  closeOnClick: true,
  pauseOnHover: true,
};

export function notifySuccess(message, options = {}) {
  return toast.success(message, { ...baseOptions, ...options });
}

export function notifyError(message, options = {}) {
  return toast.error(message, { ...baseOptions, ...options });
}

export function notifyInfo(message, options = {}) {
  return toast.info(message, { ...baseOptions, ...options });
}

export function notifyWarning(message, options = {}) {
  return toast.warning(message, { ...baseOptions, ...options });
}

export function notifyLoading(message, options = {}) {
  return toast.loading(message, { ...baseOptions, ...options });
}

export function notifyPromise(promise, messages, options = {}) {
  return toast.promise(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: messages.error,
    },
    { ...baseOptions, ...options }
  );
}
