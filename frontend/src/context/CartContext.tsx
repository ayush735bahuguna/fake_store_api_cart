import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import axios from "axios";
import debounce from "lodash.debounce";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Omit<CartItem, "qty" | "id" | "image">,
    qty?: number
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debounceMap = useRef(new Map<string, (...args: any[]) => void>());

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get<{ items: CartItem[]; total: number }>(
        "http://localhost:5000/api/cart"
      );
      setCartItems(res.data.items);
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
  };

  const addToCart = async (
    product: Omit<CartItem, "qty" | "id">,
    qty: number = 1
  ) => {
    const existingIndex = cartItems.findIndex(
      (i) => i.productId === product.productId
    );
    let updatedCart: CartItem[];
    if (existingIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingIndex].qty += qty;
    } else {
      updatedCart = [
        ...cartItems,
        { ...product, id: Math.random().toString(36).substr(2, 9), qty },
      ];
    }
    setCartItems(updatedCart);

    try {
      await axios.post("http://localhost:5000/api/cart", {
        productId: product.productId,
        qty,
      });
      await fetchCart();
    } catch (e) {
      console.error("Failed to add to cart:", e);
      setCartItems(cartItems);
    }
  };

  const removeFromCart = async (id: string) => {
    const previousCart = cartItems;
    setCartItems(cartItems.filter((i) => i.id !== id));

    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
    } catch (e) {
      console.error("Failed to remove from cart:", e);
      setCartItems(previousCart); // Revert UI on failure
    }
  };

  const debouncedUpdateQty = (id: string, qty: number) => {
    if (!debounceMap.current.has(id)) {
      const fn = debounce(async (itemId: string, quantity: number) => {
        try {
          await axios.put(`http://localhost:5000/api/cart/${itemId}`, {
            qty: quantity,
          });
        } catch (error) {
          console.error("Failed to update quantity:", error);
        }
      }, 500);
      debounceMap.current.set(id, fn);
    }
    debounceMap.current.get(id)!(id, qty);
  };

  const updateQty = async (id: string, qty: number) => {
    if (qty <= 0) {
      await removeFromCart(id);
      return;
    }

    const updatedCart = cartItems.map((i) => (i.id === id ? { ...i, qty } : i));
    setCartItems(updatedCart);

    debouncedUpdateQty(id, qty);
  };

  const clearCart = async () => {
    const previousCart = cartItems;
    setCartItems([]);

    try {
      await Promise.all(
        previousCart.map((item) =>
          axios.delete(`http://localhost:5000/api/cart/${item.id}`)
        )
      );
    } catch (e) {
      console.error("Failed to clear cart:", e);
      setCartItems(previousCart);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
