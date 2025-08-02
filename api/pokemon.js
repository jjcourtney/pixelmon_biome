const fs = require("fs");
const path = require("path");

let spawnData;

function loadData() {
  if (!spawnData) {
    const filePath = path.join(process.cwd(), "spawn_biomes_detailed.json");
    spawnData = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return spawnData;
}

function findPokemon(data, name) {
  // Normalize name (case-insensitive, handle Mr. Mime etc.)
  const keys = Object.keys(data);
  const target = name.toLowerCase().replace(" ", "").replace("-", "");

  return keys.find(
    (key) => key.toLowerCase().replace(/[\s\-♀♂.]/g, "") === target
  );
}

module.exports = (req, res) => {
  const { name } = req.query;
  const data = loadData();

  if (!name) {
    return res
      .status(400)
      .send("Missing Pokémon name. Use ?name=Bulbasaur, etc.");
  }

  const matchedKey = findPokemon(data, name);

  if (!matchedKey) {
    return res
      .status(404)
      .send(`No spawn info found for '${name}'. Double check spelling.`);
  }

  const entries = data[matchedKey];

  const main = entries[0]; // Show the first spawn entry (most common case)
  const biomeList = main.biomes?.join(", ") || "unknown biomes";
  const rarity = main.rarity ?? "unknown";
  const times = main.times?.join(", ") || "any time";
  const locations = main.stringLocationTypes?.join(", ") || "any location";

  const message = `${matchedKey} spawns in: ${biomeList} (rarity: ${rarity}, time: ${times}, location: ${locations})`;

  return res.status(200).send(message);
};
