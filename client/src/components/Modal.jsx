// Reusable modal container

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg bg-card border border-border-dark"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark">
          <h3 className="text-white text-sm uppercase tracking-[0.2em]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-muted hover:text-white"
          >
            X
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
