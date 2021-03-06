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
    const flights = await Flight.findById(req.params.flightId);
    res.json(flights);
  } catch (err) {
    res.json({ message: err });
  }
});

router.put("/updateAddFilledIntoFlight/:id", async (req, res) => {
  const flight = req.body;
  const filled = flight.filled
  const filledPlusOne = filled + 1;
  flight['filled'] = filledPlusOne

  Flight.findByIdAndUpdate({ _id: flight._id }, flight)
    .then(function() {
      Flight.findOne({ _id: flight._id }).then(function(flight) {
        res.send(flight);
      });
    })
    .catch(err => console.log(err));
});

router.put("/update/:id", async (req, res)=>{
  const flight = req.body;

  Flight.findByIdAndUpdate({_id: flight._id}, flight).then(resp =>{
    res.send(resp)
  }).catch(err => console.log(err))
})

router.put("/updateSubsFilledIntoFlight/:id", async (req, res) => {
  const flight = req.body;
  const filled = flight.filled
  const filledMinusOne = filled - 1;
  flight['filled'] = filledMinusOne

  if(flight['capacity']-flight['filled'] <= 0) flight['status'] = "FULL"

  Flight.findByIdAndUpdate({ _id: flight._id }, flight)
    .then(function() {
      Flight.findOne({ _id: flight._id }).then(function(flight) {
        res.send(flight);
      });
    })
    .catch(err => console.log(err));
});

router.put("/cancelFlight/:id", async (req, res) => {
  const flight = req.body;
  flight['status'] = "CANCELLED"

  Flight.findByIdAndUpdate({ _id: flight._id }, flight)
    .then(function() {
      Flight.findOne({ _id: flight._id }).then(function(flight) {
        res.send(flight);
      });
    })
    .catch(err => console.log(err));
})

router.post("/admin/add", async (req, res) => {
  const flight = new Flight({
    airlineid: req.body.airlineid,
    airline: req.body.airline,
    flight: req.body.flight,
    flightid: req.body.flightid,
    flightname: req.body.flightname,
    capacity: req.body.capacity,
    filled: req.body.filled,
    dest: req.body.dest,
    depart: req.body.depart,
    time: req.body.time,
    fares: req.body.fares,
    date: req.body.date,
    status: req.body.status
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

router.post("/search", async (req, res) => {
  try {
    const obj = {
      flightid: req.body.flightid,
      airline: req.body.airline,
      airlineid: req.body.airlineid,
      flightname: req.body.flightname,
      date: req.body.date,
      time: req.body.time,
      capacity: req.body.capacity,
      filled: req.body.filled,
      depart: req.body.depart,
      dest: req.body.dest,
      fares: req.body.fares,
      status: req.body.status
    };

    const flights = await Flight.find();

    let our_flight = null;
    for (let i = 0; i < flights.length; i++) {
      let curr = flights[i];
      if (curr.flightid === obj.flightid) {
        our_flight = curr;
        break;
      }
    }

    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (our_flight[key] !== obj[key]) {
        //THERE IS A DATA COHERENCE PROBLEM
        res.sendStatus(417);
        return;
      }
    }
    //ALL DATA IS GOOD
    res.sendStatus(200);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
