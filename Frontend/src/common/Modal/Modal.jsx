import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg overflow-y-auto relative">
        {/* <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &#10005;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
