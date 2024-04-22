import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Chart from "../../components/chart/Chart";
import Featured from "../../components/featured/Featured";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Table from "../../components/table/Table";
import Widget from "../../components/widget/Widget";
import { AuthContext } from "../../context/AuthContext";
import "./home.scss";
import Video from "../../components/video/Video";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const uid = currentUser.uid;
  // const [videoUrl, setVideoUrl] = useState("");

  // useEffect(() => {
  //   fetchVideoUrl(); // Function to fetch video URL
  // }, []);

  // const fetchVideoUrl = async () => {
  //   try {
  //     // Fetch the video URL from backend
  //     const response = await fetch("/video");
  //     if (response.ok) {
  //       // If response is successful, set the videoUrl state
  //       setVideoUrl("/video");
  //     } else {
  //       // Handle error if response is not successful
  //       console.error("Failed to fetch video URL");
  //     }
  //   } catch (error) {
  //     // Handle any network errors
  //     console.error("Network error:", error);
  //   }
  // };

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
        <div className="videoContainer">
          <Video />
        </div>
        {/* <div className="charts">
          <Featured />
          <Chart aspect={2 / 1} title="Last 6 Months (Revenue)" />
        </div> */}
        {/* <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
