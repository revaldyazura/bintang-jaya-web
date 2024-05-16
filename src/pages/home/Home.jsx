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

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          {(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2" ||
            uid === "RedXGnEg9cTjjV8i6lKC0yQVf3H3") && (
            <Widget type="user" idPath="pengguna" />
          )}
          <Widget type="stok" idPath="stok" />
          <Widget type="kirim" idPath="kirim" />
        </div>
        <div className="videoContainer">
          <Video />
        </div>
      </div>
    </div>
  );
};

export default Home;
