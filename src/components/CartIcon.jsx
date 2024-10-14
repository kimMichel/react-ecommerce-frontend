import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartIcon = ({ cartItemCount }) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <button onClick={handleCartClick} className="relative">
      <FaShoppingCart size={24} />
      {cartItemCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
          {cartItemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
