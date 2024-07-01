import React, { useEffect, useState } from "react";
import "./video.scss";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { SketchPicker } from "react-color";

const Video = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentColor, setCurrentColor] = useState({ r: 255, g: 255, b: 255 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleChange = (color) => {
    setCurrentColor(color.rgb);
  };

  const handlePickColor = (e) => {
    const img = e.target;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const rect = img.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    const pixel = context.getImageData(x, y, 1, 1).data;
    const rgbColor = { r: pixel[0], g: pixel[1], b: pixel[2] };

    setCurrentColor(rgbColor);
  };

  const handleColor = async (e) => {
    e.preventDefault();
    const data = {
      bgrValues: [
        currentColor.b,
        currentColor.g,
        currentColor.r,
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

  const pickerStyles = {
    default: {
      picker: {
      },
    },
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

  const handleActivate = async () => {
    try {
      const response = await fetch("/video");
      if (response.ok) {
        const url = "/video";
        setVideoUrl(url);
        localStorage.setItem("videoUrl", url);
        setImgLoaded(false); // Reset image loaded state
      } else {
        console.error("Failed to fetch video URL");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleShutdown = async () => {
    try {
      const response = await fetch("/release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setVideoUrl("https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/there-is-no-connected-camera.jpg?alt=media&token=e512eeb6-d19d-4826-abca-bc54169aa2ee");
        localStorage.removeItem("videoUrl");
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    const storedVideoUrl = localStorage.getItem("videoUrl");
    if (storedVideoUrl) {
      setVideoUrl(storedVideoUrl);
    }
    return () => {
      localStorage.removeItem("videoUrl");
    };
  }, []);

  return (
    <div className="video">
      <div className="left">
        <span className="videoTitle">TAMPILAN KAMERA</span>
        <span className="cam">
          {videoUrl === "/video" ? (
            <img
              src={videoUrl}
              alt="Video tidak tersedia"
              onClick={handlePickColor}
              onLoad={() => setImgLoaded(true)}
            />
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
        </form>
        <div className="colorPicker">
          <SketchPicker
            color={currentColor}
            onChangeComplete={handleChange}
            styles={pickerStyles}
            disableAlpha
          />
        </div>
        <div className="button">
          <button onClick={handleActivate} id="activate">
            Aktifkan Kamera
          </button>
          <button type="submit" id="change" form="formColor" disabled={!imgLoaded}>
            Atur Tampilan
          </button>
          <button onClick={handleReset} id="reset" disabled={!imgLoaded}>
            Reset Tampilan
          </button>
          <button onClick={handleShutdown} id="shutdown" disabled={!imgLoaded}>Matikan Kamera</button> 
        </div>
      </div>
      <div className="right">
      {videoUrl === "/video" ? (
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
