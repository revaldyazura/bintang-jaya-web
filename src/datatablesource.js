export const userColumns = [
  {
    field: "username", headerName: "Nama", flex: 0.1
  },
  { field: "email", headerName: "Email", flex: 0.1 },
  { field: "position", headerName: "Jabatan", flex: 0.1 }
];
export const warnaColumns = [
  { field: "id", headerName: "Kode", flex: 0.1, minWidth: 70 },
  { field: "color", headerName: "Warna", flex: 0.1, minWidth: 70 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 70 }
]
export const jenisColumns = [
  { field: "id", headerName: "Kode", flex: 0.1, minWidth: 70 },
  { field: "type", headerName: "Tipe Benang Obras", flex: 0.1, minWidth: 70 }
]
export const konesColumns = [
  { field: "id", headerName: "Kode", flex: 0.1, minWidth: 70 },
  { field: "variant", headerName: "Kones", flex: 0.1, minWidth: 70 }
]
export const beratColumns = [
  { field: "id", headerName: "Kode", flex: 0.1, minWidth: 70 },
  { field: "weight", headerName: "Berat", flex: 0.1, minWidth: 70 }
]
export const jumlahColumns = [
  { field: "id", headerName: "Kode", flex: 0.1, minWidth: 70 },
  { field: "stock", headerName: "Jumlah", flex: 0.1, minWidth: 70 }
]
export const tokoColumns = [
  { field: "client", headerName: "Toko", flex: 0.1, minWidth: 70 },
]

export const produkColumns = [
  { field: "id", headerName: "Kode Tag", flex: 0.1, minWidth: 150 },
  {
    field: "product", headerName: "Barang", minWidth: 140, flex: 0.1, renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.img && (
            <img className="cellImg" src={params.row.img} alt="produk" />
          )}
          {params.row.product}
        </div>
      )
    }
  },
  {
    field: "color",
    headerName: "Warna",
    flex: 0.1,
    minWidth: 50,
  },
  {
    field: "number",
    headerName: "Nomor",
    flex: 0.1,
    minWidth: 50,
  },
  { field: "type", headerName: "Tipe", flex: 0.1, minWidth: 50 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 50 },
  { field: "variant", headerName: "Kones", flex: 0.1, minWidth: 50 },
  {
    field: "stock",
    headerName: "Stok",
    flex: 0.1,
    minWidth: 50,
  },
];
export const stokColumns = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 150 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 140, renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.img && (
            <img className="cellImg" src={params.row.img} alt="produk" />
          )}
          {params.row.product}
        </div>
      )
    }
  },
  { field: "color", headerName: "Warna", flex: 0.1, minWidth: 50 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 50 },
  { field: "type", headerName: "Tipe", flex: 0.1, minWidth: 59 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 50 },
  { field: "variant", headerName: "Kones", flex: 0.1, minWidth: 50 },
  { field: "stock", headerName: "Stok", flex: 0.1 },
  { field: "timeStamp", headerName: "Waktu Masuk", flex: 0.1, minWidth: 200 },
];

export const kirimColumns = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 150 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 140, renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.img && (
            <img className="cellImg" src={params.row.img} alt="produk" />
          )}
          {params.row.product}
        </div>
      )
    }
  },
  { field: "color", headerName: "Warna", flex: 0.1, minWidth: 50 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 50 },
  { field: "type", headerName: "Tipe", flex: 0.1, minWidth: 59 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 50 },
  { field: "variant", headerName: "Kones", flex: 0.1, minWidth: 50 },
  { field: "stock", headerName: "Stok", flex: 0.1 },
  { field: "client", headerName: "Toko", flex: 0.1, minWidth: 50 },
  { field: "timeStamp", headerName: "Waktu Kirim", flex: 0.1, minWidth: 150 },
];
