import { useEffect, useState } from "react";
import AddBookModal from "../components/AddBookModal";
import EditBookModal from "../components/EditBookModal";

const Home = ({ isAuthenticated, isAdmin, addToCart }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBook = async () => {
    try {
      const response = await fetch("http://localhost:3000/books");

      if (!response.ok) {
        throw new Error("Error when try to fetch books");
      }

      const data = await response.json();

      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const handleUpdate = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error delete book");
      }

      fetchBook();
    } catch (err) {
      console.error("Error trying delete book.", err);
    }
  };

  useEffect(() => {
    fetchBook();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Lista de livros</h1>
        {isAuthenticated && isAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
          >
            Adicionar
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full border border-gray-200">
          <div className="bg-gray-200 text-gray-600 text-xs font-semibold uppercase border-b border-gray-200">
            <div className="flex">
              <div className="flex-1 p-2">Nome</div>
              <div className="flex-1 p-2">Descrição</div>
              <div className="flex-1 p-2">Preço</div>
              {isAuthenticated && <div className="flex-1 p-2">Ações</div>}
            </div>
          </div>
          {books.map((book) => (
            <div
              key={book.id}
              className="flex border-b border-gray-200 houver:bg-gray-100"
            >
              <div className="flex-1 p-2">{book.name}</div>
              <div className="flex-1 p-2">{book.description}</div>
              <div className="flex-1 p-2">{`R$ ${parseFloat(book.price)
                .toFixed(2)
                .replace(".", ",")}`}</div>
              {isAuthenticated && (
                <div className="flex-1 p-2">
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Excluir
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(book)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Adicionar ao carrinho
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {isEditModalOpen && selectedBook && (
        <EditBookModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          book={selectedBook}
          onUpdate={handleUpdate}
        />
      )}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onBookAdded={handleBookAdded}
      />
    </div>
  );
};

export default Home;
