import { useEffect, useId, useRef } from 'react';
import Icon from './Icons';

/**
 * Accessible dialog built on the native <dialog> element:
 * the browser traps keyboard focus inside, Esc closes it, and focus returns
 * to the button that opened it. Children are only rendered while open,
 * so forms always start fresh.
 */
export default function Modal({ open, onClose, title, dismissible = true, children }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // Put the cursor in the first field that asks for it (e.g. the task title).
      dialog.querySelector('[data-autofocus]')?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const requestClose = () => {
    if (dismissible) onClose();
  };

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault(); // we control closing through state
        requestClose();
      }}
      onMouseDown={(e) => {
        if (e.target === ref.current) requestClose(); // click on the dark backdrop
      }}
    >
      {open && (
        <div className="modal-inner">
          <div className="modal-head">
            <h2 id={titleId}>{title}</h2>
            <button type="button" className="btn btn-ghost btn-icon" onClick={requestClose} aria-label="Close dialog" disabled={!dismissible}>
              <Icon name="close" size={20} />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
