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
  const [guide, setGuide] = useState(false);
  const productsId = produkId.slice(0, 8);
  const colorId = produkId.slice(8, 11);
  const typeId = produkId.slice(12, 13);
  const conesId = produkId.slice(12, 13);
  const sizeId = produkId.slice(13, 15);
  const amountId = produkId.slice(15, 16);
  const writeTag = produkId.slice(8, 16);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/kode");
  };
  const handleGuide = () => {
    setGuide(true);
  };
  const handleClosePopup = () => {
    setGuide(false);
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

        const colorId = produkId.slice(8, 11);
        const typeId = produkId.slice(11, 12);
        const conesId = produkId.slice(12, 13);
        const sizeId = produkId.slice(13, 15);
        const amountId = produkId.slice(15, 16);
        console.log(colorId, typeId, conesId, sizeId, amountId);
        const colorDocRef = doc(productDocRef, "warna", colorId);
        const colorSnapshot = await getDoc(colorDocRef);
        if (colorSnapshot.exists()) {
          const colorData = colorSnapshot.data();

          const typeDocRef = doc(colorDocRef, "jenis", typeId);
          const typeSnapshot = await getDoc(typeDocRef);
          if (typeSnapshot.exists()) {
            const typeData = typeSnapshot.data();

            const coneDocRef = doc(typeDocRef, "kones", conesId);
            const coneSnapshot = await getDoc(coneDocRef);
            if (coneSnapshot.exists()) {
              const coneData = coneSnapshot.data();

              const sizeDocRef = doc(coneDocRef, "ukuran", sizeId);
              const sizeSnapshot = await getDoc(sizeDocRef);
              if (sizeSnapshot.exists()) {
                const sizeData = sizeSnapshot.data();

                const amountDocRef = doc(sizeDocRef, "jumlah", amountId);
                const amountSnapshot = await getDoc(amountDocRef);
                if (amountSnapshot.exists()) {
                  const amountData = amountSnapshot.data();
                  const fetchedData = {
                    ...productsData,
                    ...colorData,
                    ...typeData,
                    ...coneData,
                    ...sizeData,
                    ...amountData,
                  };
                  console.log(fetchedData);

                  setData(fetchedData);
                }
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
                  <span className="itemKey">
                    Warna <b>({colorId})</b>:
                  </span>
                  <span className="itemValue">{data.color}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Nomor <b>({colorId})</b>:
                  </span>
                  <span className="itemValue">{data.number}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Jenis <b>({typeId})</b>:
                  </span>
                  <span className="itemValue">{data.type} </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Kones <b>({conesId})</b>:
                  </span>
                  <span className="itemValue">{data.variant}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Berat <b>({sizeId})</b>:
                  </span>
                  <span className="itemValue">{data.weight}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">
                    Stok <b>({amountId})</b>:
                  </span>
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
          <div className="up">
            <h1 className="title">Angka Untuk Re-Write Tag: {writeTag}</h1>
            <button onClick={handleGuide}>PANDUAN</button>
          </div>
          <div className="down">
            {guide && (
              <div className="popup show">
                <div className="popup-inner">
                  <p>Panduan Re-Write Tag di Aplikasi Electron:</p>
                  <div className="imgContainer">
                    <img style={{width: "25vw"}}
                      src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/Electron%20HW-VX6330K%20demo.png?alt=media&token=f2909959-29d0-47a7-8432-f373560f6ef8"
                      alt="Panduan Kode"
                    />
                    <img style={{width: "40vw"}}
                      src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/Electron%20Write%20UHF%20Tag.png?alt=media&token=0978a799-77d9-4879-a340-63c481ed4217"
                      alt="Panduan Kode"
                    />
                  </div>
                  <ul>
                    <li>Letakkan Tag di Atas Reader</li>
                    <li>
                      Hubungkan Reader dan Laptop Menggunakan Kabel RS232 to USB
                    </li>
                    <li>
                      Buka Aplikasi Electron HwVx6330K Demo, Klik "Open COM Port".  
                    </li>
                    <li>
                    Setelah itu Klik "Get Work Mode Parameter", Atur Work Mode ke Answer Mode.
                    </li>
                    <li>
                    Setelah itu Klik "ClosePort", lalu Tutup Aplikasi.
                    </li>
                    <li>
                      Buka Aplikasi Electron Write UHF Tag, Klik Start pada Kolom "New Tag".
                    </li>
                    <li>
                      Kemudian Klik Start pada Kolom "Randomized Tag", lalu Klik Stop di Tombol Sebelumnya
                    </li>
                    <li>
                      Pada Kolom "Written Tag" Masukkan Angka Prefix(hex) dan Next(int) sesuai di Tabel Detail, lalu Klik Start
                    </li>
                    <li>
                      Tag Berhasil dilakukan re-Write Jika Kolom Bertambah Baris Angka Berwarna Hijau, Jika Berhasil, Tutup Aplikasi
                    </li>
                  </ul>
                  <button onClick={handleClosePopup}>Tutup</button>
                </div>
              </div>
            )}
            <List write={writeTag} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
