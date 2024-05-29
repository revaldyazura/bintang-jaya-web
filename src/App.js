import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import List from "./pages/list/List"
import Single from "./pages/single/Single"
import New from "./pages/new/New"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { stokInputs, userInputs, kirimInputs, produkInputs } from "./formSource"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { userColumns, stokColumn, kirimColumn, produkColumn } from "./datatablesource";

function App() {
  const { currentUser } = useContext(AuthContext)
  const RequireAuth = ({ children }) => {
    return currentUser ? (children) : <Navigate to="/login" />
  }

  const handleUid = async () => {
    return currentUser.uid;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />
            <Route index element={
              <RequireAuth>
                < Home />
              </RequireAuth>
            } />
            <Route path="pengguna">
              <Route index element={
                <RequireAuth>
                  <List source={userColumns} db="users" title="Pengguna" newPath="/pengguna/tambah" idPath="/pengguna/:Id" />
                </RequireAuth>} />
              <Route path=":userId" element={
                <RequireAuth>
                  <Single source={userColumns} database="users" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={userInputs} title="Tambah Pengguna" database="users" />
                </RequireAuth>} />
            </Route>
            <Route path="produk">
              <Route index element={
                <RequireAuth>
                  <List source={produkColumn} db="products" title="Produk" newPath="/produk/tambah" idPath="/produk/:Id" />
                </RequireAuth>} />
              <Route path=":produkId" element={
                <RequireAuth>
                  <Single database="products" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={produkInputs} title="Data Produk" database="products" />
                </RequireAuth>} />
            </Route>
            <Route path="stok">
              <Route index element={
                <RequireAuth>
                  <List source={stokColumn} db="stok" title="Stok" newPath="/stok/tambah" idPath="/stok/:Id" />
                </RequireAuth>} />
              <Route path=":stokId" element={
                <RequireAuth>
                  <Single source={stokColumn} database="stok" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={stokInputs} title="Data Stok Barang" database="stok" />
                </RequireAuth>} />
            </Route>
            <Route path="kirim">
              <Route index element={
                <RequireAuth>
                  <List source={kirimColumn} db="kirim" title="Dikirim" newPath="/kirim/tambah" idPath="/kirim/:Id" />
                </RequireAuth>} />
              <Route path=":kirimId" element={
                <RequireAuth>
                  <Single source={kirimColumn} database="kirim" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={kirimInputs} title="Data Kirim Barang" database="kirim" />
                </RequireAuth>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App
