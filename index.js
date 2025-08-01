const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

// Load the JSON file once on startup
const spawnData = JSON.parse(
  fs.readFileSync("spawn_biomes_detailed.json", "utf8")
);

// Endpoint: All Pokémon
app.get("/api/pokemon", (req, res) => {
  res.json(Object.keys(spawnData));
});

// Endpoint: Get spawn info for a specific Pokémon
app.get("/api/pokemon/:name", (req, res) => {
  const name = req.params.name;
  const data = spawnData[name];

  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: "Pokémon not found" });
  }
});

// Optional: Search by biome
app.get("/api/biome/:biome", (req, res) => {
  const biome = req.params.biome.toLowerCase();
  const results = {};

  for (const [pokemon, entries] of Object.entries(spawnData)) {
    const matched = entries.filter((entry) =>
      entry.biomes.some((b) => b.toLowerCase().includes(biome))
    );
    if (matched.length > 0) {
      results[pokemon] = matched;
    }
  }

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`🟢 Pixelmon API listening at http://localhost:${PORT}`);
});
