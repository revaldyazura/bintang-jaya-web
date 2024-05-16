export const userColumns = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 270 },
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

export const produkColumn = [
  { field: "id", headerName: "Kode Barang", flex: 0.1, minWidth: 100 },
  { field: "product", headerName: "Barang", flex: 0.1, minWidth: 150 },
  { 
    field: "color",
    headerName: "Warna",
    flex: 0.1,
    minWidth: 50,
  },
  { 
    field: "specific",
    headerName: "Detail",
    flex: 0.1,
    minWidth: 100,
  },
  { 
    field: "number",
    headerName: "Nomor",
    flex: 0.1,
    minWidth: 100,
  },
  { 
    field: "stock",
    headerName: "Stock",
    flex: 0.1,
    minWidth: 100,
  },
  { field: "thickness", headerName: "Tebal/satuan", flex: 0.1, minWidth: 100 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 100 },
  { field: "height", headerName: "Tinggi cones", flex: 0.1, minWidth: 100 },
];
export const stokColumn = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 180 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 200, renderCell: (params) => {
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
  { field: "specific", headerName: "Detail Warna", flex: 0.1, minWidth: 100 },
  { field: "color", headerName: "Warna", flex: 0.1},
  { field: "stock", headerName: "Stok", flex: 0.1},
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 100 },
  { field: "thickness", headerName: "Tebal/satuan", flex: 0.1, minWidth: 100 },
  { field: "weight", headerName: "Berat/satuan", flex: 0.1, minWidth: 100 },
  { field: "height", headerName: "Tinggi cones", flex: 0.1, minWidth: 100 },
  { field: "timeStamp", headerName: "Waktu Masuk", flex: 0.1, minWidth: 450 },
];

export const kirimColumn = [
  { field: "id", headerName: "ID", flex: 0.1, minWidth: 180 },

  {
    field: "product", headerName: "Barang", flex: 0.1, minWidth: 180, renderCell: (params) => {
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
  { field: "detail", headerName: "Detail Warna", flex: 0.1, minWidth: 100 },
  { field: "color", headerName: "Warna", flex: 0.1 },
  { field: "stock", headerName: "Stok", flex: 0.1 },
  { field: "number", headerName: "Nomor Warna", flex: 0.1, minWidth: 100 },
  { field: "client", headerName: "Pembeli", flex: 0.1 },
  { field: "timeStamp", headerName: "Waktu Kirim", flex: 0.1, minWidth: 250 },
];