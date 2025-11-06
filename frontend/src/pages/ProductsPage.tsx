import React, { useEffect, useState } from "react";
import { useCart, type CartItem } from "../context/CartContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

interface ProductFromAPI {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductFromAPI[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart, cartItems, updateQty } = useCart();

  useEffect(() => {
    setLoading(true);
    axios
      .get<ProductFromAPI[]>("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const findCartItem = (productId: string): CartItem | undefined =>
    cartItems.find((item) => item.productId === productId);

  if (loading)
    return <div className="p-6 text-center">Loading Products...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex w-full items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex items-center space-x-2 font-medium hover:underline ${
              isActive ? "underline" : ""
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-cart3"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
          </svg>
          <span>Cart</span>
        </NavLink>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => {
          const productIdStr = p.id.toString();
          const inCartItem = findCartItem(productIdStr);

          return (
            <div
              key={p.id}
              className=" bg-gray-50 rounded-lg p-4 shadow flex flex-col"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-40 object-contain mb-4 rounded"
              />
              <h3 className="font-bold text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                {p.description}
              </p>
              <p className="text-lg font-semibold mb-4">₹{p.price}</p>

              {inCartItem ? (
                <div className="flex items-center space-x-2 mt-auto">
                  <button
                    onClick={() => updateQty(inCartItem.id, inCartItem.qty - 1)}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    disabled={inCartItem.qty <= 1}
                  >
                    -
                  </button>
                  <span>{inCartItem.qty}</span>
                  <button
                    onClick={() => updateQty(inCartItem.id, inCartItem.qty + 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                  <button
                    className="mt-auto py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition w-full"
                    onClick={() => navigate("/cart")}
                  >
                    <span>Go to Cart</span>
                  </button>
                </div>
              ) : (
                <button
                  className="mt-auto py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  onClick={() =>
                    addToCart(
                      {
                        productId: productIdStr,
                        name: p.title,
                        price: p.price,
                        imageUrl: p.image,
                      },
                      1
                    )
                  }
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
