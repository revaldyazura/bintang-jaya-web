export const userColumns = [
  // { field: "id", headerName: "ID", flex: 0.1, minWidth: 270 },
  // {
  //   field: "user", headerName: "Nama", flex: 0.1, renderCell: (params) => {
  //     return (
  //       <div className="cellWithImg">
  //         <img className="cellImg" src={params.row.img} alt="avatar" />
  //         {params.row.username}
  //       </div>
  //     )
  //   }
  // },
  {
    field: "username", headerName: "Nama", flex: 0.1
  },
  { field: "email", headerName: "Email", flex: 0.1 },
  { field: "position", headerName: "Jabatan", flex: 0.1 },
  // {
  //   field: "status", headerName: "Status", width: 160,
  //   renderCell: (params) => {
  //     return (
  //       <div className={`cellWithStatus ${params.row.status}`}>
  //         {params.row.status}
  //       </div>
  //     )
  //   }
  // },
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
  { field: "id", headerName: "Kode Tag", flex: 0.1, minWidth: 160 },
  {
    field: "product", headerName: "Barang", minWidth: 200, renderCell: (params) => {
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
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 160 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 160, renderCell: (params) => {
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
  { field: "color", headerName: "Warna", flex: 0.1 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 100 },
  { field: "type", headerName: "Tipe", flex: 0.1, minWidth: 50 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 100 },
  { field: "variant", headerName: "Tinggi cones", flex: 0.1, minWidth: 100 },
  { field: "stock", headerName: "Stok", flex: 0.1 },
  { field: "timeStamp", headerName: "Waktu Masuk", flex: 0.1, minWidth: 200 },
];

export const kirimColumns = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 160 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 150, renderCell: (params) => {
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
  { field: "color", headerName: "Warna", flex: 0.1 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 100 },
  { field: "type", headerName: "Tipe", flex: 0.1, minWidth: 50 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 100 },
  { field: "variant", headerName: "Kones", flex: 0.1, minWidth: 100 },
  { field: "stock", headerName: "Stok", flex: 0.1 },
  { field: "client", headerName: "Toko", flex: 0.1, minWidth: 70 },
  { field: "timeStamp", headerName: "Waktu Kirim", flex: 0.1, minWidth: 150 },
];
