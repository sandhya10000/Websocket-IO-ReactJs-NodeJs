import { Container, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socketRef = useRef(null); // Store socket in a ref

  const handleSubmit = (e) => {};
  useEffect(() => {
    // ✅ Initialize socket only once
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current.id);
    });

    socketRef.current.on("Welcome", (msg) => {
      console.log("📩 Server says:", msg);
    });

    // ✅ Cleanup to avoid memory leaks or multiple connections
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography varient="h1" component="div" gutterBottom>
        Welcome to Socket.io
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField id="outlined-basic" label="Outlined" varient="outlined" />
        <Button variant="contained" color="primary"></Button>
      </form>
    </Container>
  );
};

export default App;
