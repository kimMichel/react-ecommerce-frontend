import { useEffect, useState } from "react";

const Order = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3000/orders", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error fetching orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error trying to fetch orders.", err);
    }
  };

  const handleCancelOrder = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error cancelling the order");
      }

      fetchOrders();
    } catch (err) {
      console.error("Error trying cancel the order.", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meus Pedidos</h1>
      <div className="overflow-x-auto">
        <div className="min-w-full border border-gray-200">
          <div className="bg-gray-200 text-gray-600 text-xs font-semibold uppercase border-b border-gray-200">
            <div className="flex">
              <div className="flex-1 p-2">Pedido</div>
              <div className="flex-1 p-2">Total</div>
              <div className="flex-1 p-2">Status</div>
              <div className="flex-1 p-2">Ações</div>
            </div>
          </div>
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex border-b border-gray-200 houver:bg-gray-100"
            >
              <div className="flex-1 p-2">{order.id}</div>
              <div className="flex-1 p-2">{`R$ ${parseFloat(order.total)
                .toFixed(2)
                .replace(".", ",")}`}</div>
              <div className="flex-1 p-2">{order.status}</div>
              <div className="flex-1 p-2">
                <button
                  onClick={() => handleCancelOrder(order.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
