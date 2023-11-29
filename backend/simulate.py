import json
import time

filename = 'temp/live_positions.json'

entries = [
  {
      "e2": "wK",
      "a5": "bR"
    },
    {
      "f2": "wK",
      "b5": "bR"
    },
    {
      "g2": "wK",
      "c5": "bR"
    }
]

for i in range(len(entries)):
  # Old JSON File:
  # [{"alice": 24, "bob": 27}]
  entry = entries[i]
  with open(filename, "r+") as file:
      data = json.load(file)
      data.append(entry)
      file.seek(0)
      json.dump(data, file, indent=2)
  # New JSON file: 
  # [{"alice": 24, "bob": 27}, {"carl": 33}]
  time.sleep(1)