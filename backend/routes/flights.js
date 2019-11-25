const express = require("express");

const router = express.Router();

const Flight = require("../models/Flights");

router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/:flightId", async (req, res) => {
  try {
    const flights = await Flight.findById(req.params.customerId);
    res.json(flights);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const flight = new Flight({
    flightId: req.body.flightId,
    flightName: req.body.flightName,
    capacity: req.body.capacity,
    fillStatus: req.body.fillStatus,
    dest: req.body.dest,
    depart: req.body.depart,
    fares: req.body.depart
  });
  
  try {
    const saveFlight = await flight.save();
    res.json(saveFlight);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:flightId", async (req, res) => {
  try {
    const removeFlight = await Flight.remove({
      _id: req.params.flightId
    });
    res.json(removeFlight);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;