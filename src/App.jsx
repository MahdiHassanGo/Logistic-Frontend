import { AuthProvider } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import { AppRouter } from "./app/router";

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppRouter />
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
