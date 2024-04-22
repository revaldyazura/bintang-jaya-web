import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import StoreIcon from "@mui/icons-material/Store";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";

const Widget = ({ type, idPath }) => {
  const [amount, setAmount] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "PENGGUNA",
        isMoney: false,
        link: "Lihat Semua Pengguna",
        query: "users",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "stok":
      data = {
        title: "STOK",
        isMoney: false,
        link: "Lihat Data Stok",
        query: "stok",
        icon: (
          <StoreIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218, 165, 32, 0.2)",
            }}
          />
        ),
      };
      break;
    case "kirim":
      data = {
        title: "DIKIRIM",
        isMoney: false,
        link: "Lihat Barang Terkirim",
        query: "kirim",
        icon: (
          <LocalShippingIcon
            className="icon"
            style={{
              color: "green",
              backgroundColor: "rgba(0, 128, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
      const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

      const lastMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", lastMonth)
      );
      const prevMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", lastMonth),
        where("timeStamp", ">", prevMonth)
      );

      const totalDataQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", today)
      );

      const lastMonthData = await getDocs(lastMonthQuery);
      const prevMonthData = await getDocs(prevMonthQuery);
      const totalData = await getDocs(totalDataQuery);


      // const docRef = doc(db, data.query);
      // const getData = await getDoc(docRef);
      // const totalData = getData.data();

      setAmount(totalData.docs.length);
      // setDiff(
      //   ((lastMonthData.docs.length - prevMonthData.docs.length) /
      //     prevMonthData.docs.length) *
      //     100
      // );
    };
    fetchData();
  }, []);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <Link to={idPath} style={{ textDecoration: "none" }}>
        <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        {/* <div className={`percentage ${diff < 0 ? "negative" : "positive"} `}>
          {diff < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          {diff}%
        </div> */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
