import { Container, Button, TextField, Typography, Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState();
  const [messages, setMessages] = useState([]);
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room }); // or just { message }
    setMessage("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("Welcome", (s) => {
      console.log("👋", s);
    });

    socket.on("receive-message", (data) => {
      console.log("📨 Received:", data);
      setMessage((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: 200 }} />
      <Typography variant="h4" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={messages}
          onChange={(e) => setMessage(e.target.value)}
          label="Message"
          variant="outlined"
          margin="normal"
        />
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          label="Room"
          id="outlined-basic"
          variant="outlined"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;
