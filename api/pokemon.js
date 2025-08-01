const fs = require("fs");
const path = require("path");

let data;

// Load the JSON once (cold start caching)
function loadData() {
  if (!data) {
    const filePath = path.join(process.cwd(), "spawn_biomes_detailed.json");
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return data;
}

module.exports = (req, res) => {
  const { name, biome } = req.query;
  const spawnData = loadData();

  if (name) {
    const match = spawnData[name];
    if (match) return res.status(200).json(match);
    return res.status(404).json({ error: "Pokémon not found" });
  }

  if (biome) {
    const results = {};
    for (const [pokemon, entries] of Object.entries(spawnData)) {
      const matched = entries.filter((entry) =>
        entry.biomes?.some((b) => b.toLowerCase().includes(biome.toLowerCase()))
      );
      if (matched.length) results[pokemon] = matched;
    }
    return res.status(200).json(results);
  }

  res.status(200).json({ message: "Specify ?name= or ?biome=" });
};
