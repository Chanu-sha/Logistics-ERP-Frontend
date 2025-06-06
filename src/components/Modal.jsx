export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-sky-200 flex justify-center items-center rounded-lg p-6 w-[1300px] max-h-[97vh]  overflow-hidden relative">
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
