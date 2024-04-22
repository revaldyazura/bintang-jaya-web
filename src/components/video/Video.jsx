import React, { useEffect, useState } from "react";
import "./video.scss";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { colorInputs } from "../../colorSource";

const Video = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [inputs, setInputs] = useState(colorInputs);

  const handleColor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      colorName: formData.get("colorname"),
      bgrValues: [
        parseInt(formData.get("biru")),
        parseInt(formData.get("hijau")),
        parseInt(formData.get("merah")),
      ],
    };

    try {
      const response = await fetch("/add_color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        console.log("Color added successfully");
      } else {
        console.error("Failed to add color");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const handleReset = async () => {
    try {
      const response = await fetch("/reset_colors", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        console.log("Color reset successfully");
      } else {
        console.error("Failed to reset color");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const getLabel = (label) => {
    if (label === "Nama Warna") {
      return "nama";
    } else if (label === "Biru") {
      return "biru";
    } else if (label === "Hijau") {
      return "hijau";
    } else if (label === "Merah") {
      return "merah";
    }
  };

  const handleActivate = async () => {
    try {
      const response = await fetch("/video");
      if (response.ok) {
        const url = "/video";
        setVideoUrl(url);
        localStorage.setItem("videoUrl", url);
      } else {
        console.error("Failed to fetch video URL");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    // const savedVideoUrl = localStorage.getItem("videoUrl");
    // if (savedVideoUrl) {
    //   setVideoUrl(savedVideoUrl);
    // } else {
    //   fetchVideoUrl();
    // }
    return () => {
      localStorage.removeItem("videoUrl");
    };
  }, []);

  return (
    <div className="video">
      <div className="left">
        <span className="videoTitle">TAMPILAN KAMERA</span>
        <span className="cam">
          {videoUrl ? (
            <img src={videoUrl} alt="Video tidak tersedia" />
          ) : (
            <img
              src="https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/there-is-no-connected-camera.jpg?alt=media&token=e512eeb6-d19d-4826-abca-bc54169aa2ee"
              alt="Tidak ada koneksi internet"
            />
          )}
        </span>
      </div>
      <div className="center">
        <form onSubmit={handleColor} id="formColor">
          {inputs.map((input) => (
            <div className="formInput" key={input.id}>
              <label className={getLabel(input.label)}>{input.label}</label>
              <input
                id={input.id}
                type={input.type}
                placeholder={input.placeholder}
                name={input.id}
                required
              />
            </div>
          ))}
        </form>
        <div className="button">
          <button onClick={handleActivate} id="activate">
            Aktifkan Kamera
          </button>
          <button type="submit" id="change" form="formColor">
            Atur Tampilan
          </button>
          <button onClick={handleReset} id="reset">
            Reset Tampilan
          </button>
        </div>
      </div>
      <div className="right">
        {videoUrl ? (
          <VideocamIcon
            className="icon"
            style={{
              color: "royalblue",
              backgroundColor: "rgba(0, 134, 217, 0.3)",
            }}
          />
        ) : (
          <VideocamOffIcon
            className="icon"
            style={{
              color: "royalblue",
              backgroundColor: "rgba(0, 134, 217, 0.3)",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
