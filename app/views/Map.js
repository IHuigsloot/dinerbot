// window.navigator.userAgent = "react-native";
import React, { useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
const io = require("socket.io-client");

import Canvas from 'react-native-canvas';

import Header from '../components/header';
import { environment } from '../environment/environment';

export default function Map({ navigation }) {
  const [location, setLocation] = React.useState('')

  const canvasRef = useRef(null);
  let socket; 

  useEffect(() => {
    if (!socket) {
      socket = io(environment.api_url);

      socket.on("connect", () => {
        console.log("connected");
      });

      // Error handlings
      socket.on("error", (error) => {
        console.log(error);
      });

      socket.on("connect_error", (error) =>
        console.log(error)
      );

      socket.on("update", (data) => {
        console.log(data);
      });
    }

    return () => {
      console.log('close connection');
      socket.disconnect();
    }
  }, [])

  React.useEffect(() => {
    handleCanvas();
  }, [location])
  
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

  const getMarkerPosition = value => {
    const charNum = letters.indexOf(value[0]) + 1;
    const num = value[2] ? value[1] + value[2] : value[1];

    const y = num * 40 - 20;
    const x = charNum * 40 - 20;
    return {x, y}
  }

  const setMarker = (ctx, coordinate) => {
    const mp = getMarkerPosition(coordinate);
    ctx.beginPath();
    ctx.arc(mp.x, mp.y, 9, 0, Math.PI * 2, true);
    ctx.fill();
  }

  const setPathing = (ctx, begin, end) => {
    mp = getMarkerPosition(begin);
    ctx.moveTo(mp.x, mp.y);
    mp = getMarkerPosition(end);
    ctx.lineTo(mp.x, mp.y);
    ctx.stroke();
  }


  const handleCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    setMarker(ctx, location);
  }

  return (
    <View>
      <Header title="Map" home />
      <Image source={require('../img/map.jpeg')} style={{marginTop: 12, marginHorizontal: 6, height: 400, width: 400}} ></Image>
      <Canvas style={{top: 68, left: 6, position: "absolute"}} ref={canvasRef} />
    </View>
  )
}
