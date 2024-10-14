import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import CartIcon from "./components/CartIcon";

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [username, setUsername] = useState("");

  const handleLogin = (isAdmin, username, cartItems) => {
    setIsAuthenticated(true);
    setLoginModalOpen(false);
    setIsAdmin(isAdmin);
    setUsername(username);
    setCartItems(cartItems);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error on logout");
      }
    } catch (err) {
      console.error("Error when try to logout", err);
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCartItems([]);
    localStorage.removeItem("isAuthenticated");
  };

  const addToCart = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:3000/cart/add_to_cart/${item.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: 1 }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error when add item to cart");
      }
    } catch (err) {
      console.error("Error when try to add item on cart.", err);
    }

    setCartItems((prevItems) => [...prevItems, item]);
  };

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("http://localhost:3000/check_session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          setIsAuthenticated(true);
          setUsername(`${data.user.first_name} ${data.user.last_name}`);
          setCartItems(data.cart_items);
          setIsAdmin(data.user.is_admin);
        } else {
          localStorage.removeItem("isAuthenticated");
        }
      }
    };

    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      checkSession();
    }
  }, []);

  return (
    <Router>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {isAuthenticated ? `Bem vindo, ${username}` : "Minha Aplicação"}
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className="font-bold">
              Home
            </a>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {!isAdmin && (
                  <div className="flex items-center gap-2">
                    <a href="/order" className="font-bold">
                      Pedidos
                    </a>
                    <div className="relative">
                      <CartIcon cartItemCount={cartItems.length} />
                    </div>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Cadastro
                </button>
              </div>
            )}
          </div>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                addToCart={addToCart}
              />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
        </Routes>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onLogin={handleLogin}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={() => setRegisterModalOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;
