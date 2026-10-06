import Routers from "./routes";
import { ToastProvider } from "./shared/context/ToastContext";
function App() {
  return (
    <ToastProvider>
      <Routers />
    </ToastProvider>
  );
}
export default App;
