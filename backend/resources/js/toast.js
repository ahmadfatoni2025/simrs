import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const TOAST_DEFAULTS = {
    duration: 4000,
    gravity: 'top',
    position: 'right',
    close: true,
    stopOnFocus: true,
    className: '',
};

const styles = {
    error: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800',
    success: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800',
    loading: 'bg-gray-50 text-gray-900 border-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700',
};

function createToast(message, type = 'info', options = {}) {
    const toast = Toastify({
        ...TOAST_DEFAULTS,
        ...options,
        text: message,
        className: `
            ${styles[type]}
            border shadow-lg rounded-lg px-4 py-3 text-sm font-medium
            transition-all duration-300 ease-out
            min-w-[280px] max-w-[480px]
            ${options.className || ''}
        `.trim(),
        style: {
            background: 'transparent',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        },
        onClick: options.onClick,
    });

    toast.showToast();
    return toast;
}

export const toast = {
    error: (message, options) => createToast(message, 'error', options),
    success: (message, options) => createToast(message, 'success', options),
    warning: (message, options) => createToast(message, 'warning', options),
    info: (message, options) => createToast(message, 'info', options),
    loading: (message, options) => createToast(message, 'loading', { ...options, duration: -1, close: false }),
    dismiss: (toastId) => Toastify.dismiss(toastId),
    dismissAll: () => Toastify.dismissAll(),
};

export function setupGlobalErrorHandler() {
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message) {
            toast.error(event.reason.message);
        }
        event.preventDefault();
    });

    window.addEventListener('error', (event) => {
        if (event.error?.message) {
            toast.error(event.error.message);
        }
    });

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        try {
            const response = await originalFetch(...args);
            if (!response.ok && response.status >= 400) {
                let errorMessage = `HTTP Error: ${response.status}`;
                try {
                    const data = await response.clone().json();
                    errorMessage = data.message || data.error || errorMessage;
                } catch {
                }
                toast.error(errorMessage);
            }
            return response;
        } catch (error) {
            if (error.name !== 'AbortError') {
                toast.error(error.message || 'Network error');
            }
            throw error;
        }
    };
}

export default toast;