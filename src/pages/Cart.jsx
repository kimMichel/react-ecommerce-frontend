import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const handleOrderClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_item_ids: items.map((item) => item.id),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error creating order");
      }
    } catch (err) {
      console.error("Error trying create order.", err);
    }

    navigate("/order");
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:3000/cart", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetch cart items");
      }

      const data = await response.json();

      setItems(data);
    } catch (err) {
      console.error("Error trying fetch cart items.", err);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/cart/remove_from_cart/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error removing item from cart");
      }

      fetchCartItems();
    } catch (err) {
      console.error("Error trying remove item from cart.", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
      <div className="overflow-x-auto">
        <div className="bg-gray-200 text-gray-600 text-xs font-semibold uppercase border-b border-gray-200">
          <div className="flex">
            <div className="flex-1 p-2">Nome</div>
            <div className="flex-1 p-2">Descrição</div>
            <div className="flex-1 p-2">Quantidade</div>
            <div className="flex-1 p-2">Preço</div>
            <div className="flex-1 p-2">Ações</div>
          </div>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex border-b border-gray-200 houver:bg-gray-100 mb-4"
          >
            <div className="flex-1 p-2">{item.book.name}</div>
            <div className="flex-1 p-2">{item.book.description}</div>
            <div className="flex-1 p-2">{item.quantity}</div>
            <div className="flex-1 p-2">{`R$ ${parseFloat(item.book.price)
              .toFixed(2)
              .replace(".", ",")}`}</div>
            <div className="flex-1 p-2">
              <button
                onClick={() => {
                  handleRemoveItem(item.book.id);
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        {items.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleOrderClick}
              className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
            >
              Realizar o pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
