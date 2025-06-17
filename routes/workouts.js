const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(20);
    
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent workouts for dashboard
router.get('/recent', auth, async (req, res) => {
  try {
    const recentWorkouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(5);
    
    res.json(recentWorkouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new workout
router.post('/', auth, async (req, res) => {
  try {
    const { exercises, duration, notes } = req.body;

    const workout = new Workout({
      user: req.user._id,
      exercises,
      duration,
      notes
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update workout
router.put('/:id', auth, async (req, res) => {
  try {
    const { exercises, duration, notes } = req.body;
    
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { exercises, duration, notes },
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;