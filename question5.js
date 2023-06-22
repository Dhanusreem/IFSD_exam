const express = require("express");
const mongoose = require("mongoose");

// Create an instance of Express app
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://dhanusreemr:Dhanu@cluster0.cjgwura.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the Animal schema
const animalSchema = new mongoose.Schema({
  species: String,
  population: Number,
  birthRate: Number,
  deathRate: Number,
});

// Create the Animal model
const Animal = mongoose.model("Animal", animalSchema);

// Zoo class
class Zoo {
  constructor() {
    this.animals = [];
  }

  async addAnimal(animal) {
    const newAnimal = new Animal(animal);
    await newAnimal.save();
    this.animals.push(newAnimal);
  }

  async calculatePopulationAfterYears(years) {
    let totalPopulation = 0;
    for (let animal of this.animals) {
      let population = animal.population;
      for (let i = 0; i < years; i++) {
        population +=
          population * animal.birthRate - population * animal.deathRate;
      }
      totalPopulation += population;
    }
    return totalPopulation;
  }

  async listAnimals() {
    const animals = await Animal.find();
    console.log("Animal List:");
    animals.forEach((animal, index) => {
      console.log(
        `${index + 1}. Species: ${animal.species}, Population: ${
          animal.population
        }`
      );
    });
  }
}

const zoo = new Zoo();

// POST /animals - Add an animal
app.post("/animals", async (req, res) => {
  const { species, population, birthRate, deathRate } = req.body;
  const animal = { species, population, birthRate, deathRate };

  try {
    await zoo.addAnimal(animal);
    res.status(201).json({ message: "Animal added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to add animal." });
  }
});

// POST /population - Calculate the total population after a given number of years
app.post("/population", async (req, res) => {
  const { years } = req.body;

  try {
    const totalPopulation = await zoo.calculatePopulationAfterYears(years);
    res.json({ totalPopulation });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate population." });
  }
});

// GET /animals - List all animals
app.get("/animals", async (req, res) => {
  try {
    await zoo.listAnimals();
    res.json({ message: "Animals listed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to list animals." });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
