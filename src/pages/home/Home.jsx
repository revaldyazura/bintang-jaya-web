import { useContext } from "react";
import Chart from "../../components/chart/Chart";
import Featured from "../../components/featured/Featured";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Table from "../../components/table/Table";
import Widget from "../../components/widget/Widget";
import { AuthContext } from "../../context/AuthContext";
import "./home.scss";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const uid = currentUser.uid;
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          {uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" && (
            <Widget type="user" idPath="pengguna" />
          )}
          <Widget type="stok" idPath="stok" />
          <Widget type="kirim" idPath="kirim" />
          {/* <Widget type="balance" /> */}
        </div>
        {/* <div className="charts">
          <Featured />
          <Chart aspect={2 / 1} title="Last 6 Months (Revenue)" />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
