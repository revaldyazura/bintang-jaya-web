import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, NuseNavigate, useNavigate } from "react-router-dom";
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
    // const fetchData = async () => {
    //   let list = [];
    //   try {
    //     const querySnapshot = await getDocs(collection(db, "users"));
    //     querySnapshot.forEach((doc) => {
    //       list.push({ id: doc.id, ...doc.data() });
    //     });
    //     setData(list);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // fetchData();

    // LISTEN REAL-TIME
    const unsub = onSnapshot(
      collection(db, database),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          if (database !== "users") {
            const data = doc.data();
            const id = doc.id;
            const createdAtTimestamp = data.timeStamp; // Access the timestamp field
            const createdAtDate = createdAtTimestamp.toDate(); // Convert to JavaScript Date
            list.push({ id, ...data, timeStamp: createdAtDate });
          } else if (database === "users") {
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

  const handleUserDelete = async (id) => {
    try {
      await deleteDoc(doc(db, database, id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const deleteDataKirim = async (id) => {
    try {
      // Fetch the document from the database
      const docRef = doc(db, database, id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // Retrieve the value of the "img" field
        const imgNameValue = docSnapshot.data().imgName;
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
    },
    "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
      // borderBottom: `1px solid #303030`,
      // borderRight: `1px solid #303030`,
    },
    "& .MuiDataGrid-cell": {
      color: "rgba(0,0,0,.85)",
      width: "100px",
    },
    "& .MuiPaginationItem-root": {
      borderRadius: 0,
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
