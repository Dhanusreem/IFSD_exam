const prompt = require("prompt-sync")();
const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://dhanusreemr:Dhanu@cluster0.cjgwura.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

class Zoo {
  constructor(animalCount) {
    this.animalCount = animalCount;
  }

  simulateYears(years) {
    for (let i = 0; i < years; i++) {
      this.animalCount -= Math.floor(this.animalCount / 4);
    }
  }

  getAliveAnimals() {
    return this.animalCount;
  }
}

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database successfully!");
    const database = client.db("day2");
    const collection = database.collection("2");
    return collection;
  } catch (error) {
    console.log("Error connecting to the database:", error);
    process.exit(1);
  }
}

async function createZoo(collection) {
  const animalCount = parseInt(
    prompt("Enter the initial number of animals in the zoo: ")
  );
  const years = parseInt(prompt("Enter the number of years to simulate: "));

  const zoo = new Zoo(animalCount);
  zoo.simulateYears(years);
  const aliveAnimals = zoo.getAliveAnimals();

  const zooData = { animalCount, years, aliveAnimals };
  const result = await collection.insertOne(zooData);
  console.log("Zoo created successfully!");
}

async function readZoos(collection) {
  const zoos = await collection.find().toArray();
  console.log("Zoos in the database:");
  zoos.forEach((zoo, index) => {
    console.log(
      `${index + 1}. Zoo ID: ${zoo._id}, Alive Animals: ${zoo.aliveAnimals}`
    );
  });
}

async function updateZoo(collection) {
  const zoos = await collection.find().toArray();
  console.log("Zoos in the database:");
  zoos.forEach((zoo, index) => {
    console.log(
      `${index + 1}. Zoo ID: ${zoo._id}, Alive Animals: ${zoo.aliveAnimals}`
    );
  });

  const choice = parseInt(prompt("Enter the number of the zoo to update: "));
  if (choice < 1 || choice > zoos.length) {
    console.log("Invalid choice. Please try again.");
    return;
  }

  const selectedZoo = zoos[choice - 1];
  const updatedAnimalCount = parseInt(
    prompt("Enter the updated number of animals in the zoo: ")
  );
  const updatedYears = parseInt(
    prompt("Enter the updated number of years to simulate: ")
  );

  const zoo = new Zoo(updatedAnimalCount);
  zoo.simulateYears(updatedYears);
  const updatedAliveAnimals = zoo.getAliveAnimals();

  const filter = { _id: selectedZoo._id };
  const update = {
    $set: {
      animalCount: updatedAnimalCount,
      years: updatedYears,
      aliveAnimals: updatedAliveAnimals,
    },
  };
  const result = await collection.updateOne(filter, update);
  if (result.modifiedCount === 1) {
    console.log("Zoo updated successfully!");
  } else {
    console.log("Failed to update the zoo.");
  }
}

async function deleteZoo(collection) {
  const zoos = await collection.find().toArray();
  console.log("Zoos in the database:");
  zoos.forEach((zoo, index) => {
    console.log(
      `${index + 1}. Zoo ID: ${zoo._id}, Alive Animals: ${zoo.aliveAnimals}`
    );
  });

  const choice = parseInt(prompt("Enter the number of the zoo to delete: "));
  if (choice < 1 || choice > zoos.length) {
    console.log("Invalid choice. Please try again.");
    return;
  }

  const selectedZoo = zoos[choice - 1];
  const filter = { _id: selectedZoo._id };
  const result = await collection.deleteOne(filter);
  if (result.deletedCount === 1) {
    console.log("Zoo deleted successfully!");
  } else {
    console.log("Failed to delete the zoo.");
  }
}

async function main() {
  const collection = await connectToDatabase();

  if (collection) {
    while (true) {
      console.log("\n--- CRUD Operations Menu ---");
      console.log("1. Create a new zoo");
      console.log("2. Read all zoos");
      console.log("3. Update a zoo");
      console.log("4. Delete a zoo");
      console.log("5. Exit");

      const choice = parseInt(prompt("Enter your choice: "));

      switch (choice) {
        case 1:
          await createZoo(collection);
          break;
        case 2:
          await readZoos(collection);
          break;
        case 3:
          await updateZoo(collection);
          break;
        case 4:
          await deleteZoo(collection);
          break;
        case 5:
          client.close();
          console.log("Disconnected from the database.");
          return;
        default:
          console.log("Invalid choice. Please try again.");
          break;
      }
    }
  }
}

main();
