import express from "express";
import { dataStore } from "../services/dataStore.js";

const router = express.Router();

router.get("/master", (req, res) => {
  const master = dataStore.getMasterData();
  res.json({ success: true, data: master });
});

router.get("/movie-seats/:movieId/:showtime", (req, res) => {
  const { movieId, showtime } = req.params;
  const bookedSeats = dataStore.getMovieBookedSeats(movieId, decodeURIComponent(showtime));
  res.json({ success: true, movieId, showtime, bookedSeats });
});

export default router;
