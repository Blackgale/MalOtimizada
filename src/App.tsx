import { Route, Routes, Navigate, Link } from "react-router-dom";
import TopBar from "./components/TopBar";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useAuth } from "./store/useAuth";

function DebugStrip() {
  const { token, user } = useAuth();
  return (
    <div style={{ padding: 8, background: "#eef6ff", borderBottom: "1px solid #bcd" }}>
      
      user: <code>{user?.email || "-"}</code> |
      <Link to="/signin" style={{ marginLeft: 8, textDecoration: "underline" }}>/signin</Link> |
      <Link to="/" style={{ marginLeft: 8, textDecoration: "underline" }}>/</Link>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();

  return (
    <div className="min-h-screen">
      <DebugStrip />
      {token ? <TopBar /> : null}

      <Routes>
        {/* fluxo deslogado */}
        {!token && (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Se cair em qualquer rota enquanto deslogado → /signin */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        )}

        {/* fluxo logado */}
        {token && (
          <>
            <Route path="/" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            {/* Se cair em rota inválida logado → / */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}
