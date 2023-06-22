const mongoose = require("mongoose");
const prompt = require("prompt-sync")();

const uri =
  "mongodb+srv://dhanusreemr:Dhanu@cluster0.cjgwura.mongodb.net/?retryWrites=true&w=majority"; // Update with your MongoDB connection URI

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
}

const zooSchema = new mongoose.Schema({
  species: String,
  initialPopulation: Number,
  birthRate: Number,
  deathRate: Number,
});

const Zoo = mongoose.model("Zoo", zooSchema);

async function createAnimal() {
  const species = prompt("Enter the species of the animal: ");
  const initialPopulation = parseInt(prompt("Enter the initial population: "));
  const birthRate = parseFloat(
    prompt("Enter the birth rate (e.g., 0.1 for 10%): ")
  );
  const deathRate = parseFloat(
    prompt("Enter the death rate (e.g., 0.05 for 5%): ")
  );

  const animal = new Zoo({
    species,
    initialPopulation,
    birthRate,
    deathRate,
  });

  await animal.save();
  console.log("Animal created successfully");
}

async function readAnimals() {
  const animals = await Zoo.find();
  console.log("Animals:");
  animals.forEach((animal) => {
    console.log(animal);
  });
}

async function updateAnimal() {
  const species = prompt("Enter the species of the animal to update: ");

  const animal = await Zoo.findOne({ species });
  if (!animal) {
    console.log("Animal not found");
    return;
  }

  animal.initialPopulation = parseInt(
    prompt("Enter the new initial population: ")
  );
  animal.birthRate = parseFloat(prompt("Enter the new birth rate: "));
  animal.deathRate = parseFloat(prompt("Enter the new death rate: "));

  await animal.save();
  console.log("Animal updated successfully");
}

async function deleteAnimal() {
  const species = prompt("Enter the species of the animal to delete: ");

  const result = await Zoo.deleteOne({ species });
  if (result.deletedCount === 1) {
    console.log("Animal deleted successfully");
  } else {
    console.log("Animal not found");
  }
}

async function main() {
  try {
    await connectToDatabase();

    while (true) {
      console.log("\n--- Zoo Management System ---");
      console.log("1. Create an animal");
      console.log("2. Read all animals");
      console.log("3. Update an animal");
      console.log("4. Delete an animal");
      console.log("0. Exit");

      const choice = parseInt(prompt("Enter your choice: "));
      console.log();

      switch (choice) {
        case 1:
          await createAnimal();
          break;
        case 2:
          await readAnimals();
          break;
        case 3:
          await updateAnimal();
          break;
        case 4:
          await deleteAnimal();
          break;
        case 0:
          console.log("Exiting...");
          await disconnectFromDatabase();
          return;
        default:
          console.log("Invalid choice. Please try again.");
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main().catch(console.error);
