
const LoginPage = () => {

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <form >
          <input
            type="text"
            placeholder="Usuário"

            className="p-2 mb-4 border rounded w-full"
          />
          <input
            type="password"
            placeholder="Senha"

            className="p-2 mb-4 border rounded w-full"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
