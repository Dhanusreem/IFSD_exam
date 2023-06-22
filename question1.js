const prompt = require("prompt-sync")();
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

function main() {
  const animalCount = parseInt(
    prompt("Enter the initial number of animals in the zoo: ")
  );
  const years = parseInt(prompt("Enter the number of years to simulate: "));

  const zoo = new Zoo(animalCount);
  zoo.simulateYears(years);
  const aliveAnimals = zoo.getAliveAnimals();

  console.log(
    `The number of animals alive after ${years} years is ${aliveAnimals}.`
  );
}

main();
