import React, { useContext, useEffect, useState } from "react";
import "./video.scss";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { SketchPicker } from "react-color";
import { AuthContext } from "../../context/AuthContext";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Video = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [currentColor, setCurrentColor] = useState({ r: 255, g: 255, b: 255 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  // const [flaskBaseUrl, setFlaskBaseUrl] = useState("");

  const uid = currentUser?.uid;

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
      bgrValues: [currentColor.b, currentColor.g, currentColor.r],
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
      picker: {},
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
      const response = await fetch("/activate_camera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const url = "/video";
        setVideoUrl(url);
        setIsVideoActive(true);
        setImgLoaded(false); // Reset image loaded state
      } else {
        console.error("Failed to activate camera");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleShutdown = async () => {
    try {
      const response = await fetch("/deactivate_camera", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setVideoUrl(
          "https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/there-is-no-connected-camera.jpg?alt=media&token=e512eeb6-d19d-4826-abca-bc54169aa2ee"
        );
        setIsVideoActive(false);
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    if (uid) {
      setIsAdmin(uid === "EaMqYgiaC0cTno7ch8W5Wi3f2np2");
    }
  }, [uid]);

  // useEffect(() => {
  //   const fetchConfig = async () => {
  //     try {
  //       const response = await fetch('https://revaldyazura.github.io/config-flask/config.json');
  //       const data = await response.json();
  //       setFlaskBaseUrl(data.flaskBaseUrl);
  //     } catch (error) {
  //       console.error("Failed to fetch configuration:", error);
  //     }
  //   };

  //   fetchConfig();
  // }, []);

  useEffect(() => {
    const checkCameraStatus = async () => {
      try {
        const response = await fetch("/camera_status");
        const result = await response.json();
        if (response.ok) {
          setIsVideoActive(result.isVideoActive);
          if (result.isVideoActive) {
            setVideoUrl("/video");
          } else {
            setVideoUrl("https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/there-is-no-connected-camera.jpg?alt=media&token=e512eeb6-d19d-4826-abca-bc54169aa2ee");
          }
        } else {
          console.error("Failed to fetch camera status");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
  
    checkCameraStatus();
  
    socket.on('camera_status', (data) => {  // Listen for 'camera_status' event
      setIsVideoActive(data.isVideoActive);
      if (data.isVideoActive) {
        setVideoUrl("/video");
      } else {
        setVideoUrl("https://firebasestorage.googleapis.com/v0/b/obras-7eb0b.appspot.com/o/there-is-no-connected-camera.jpg?alt=media&token=e512eeb6-d19d-4826-abca-bc54169aa2ee");
      }
    });
  
    return () => {
      socket.off('camera_status');  // Clean up the event listener on unmount
    };
  }, []);

  return (
    <div className="video">
      <div className="left">
        <span className="videoTitle">TAMPILAN KAMERA</span>
        <span className="cam">
          {isVideoActive ? (
            <img
              src={videoUrl}
              alt="Kamera belum tersedia"
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
        <form onSubmit={handleColor} id="formColor"></form>
        <div className="colorPicker">
          <SketchPicker
            color={currentColor}
            onChangeComplete={handleChange}
            styles={pickerStyles}
            disableAlpha
          />
        </div>
        <div className="button">
          {isAdmin && (
            <button onClick={handleActivate} id="activate">
              Aktifkan Kamera
            </button>
          )}
          <button
            type="submit"
            id="change"
            form="formColor"
            disabled={!imgLoaded}
          >
            Atur Tampilan
          </button>
          <button onClick={handleReset} id="reset" disabled={!imgLoaded}>
            Reset Tampilan
          </button>
          {isAdmin && (
            <button
              onClick={handleShutdown}
              id="shutdown"
              disabled={!imgLoaded}
            >
              Matikan Kamera
            </button>
          )}
        </div>
      </div>
      <div className="right">
        {isVideoActive ? (
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
