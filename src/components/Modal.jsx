export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[850px] max-h-[90vh] overflow-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
