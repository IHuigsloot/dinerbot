import React, { useState, useEffect, useRef } from "react";
import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";
import Canvas from "react-native-canvas";

export default function DeliveryMap(props) {
  const { colors } = useTheme();
  const [location, setLocation] = useState('');
  const [pathList, setPathList] = useState([]);

  const [destinations] = useState([
    {house: 'B5', destination: 'C5'},
    {house: 'B7', destination: 'B8'},
    {house: 'B9', destination: 'C9'},
    {house: 'C1', destination: 'C2'},
    {house: 'E1', destination: 'E2'},
    {house: 'E5', destination: 'E6'},
    {house: 'G4', destination: 'H4'},
    {house: 'H2', destination: 'H3'},
    {house: 'J6', destination: 'I6'},
    {house: 'D10', destination: 'D9'},
    {house: 'F10', destination: 'F9'},
    {house: 'I10', destination: 'H10'}
  ])

  const canvasPathRef = useRef(null);
  const canvasMarkerRef = useRef(null);
  const canvasDestinationsRef = useRef(null);

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  
  useEffect(() => {
    const difference = arrayDiff(props.path || [], pathList);
    props.location ? setLocation(props.location) : null;
    props.path && difference.length > 0 ? setPathList(props.path) : null;
  }, [props.location, props.path])
  
  useEffect(() => {
    handleMarkerCanvas();
  }, [location])
  
  useEffect(() => {
    handlePathCanvas();
  }, [pathList])

  useEffect(() => {
    handleDestinationsCanvas();
  }, [props.destinations])

  const arrayDiff = (a, b) => {
    return [
      ...a.filter(x => !b.includes(x)),
      ...b.filter(x => !a.includes(x))
    ];
  };

  const getMarkerPosition = (value) => {
    const charNum = letters.indexOf(value[0]) + 1;
    const num = value[2] ? 
      value[1] + value[2] : 
      value[1];

    const x = charNum * 40 - 20;
    const y = num * 40 - 20;
    return { x, y };
  };

  const getDestinationPosition = (value) => {
    const charNum = letters.indexOf(value[0]);
    const num = value[2] ? 
      value[1] + value[2] : 
      value[1];

    const x = charNum * 40 + 5;
    const y = num * 40 - 5;
    return { x, y };
  };

  const setMarker = (ctx, location) => {
    if (!location) { return; }

    const coordinate = getMarkerPosition(location);
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(coordinate.x, coordinate.y, 9, 0, Math.PI * 2, true);
    ctx.fill();
  };

  const setPathing = (ctx) => {
    if (!pathList.length > 0) { return; }

    let coordinate = getMarkerPosition(pathList[0]);
    ctx.lineWidth = 4;
    ctx.strokeStyle = colors.accent;
    
    ctx.moveTo(coordinate.x, coordinate.y);
    pathList.map((item) => {
      coordinate = getMarkerPosition(item);
      ctx.lineTo(coordinate.x, coordinate.y);
    });
    ctx.stroke();
  };

  const setDestinationText = (ctx) => {
    ctx.fillStyle = 'white';
    ctx.font = 'bolder 15px Arial';
    destinations.map(destination => {
      let coordinate = getDestinationPosition(destination.house);
      ctx.fillText(destination.destination, coordinate.x, coordinate.y);
    })
  }

  const handleMarkerCanvas = () => {
    const canvas = canvasMarkerRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setMarker(ctx, location);
    }
  };

  const handlePathCanvas = () => {
    const canvas = canvasPathRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setPathing(ctx);
    }
  }; 

  const handleDestinationsCanvas = () => {
    const canvas = canvasDestinationsRef.current;
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 400;
      setDestinationText(ctx);
    }
  };

  return (
    <View>
    {props.destinations ? (
      <>
        <Image
          source={require("../img/map.jpeg")}
          style={{ marginTop: 12, marginHorizontal: 6, height: 400, width: 400 }}
        ></Image>
        <Canvas
          style={{ top: 12, left: 6, position: "absolute" }}
          ref={canvasDestinationsRef}
        />
      </>
    ) : (
      <>
        <Image
          source={require("../img/map.jpeg")}
          style={{ marginTop: 0, marginHorizontal: 6, height: 400, width: 400 }}
        ></Image>
        <Canvas
          style={{ top: 0, left: 6, position: "absolute" }}
          ref={canvasPathRef}
        />
        <Canvas
          style={{ top: 0, left: 6, position: "absolute" }}
          ref={canvasMarkerRef}
        />
      </>
    )}
    </View>
  );
}
