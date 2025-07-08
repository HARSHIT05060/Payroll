import { AlertCircle, XCircle } from 'lucide-react';

export const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger"
}) => {
    if (!isOpen) return null;

    const getButtonStyles = () => {
        switch (type) {
            case 'danger':
                return 'bg-[var(--color-error-dark)] hover:bg-[var(--color-error-darker)] text-[var(--color-text-white)]';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 text-[var(--color-text-white)]';
            default:
                return 'bg-[var(--color-blue-dark)] hover:bg-[var(--color-blue-darker)] text-[var(--color-text-white)]';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-[var(--color-bg-primary)]0 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="relative transform overflow-hidden rounded-lg bg-[var(--color-bg-secondary)] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-[var(--color-bg-secondary)] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${type === 'danger' ? 'bg-[var(--color-error-light)]' : type === 'warning' ? 'bg-yellow-100' : 'bg-[var(--color-blue-lighter)]'
                                }`}>
                                {type === 'danger' ? (
                                    <XCircle className="h-6 w-6 text-[var(--color-text-error)]" />
                                ) : type === 'warning' ? (
                                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                                ) : (
                                    <AlertCircle className="h-6 w-6 text-[var(--color-blue-dark)]" />
                                )}
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-[var(--color-text-primary)]">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-primary)] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto transition-colors ${getButtonStyles()}`}
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-[var(--color-bg-secondary)] px-3 py-2 text-sm font-semibold text-[var(--color-text-primary)] shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-[var(--color-bg-primary)] sm:mt-0 sm:w-auto transition-colors"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};