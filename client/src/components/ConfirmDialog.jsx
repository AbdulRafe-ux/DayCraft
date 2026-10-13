import Modal from './Modal';
import Icon from './Icons';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', busy, error, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} dismissible={!busy}>
      <p>{message}</p>
      {error && (
        <div className="alert alert-error" role="alert">
          <Icon name="alert" />
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn-navy" onClick={onConfirm} disabled={busy}>
          {busy ? <span className="spinner" aria-hidden="true" /> : <Icon name="trash" />}
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
