import React from "react";
import { useLocation, Link } from "react-router-dom";
import type { CartItem } from "../context/CartContext";

interface Receipt {
  total: number;
  timestamp: string;
  items: CartItem[];
}

interface LocationState {
  receipt: Receipt;
  name: string;
  email: string;
}

const formatPrice = (price: number) =>
  price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });

const ReceiptPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  if (!state?.receipt) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No receipt found
        </h2>
        <Link to="/" className="text-blue-600 underline mt-4 block">
          Go back to Products
        </Link>
      </div>
    );
  }

  const { receipt, name, email } = state;

  return (
    <div className="p-6 max-w-lg mx-auto  rounded-lg shadow-md bg-gray-50 m-5">
      <h2 className="text-3xl font-semibold mb-6 border-b border-gray-200 pb-3 text-gray-900">
        Order Receipt
      </h2>
      <section className="mb-6 space-y-2 text-gray-700">
        <p>
          <span className="font-medium">Name:</span> {name}
        </p>
        <p>
          <span className="font-medium">Email:</span> {email}
        </p>
        <p>
          <span className="font-medium">Timestamp:</span>{" "}
          {new Date(receipt.timestamp).toLocaleString()}
        </p>
      </section>

      <section className="border-t border-gray-200 pt-4">
        <h3 className="font-semibold mb-4 text-lg text-gray-800">Items</h3>
        <ul className="divide-y divide-gray-200">
          {receipt.items.map((item) => (
            <li
              key={item.id}
              className="py-3 flex justify-between items-center hover:bg-gray-50 rounded px-2"
            >
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.qty} × {formatPrice(item.price)} each
                </p>
              </div>
              <div className="font-semibold text-gray-800">
                {formatPrice(item.price * item.qty)}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-gray-200 pt-4 text-right text-xl font-bold text-gray-900">
          Total: {formatPrice(receipt.total)}
        </div>
      </section>

      <Link
        to="/"
        className="mt-10 inline-block text-blue-600 hover:underline font-medium"
      >
        &larr; Back to Products
      </Link>
    </div>
  );
};

export default ReceiptPage;
