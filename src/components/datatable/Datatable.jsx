import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { db } from "../../firebase";
import { Box, styled } from "@mui/material";
import { confirmAlert } from "react-confirm-alert";

const Datatable = ({ source, database, title, newPath, idPath }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    // LISTEN REAL-TIME
    const unsub = onSnapshot(
      collection(db, database),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          if (database === "stok" || database === "kirim") {
            const data = doc.data();
            const id = doc.id;
            const createdAtTimestamp = data.timeStamp; // Access the timestamp field
            const createdAtDate = createdAtTimestamp.toDate(); // Convert to JavaScript Date
            list.push({ id, ...data, timeStamp: createdAtDate });
          } else if (database === "products") {
            const productData = doc.data();
            const productId = doc.id;

            // Nested listener for 'warna'
            const colorSub = onSnapshot(
              collection(db, `products/${productId}/warna`),
              (colorSnapshot) => {
                colorSnapshot.docs.forEach((warnaDoc) => {
                  const colorData = warnaDoc.data();
                  const colorId = warnaDoc.id;

                  const typeSubs = onSnapshot(
                    collection(
                      db,
                      `products/${productId}/warna/${colorId}/jenis`
                    ),
                    (typeSnapshot) => {
                      typeSnapshot.docs.forEach((typeDoc) => {
                        const typeData = typeDoc.data();
                        const typeId = typeDoc.id;

                        const coneSubs = onSnapshot(
                          collection(
                            db,
                            `products/${productId}/warna/${colorId}/jenis/${typeId}/kones`
                          ),
                          (coneSnapshot) => {
                            coneSnapshot.docs.forEach((coneDoc) => {
                              const coneData = coneDoc.data();
                              const coneId = coneDoc.id;

                              const sizeSubs = onSnapshot(
                                collection(
                                  db,
                                  `products/${productId}/warna/${colorId}/jenis/${typeId}/kones/${coneId}/ukuran`
                                ),
                                (sizeSnapshot) => {
                                  sizeSnapshot.docs.forEach((sizeDoc) => {
                                    const sizeData = sizeDoc.data();
                                    const sizeId = sizeDoc.id;
                                    const amountSubs = onSnapshot(
                                      collection(
                                        db,
                                        `products/${productId}/warna/${colorId}/jenis/${typeId}/kones/${coneId}/ukuran/${sizeId}/jumlah`
                                      ),
                                      (amountSnapshot) => {
                                        amountSnapshot.docs.forEach(
                                          (amountDoc) => {
                                            const amountData = amountDoc.data();
                                            const amountId = amountDoc.id;
                                            const combinedId = `${productId}${colorId}${typeId}${coneId}${sizeId}${amountId}`;
                                            const completeData = {
                                              id: combinedId,
                                              ...productData,
                                              ...colorData,
                                              ...typeData,
                                              ...coneData,
                                              ...sizeData,
                                              ...amountData,
                                            };
                                            console.log(completeData);
                                            // Update list with new data structure
                                            list = list.filter(
                                              (item) => item.id !== combinedId
                                            ); // Remove old entry if exists
                                            list.push(completeData);
                                            setData([...list]); // Update state to trigger re-render
                                          }
                                        );
                                      }
                                    );
                                  });
                                }
                              );
                            });
                          }
                        );
                      });
                    }
                  );
                });
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            list.push({ id: doc.id, ...doc.data() });
          }
        });

        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: `Hapus data?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              const docRef = doc(db, database, id);
              const docSnapshot = await getDoc(docRef);
              console.log(docSnapshot);
              if (docSnapshot.exists()) {
                await deleteDoc(docRef);

                // Update the data array, filtering out the deleted document
                setData(data.filter((item) => item.id !== id));
              } else {
                console.log("Document does not exist");
              }
            } catch (err) {
              console.log(err);
            }
          },
        },

        {
          label: "Batal",
          onClick: () => {
            console.log(`Penghapusan data dengan kode ${id} dibatalkan.`);
          },
        },
      ],
    });
  };

  const handleProductDelete = async (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: `Hapus kode produk: ${id} ?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              // Lakukan proses penghapusan
              console.log(`Produk dengan kode ${id} telah dihapus.`);
              const productsId = id.slice(0, 8);
              const colorId = id.slice(8, 11);
              const typeId = id.slice(11, 12);
              const conesId = id.slice(12, 13);
              const sizeId = id.slice(13, 15);
              const amountId = id.slice(15, 16);
              const colorRef = doc(
                db,
                "products",
                productsId,
                "warna",
                colorId
              );
              const typeRef = doc(colorRef, "jenis", typeId);
              const conesRef = doc(typeRef, "kones", conesId);
              const sizeRef = doc(conesRef, "ukuran", sizeId);
              const amountRef = doc(sizeRef, "jumlah", amountId);
              await deleteDoc(amountRef);
              setData(data.filter((item) => item.id !== id));
            } catch (err) {
              console.log(err);
            }
          },
        },

        {
          label: "Batal",
          onClick: () => {
            console.log(`Penghapusan produk dengan kode ${id} dibatalkan.`);
          },
        },
      ],
    });
  };

  const deleteDataKirim = async (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: `Hapus data: ${id} ?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              const docRef = doc(db, database, id);
              const docSnapshot = await getDoc(docRef);
              console.log(docSnapshot);
              if (docSnapshot.exists()) {
                // Retrieve the value of the "img" field
                // const imgURL = docSnapshot.data().img;
                // const pathStartIndex = imgURL.indexOf("/o/") + 3;
                // const pathEndIndex = imgURL.indexOf("?alt=");
                // const filePath = decodeURIComponent(
                //   imgURL.substring(pathStartIndex, pathEndIndex)
                // );
                // if (filePath) {
                //   // Create a reference to the file to delete
                //   const deleteRef = ref(storage, filePath);
                //   // Delete the file
                //   deleteObject(deleteRef)
                //     .then(() => {
                //       console.log("file deleted");
                //     })
                //     .catch((error) => {
                //       console.log(error);
                //     });
                // }

                // Delete the document from the database
                await deleteDoc(docRef);

                // Update the data array, filtering out the deleted document
                setData(data.filter((item) => item.id !== id));
              } else {
                console.log("Document does not exist");
              }
            } catch (err) {
              console.log(err);
            }
          },
        },

        {
          label: "Batal",
          onClick: () => {
            console.log(`Penghapusan data dengan kode ${id} dibatalkan.`);
          },
        },
      ],
    });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Aksi",
      flex: 0.1,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {(database !== "products" && database !== "kirim") && (
              <div
                className="deleteButton"
                onClick={() => handleDelete(params.row.id)}
              >
                Hapus
              </div>
            )}
            {database === "products" && (
              <>
                <Link
                  to={`/kode/${params.row.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="viewButton">Detail</div>
                </Link>
                <div
                  className="deleteButton"
                  onClick={() => handleProductDelete(params.row.id)}
                >
                  Hapus
                </div>
              </>
            )}
            {database === "kirim" && (
              <div
                className="deleteButton"
                onClick={() => deleteDataKirim(params.row.id)}
              >
                Hapus
              </div>
            )}
          </div>
        );
      },
    },
  ];

  function customCheckbox() {
    return {
      "& .MuiCheckbox-root svg": {
        width: 16,
        height: 16,
        backgroundColor: "transparent",
        border: "1px solid",
        borderRadius: 2,
      },
      "& .MuiCheckbox-root svg path": {
        display: "none",
      },
      "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
        backgroundColor: "#1890ff",
        borderColor: "#1890ff",
      },
      "& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after": {
        position: "absolute",
        display: "table",
        border: "2px solid #fff",
        borderTop: 0,
        borderLeft: 0,
        transform: "rotate(45deg) translate(-50%,-50%)",
        opacity: 1,
        transition: "all .2s cubic-bezier(.12,.4,.29,1.46) .1s",
        content: '""',
        top: "50%",
        left: "39%",
        width: 5.71428571,
        height: 9.14285714,
      },
      "& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after":
        {
          width: 8,
          height: 8,
          backgroundColor: "#1890ff",
          transform: "none",
          top: "39%",
          border: 0,
        },
    };
  }

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color: "rgba(0,0,0,.85)",
    WebkitFontSmoothing: "auto",
    letterSpacing: "normal",
    "& .MuiDataGrid-columnsContainer": {
      backgroundColor: "#1d1d1d",
    },
    "& .MuiDataGrid-iconSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-columnHeader": {
      // borderRight: `1px solid #303030`,
      backgroundColor: "#ff9359",
      whiteSpace: "normal", // Allow wrapping for headers
      textWrap: "pretty",
      wordWrap: "break-word", // Break long words in headers
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
      // borderBottom: `1px solid #303030`,

      justifyContent: "center",
      // borderRight: `1px solid #303030`,
    },
    "& .MuiDataGrid-cell": {
      color: "rgba(0,0,0,.85)",
      textAlign: "center",
      width: "100px",
      whiteSpace: "normal", // Allow wrapping
      wordWrap: "break-word", // Break long words
    },
    "& .MuiPaginationItem-root": {
      borderRadius: 0,
    },
    "& .MuiDataGrid-columnHeaderTitleContainer": {
      justifyContent: "center",
    },
    "& .MuiDataGrid-virtualScroller": {
      overflowY: "visible",
    },
    "& .MuiDataGrid-row": {
      // overflowY: 'hidden',
    },
    ...customCheckbox(theme),
  }));

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {title}
        <Link to={newPath} className="link">
          Tambah Data
        </Link>
      </div>
      <StyledDataGrid
        rows={data}
        columns={database !== "stok" ? source.concat(actionColumn) : source}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 4 } },
        }}
        // pageSizeOptions={[4, 8, 16]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
      />
    </div>
  );
};

export default Datatable;
