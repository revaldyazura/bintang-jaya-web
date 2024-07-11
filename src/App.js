import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import List from "./pages/list/List"
import Single from "./pages/single/Single"
import New from "./pages/new/New"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { stokInputs, userInputs, kirimInputs, produkInputs, tokoInputs, warnaInputs, jenisInputs, konesInputs, jumlahInputs, beratInputs } from "./formSource"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext"
import { userColumns, stokColumns, kirimColumns, produkColumns, tokoColumns, warnaColumns, jumlahColumns, beratColumns, konesColumns, jenisColumns } from "./datatablesource";

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
            <Route path="warna">
              <Route index element={
                <RequireAuth>
                  <List source={warnaColumns} db="warna" title="Data Kode Untuk Warna" newPath="/warna/tambah" idPath="/warna/:Id" />
                </RequireAuth>} />
              <Route path=":warnaId" element={
                <RequireAuth>
                  <Single source={warnaColumns} database="warna" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={warnaInputs} title="Tambah Data Kode Untuk Warna" database="warna" />
                </RequireAuth>} />
            </Route>
            <Route path="jenis">
              <Route index element={
                <RequireAuth>
                  <List source={jenisColumns} db="jenis" title="Data Kode Untuk Jenis" newPath="/jenis/tambah" idPath="/jenis/:Id" />
                </RequireAuth>} />
              <Route path=":jenisId" element={
                <RequireAuth>
                  <Single source={jenisColumns} database="jenis" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={jenisInputs} title="Tambah Data Kode Untuk Jenis" database="jenis" />
                </RequireAuth>} />
            </Route>
            <Route path="kones">
              <Route index element={
                <RequireAuth>
                  <List source={konesColumns} db="kones" title="Data Kode Untuk Kones" newPath="/kones/tambah" idPath="/kones/:Id" />
                </RequireAuth>} />
              <Route path=":konesId" element={
                <RequireAuth>
                  <Single source={konesColumns} database="kones" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={konesInputs} title="Tambah Data Kode Untuk Kones" database="kones" />
                </RequireAuth>} />
            </Route>
            <Route path="berat">
              <Route index element={
                <RequireAuth>
                  <List source={beratColumns} db="berat" title="Data Kode Untuk Berat" newPath="/berat/tambah" idPath="/berat/:Id" />
                </RequireAuth>} />
              <Route path=":beratId" element={
                <RequireAuth>
                  <Single source={beratColumns} database="berat" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={beratInputs} title="Tambah Data Kode Untuk Berat" database="berat" />
                </RequireAuth>} />
            </Route>
            <Route path="jumlah">
              <Route index element={
                <RequireAuth>
                  <List source={jumlahColumns} db="amount" title="Data Kode Untuk Jumlah Stok" newPath="/jumlah/tambah" idPath="/jumlah/:Id" />
                </RequireAuth>} />
              <Route path=":jumlahId" element={
                <RequireAuth>
                  <Single source={jumlahColumns} database="amount" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={jumlahInputs} title="Tambah Data Kode Untuk Jumlah Stok" database="amount" />
                </RequireAuth>} />
            </Route>
            <Route path="toko">
              <Route index element={
                <RequireAuth>
                  <List source={tokoColumns} db="toko" title="Daftar Toko" newPath="/toko/tambah" idPath="/toko/:Id" />
                </RequireAuth>} />
              <Route path=":tokoId" element={
                <RequireAuth>
                  <Single source={tokoColumns} database="toko" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={tokoInputs} title="Tambah Toko" database="toko" />
                </RequireAuth>} />
            </Route>
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
            <Route path="kode">
              <Route index element={
                <RequireAuth>
                  <List source={produkColumns} db="products" title="Kode Tag" newPath="/kode/tambah" idPath="/kode/:Id" />
                </RequireAuth>} />
              <Route path=":produkId" element={
                <RequireAuth>
                  <Single database="products" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={produkInputs} title="Tambah Kode Tag" database="products" />
                </RequireAuth>} />
            </Route>
            <Route path="stok">
              <Route index element={
                <RequireAuth>
                  <List source={stokColumns} db="stok" title="Stok" newPath="/stok/tambah" idPath="/stok/:Id" />
                </RequireAuth>} />
              <Route path=":stokId" element={
                <RequireAuth>
                  <Single source={stokColumns} database="stok" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={stokInputs} title="Tambah Stok Masuk" database="stok" />
                </RequireAuth>} />
            </Route>
            <Route path="kirim">
              <Route index element={
                <RequireAuth>
                  <List source={kirimColumns} db="kirim" title="Dikirim" newPath="/kirim/tambah" idPath="/kirim/:Id" />
                </RequireAuth>} />
              <Route path=":kirimId" element={
                <RequireAuth>
                  <Single source={kirimColumns} database="kirim" />
                </RequireAuth>} />
              <Route path="tambah" element={
                <RequireAuth>
                  <New inputs={kirimInputs} title="Tambah Kirim Stok" database="kirim" />
                </RequireAuth>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App
