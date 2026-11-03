import Modal from "./Modal";
import { AlertTriangle, Info } from "lucide-react";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger" // 'danger' | 'primary'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="450px">
      <div className="confirm-modal-content">
        <div className={`confirm-icon-wrapper ${variant}`}>
          {variant === "danger" ? (
            <AlertTriangle size={24} />
          ) : (
            <Info size={24} />
          )}
        </div>
        <p className="confirm-message">{message}</p>
      </div>

      <div className="confirm-actions">
        <button type="button" className="secondary-btn" onClick={onClose}>
          {cancelText}
        </button>
        <button
          type="button"
          className={variant === "danger" ? "danger-btn" : "primary-btn"}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;

