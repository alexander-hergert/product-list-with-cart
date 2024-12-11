"use client";
import { useContext } from "react";
import { ModalContext } from "@/lib/modalContext";
import { CartContext } from "@/lib/cartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Modal = () => {
  const cartContext = useContext(CartContext);
  const modalContext = useContext(ModalContext);
  const router = useRouter();

  if (!cartContext) {
    return <div>Error: ModalContext is not available.</div>;
  }

  if (!modalContext) {
    return <div>Error: CartContext is not available.</div>;
  }

  const { isModal, setIsModal } = modalContext;
  const { cart, setCart } = cartContext;

  const handleModal = () => {
    setIsModal(false);
    // setCart({});
    // localStorage.setItem("cart", JSON.stringify({}));
    router.push("/payment");
  };

  const items = Object.keys(cart).reduce((acc, id) => {
    return acc + cart[id].quantity;
  }, 0);

  const itemTypes = Object.keys(cart).reduce((acc, id) => {
    return acc + (cart[id].quantity > 0 ? 1 : 0);
  }, 0);

  const totalPrice = Object.keys(cart).reduce((acc, id) => {
    return acc + cart[id].price * cart[id].quantity;
  }, 0);

  return (
    <>
      {isModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-20 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto max-w-[90%] max-h-[90%]">
            <Image
              src="/images/icon-order-confirmed.svg"
              alt="confirmed-icon"
              width={50}
              height={50}
            />
            <h1 className="text-2xl font-bold mb-4 text-left mt-4">
              Order Confirmed
            </h1>
            <p className="text-slate-500 mb-6">We hope you enjoy your food!</p>
            {/* cart */}
            <div
              className=" min-w-[150px] bg-slate-100/25 rounded-xl w-[592px] p-4 min-h-[300px] max-lg:w-[688px] justify-self-center max-md:w-[327px]"
              style={{ height: `${itemTypes * 80 + 100}px` }}
            >
              {Object.keys(cart).map(
                (id) =>
                  cart[id].quantity > 0 && (
                    <div
                      key={id}
                      className="my-4 flex justify-between items-center gap-4 border-b pb-4"
                    >
                      <div className="flex justify-center gap-4 items-center">
                        <div className="w-[48px] h-[48px]">
                          <Image
                            className="rounded-lg w-full object-cover"
                            src={cart[id].image}
                            alt="cart-item"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">{cart[id].name}</h3>
                          <div className="flex gap-2">
                            <p className="text-red-800">{cart[id].quantity}x</p>
                            <p className="text-gray-500">@${cart[id].price}</p>
                          </div>
                        </div>
                      </div>
                      <p>${cart[id].price * cart[id].quantity}</p>
                    </div>
                  )
              )}
              {itemTypes > 0 && (
                <>
                  <div className="flex justify-between item-center mb-4">
                    <p>Order Total</p>
                    <p className="text-2xl font-bold">
                      ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
            {/* cart */}
            <div className="text-center mt-4">
              <button
                onClick={handleModal}
                className="bg-amber-800 hover:bg-amber-900 text-white py-2 px-4 rounded-lg"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
