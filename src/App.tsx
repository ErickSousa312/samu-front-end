import Routers from "./routes";
import { ToastProvider } from "./shared/context/ToastContext";

function App() {
  return (
    <div className="bg-[#3232c0] h-[100%] w-[100%]">
      <ToastProvider>
        <Routers />
      </ToastProvider>
    </div>
  );
}

export default App;
