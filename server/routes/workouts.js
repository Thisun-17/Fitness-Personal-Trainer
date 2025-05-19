const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

// Get all workouts for the current user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new workout
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, exercises, difficulty, targetMuscleGroups } = req.body;
    
    const newWorkout = new Workout({
      title,
      description,
      exercises,
      difficulty,
      targetMuscleGroups,
      user: req.user.id
    });
    
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a workout
router.put('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { title, description, exercises, difficulty, targetMuscleGroups } = req.body;
    
    // Update fields
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        exercises, 
        difficulty, 
        targetMuscleGroups 
      },
      { new: true }
    );
    
    res.json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Workout.findByIdAndRemove(req.params.id);
    
    res.json({ message: 'Workout removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;