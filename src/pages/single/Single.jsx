import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate, useParams } from "react-router-dom";

const Single = ({ database }) => {
  const { produkId } = useParams();
  const [data, setData] = useState([]);
  const productsId = produkId.slice(0, 8);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/produk");
  };

  // console.log(database)
  const fetchData = async () => {
      try {
        // Construct a query to fetch data from the "products" collection
        console.log(productsId);
        const productDocRef = doc(db, "products", productsId);
        const productSnapshot = await getDoc(productDocRef);

        if (productSnapshot.exists()) {
          // Extract the data from the query snapshot
          const productsData = productSnapshot.data();

          const colorId = produkId.slice(8, 10);
          const sizeId = produkId.slice(10, 12);
          const conesId = produkId.slice(12, 14);
          const detailsId = produkId.slice(14, 16);
          console.log(colorId, detailsId, sizeId, conesId);
          // const colorDocRef = doc(db, "products", firstEightDigits, sixDigitsColor, twoDigitsColorDetail)
          const colorDocRef = doc(productDocRef, "warna", colorId);
          const colorSnapshot = await getDoc(colorDocRef);
          if (colorSnapshot.exists()) {
            const colorData = colorSnapshot.data();

            const sizeDocRef = doc(colorDocRef, "ukuran", sizeId);
            const sizeSnapshot = await getDoc(sizeDocRef);
            if (sizeSnapshot.exists()) {
              const sizeData = sizeSnapshot.data();

              const coneDocRef = doc(sizeDocRef, "cones", conesId);
              const coneSnapshot = await getDoc(coneDocRef);
              if (coneSnapshot.exists()) {
                const coneData = coneSnapshot.data();

                const detailDocRef = doc(coneDocRef, "details", detailsId);
                const detailSnapshot = await getDoc(detailDocRef);
                if (detailSnapshot.exists()) {
                  const detailData = detailSnapshot.data();
                  const fetchedData = {
                    ...productsData,
                    ...colorData,
                    ...detailData,
                    ...sizeData,
                    ...coneData,
                  };
                  console.log(fetchedData);

                  setData(fetchedData);
                  // return fetchedData;
                } else {
                  console.log("no doc found in details collection");
                }
              } else {
                console.log("no doc found in cones collection");
              }
            } else {
              console.log("no doc found in size collection");
            }
          } else {
            console.log("no doc found in color collection");
          }
          return productsData;
        } else {
          console.log("No matching document found in 'products' collection.");
          return null;
        }
      } catch (error) {
        console.error("Error fetching data from 'products' collection:", error);
        return [];
      }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton">
              <button onClick={handleBack}>Kembali</button>
            </div>
            <h1 className="title">{produkId}</h1>
            <div className="item">
              <img
                src={
                  data.img ||
                  "https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/no-image.jpg?alt=media&token=9d31b16b-9657-4107-8a2e-f223f4207a7b"
                }
                alt="gambar produk"
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.product}</h1>
                <div className="detailItem">
                  <span className="itemKey">Warna:</span>
                  <span className="itemValue">{data.color}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Nomor:</span>
                  <span className="itemValue">{data.number}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Detail:</span>
                  <span className="itemValue">{data.specific}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Ketebalan:</span>
                  <span className="itemValue">{data.thickness}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Berat:</span>
                  <span className="itemValue">{data.weight}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Tinggi:</span>
                  <span className="itemValue">{data.height}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Stok:</span>
                  <span className="itemValue">{data.stock}</span>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="right">
            <Chart aspect={3 / 1} title="User Spending (Last 6 Months)" />
          </div> */}
        </div>
        <div className="bottom">
          <h1 className="title">Tabel ID: {produkId}</h1>
          <List product={data.product} warna={data.color} tebal={data.thickness} berat={data.weight} tinggi={data.height} detail={data.specific} nomor={data.number} stok={data.stock} />
        </div>
      </div>
    </div>
  );
};

export default Single;
