"use client";
import { useContext } from "react";
import { ModalContext } from "@/lib/modalContext";
import { CartContext } from "@/lib/cartContext";

const Modal = () => {
  const cartContext = useContext(CartContext);
  const modalContext = useContext(ModalContext);

  if (!cartContext) {
    return <div>Error: ModalContext is not available.</div>;
  }

  if (!modalContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  const { isModal, setIsModal } = modalContext;
  const { setCart } = cartContext;

  const handleModal = () => {
    setIsModal(false);
    setCart({});
    localStorage.setItem("cart", JSON.stringify({}));
  };

  return (
    <>
      {isModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold mb-4 text-center">
              Order Confirmed
            </h1>
            <div className="text-center">
              <button
                onClick={handleModal}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
