import React, { useState, useEffect, useRef } from "react";
import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";
import Canvas from "react-native-canvas";

export default function DeliveryMap(props) {
  const { colors } = useTheme();
  const [location, setLocation] = useState('');
  const [pathList, setPathList] = useState([]);
  
  const canvasRef = useRef(null);

  useEffect(() => {
    if (props.location) {
      setLocation(props.location)
    }
    if (props.path) {
      setPathList(props.path);
    }
    handleCanvas();
  }, [props])

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const getMarkerPosition = (value) => {
    const charNum = letters.indexOf(value[0]) + 1;
    const num = value[2] ? value[1] + value[2] : value[1];

    const y = num * 40 - 20;
    const x = charNum * 40 - 20;
    return { x, y };
  };

  const setMarker = (ctx, coordinate) => {
    if (!coordinate) {
      return;
    }
    const mp = getMarkerPosition(coordinate);
    ctx.beginPath();
    ctx.arc(mp.x, mp.y, 9, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const setPathing = (ctx) => {
    if (!pathList.length > 0) {
      return;
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = colors.accent;
    let mp = getMarkerPosition(pathList[0]);
    ctx.moveTo(mp.x, mp.y);
    pathList.map((item) => {
      mp = getMarkerPosition(item);
      ctx.lineTo(mp.x, mp.y);
    });
    ctx.stroke();
  };

  const handleCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    setPathing(ctx);
    setMarker(ctx, location);
  };

  return (
    <View>
      <Image
        source={require("../img/map.jpeg")}
        style={{ marginTop: 12, marginHorizontal: 6, height: 400, width: 400 }}
      ></Image>
      <Canvas
        style={{ top: 13, left: 6, position: "absolute" }}
        ref={canvasRef}
      />
    </View>
  );
}
