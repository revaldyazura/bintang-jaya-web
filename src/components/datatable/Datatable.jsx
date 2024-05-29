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
          } else if (database === "users") {
            list.push({ id: doc.id, ...doc.data() });
          } else if (database === "products") {
            const productData = doc.data();
            const productId = doc.id;

            // Nested listener for 'warna'
            const warnaSub = onSnapshot(
              collection(db, `products/${productId}/warna`),
              (warnaSnapshot) => {
                warnaSnapshot.docs.forEach((warnaDoc) => {
                  const warnaData = warnaDoc.data();
                  const warnaId = warnaDoc.id;

                  const sizeSubs = onSnapshot(
                    collection(
                      db,
                      `products/${productId}/warna/${warnaId}/ukuran`
                    ),
                    (sizeSnapshot) => {
                      sizeSnapshot.docs.forEach((sizeDoc) => {
                        const sizeData = sizeDoc.data();
                        const sizeId = sizeDoc.id;

                        const coneSubs = onSnapshot(
                          collection(
                            db,
                            `products/${productId}/warna/${warnaId}/ukuran/${sizeId}/cones`
                          ),
                          (coneSnapshot) => {
                            coneSnapshot.docs.forEach((coneDoc) => {
                              const coneData = coneDoc.data();
                              const coneId = coneDoc.id;

                              const detailSubs = onSnapshot(
                                collection(
                                  db,
                                  `products/${productId}/warna/${warnaId}/ukuran/${sizeId}/cones/${coneId}/details`
                                ),
                                (detailSnapshot) => {
                                  detailSnapshot.docs.forEach((detailDoc) => {
                                    const detailData = detailDoc.data();
                                    const detailId = detailDoc.id;
                                    const combinedId = `${productId}${warnaId}${sizeId}${coneId}${detailId}`;
                                    const completeData = {
                                      id: combinedId,
                                      ...productData,
                                      ...warnaData,
                                      ...sizeData,
                                      ...coneData,
                                      ...detailData,
                                    };
                                    console.log(completeData);
                                    // Update list with new data structure
                                    list = list.filter(
                                      (item) => item.id !== combinedId
                                    ); // Remove old entry if exists
                                    list.push(completeData);
                                    setData([...list]); // Update state to trigger re-render
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

  const handleUserDelete = async (id) => {
    try {
      alert(`Hapus pengguna: ${id} ?`);
      await deleteDoc(doc(db, database, id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleProductDelete = async (id) => {
    try {
      alert(`Hapus kode produk: ${id} ?`);
      const productsId = id.slice(0, 8);
      const colorId = id.slice(8, 10);
      const sizeId = id.slice(10, 12);
      const conesId = id.slice(12, 14);
      const detailsId = id.slice(14, 16);
      const docRef = doc(
        db,
        "products",
        productsId,
        "warna",
        colorId,
        "ukuran",
        sizeId,
        "cones",
        conesId,
        "details",
        detailsId
      );
      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDataKirim = async (id) => {
    try {
      // Fetch the document from the database
      alert(`Delete row with id: ${id}`);
      const docRef = doc(db, database, id);
      const docSnapshot = await getDoc(docRef);
      console.log(docSnapshot);
      if (docSnapshot.exists()) {
        // Retrieve the value of the "img" field
        const imgNameValue = docSnapshot.data().imgName;
        if (imgNameValue) {
          // Create a reference to the file to delete
          const deleteRef = ref(storage, imgNameValue);
          // Delete the file
          deleteObject(deleteRef)
            .then(() => {
              console.log("file deleted");
            })
            .catch((error) => {
              console.log(error);
            });
        }

        // Delete the document from the database
        await deleteDoc(docRef);

        // Update the data array, filtering out the deleted document
        // setData(data.filter((item) => item.id !== id));
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
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
            {/* <Link to={idPath} style={{ textDecoration: "none" }}>
              <div className="viewButton">Lihat</div>
            </Link> */}
            {/* {database === "stok" && <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Kirim
            </div>} */}
            {database === "users" && (
              <div
                className="deleteButton"
                onClick={() => handleUserDelete(params.row.id)}
              >
                Hapus
              </div>
            )}
            {database === "products" && (
              <>
                <Link
                  to={`/produk/${params.row.id}`}
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
      justifyContent: "center"
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
        pageSize={9}
        rowsPerPageOptions={[9]}
        // initialState={{
        //   ...data.initialState,
        //   pagination: { paginationModel: { pageSize: 5 } },
        // }}
        // pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
      />
    </div>
  );
};

export default Datatable;
