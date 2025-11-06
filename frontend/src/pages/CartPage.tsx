import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQty } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-8 max-w-md mx-auto text-center mt-11">
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium"
        >
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link
        to="/"
        className="mb-10 m-2 inline-block text-blue-600 hover:underline font-medium"
      >
        &larr; Back
      </Link>
      <div className="p-4 pt-0 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-contain rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: ₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      item.qty > 1 && updateQty(item.id, item.qty - 1)
                    }
                    disabled={item.qty <= 1}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(
                        item.id,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <p className="w-24 text-right font-semibold">
                  ₹{item.price * item.qty}
                </p>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-right font-bold text-2xl">
          Total: ₹{total}
        </div>
        <div className="mt-6 text-right">
          <Link
            to="/checkout"
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartPage;
