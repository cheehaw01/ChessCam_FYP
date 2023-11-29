import json
import time

filename = 'temp/live_positions.json'

entries = [
  {
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  },
  {
    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  },
  {
    "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"
  },
  {
    "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/3P4/PPP2PPP/RNBQKBNR b KQkq - 0 2"
  },
  {
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq d6 0 3"
  },
  {
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPPN1PPP/R1BQKBNR b KQkq - 1 3"
  },
  {
    "fen": "rnbqkbnr/pp3ppp/4p3/2pp4/4P3/3P4/PPPN1PPP/R1BQKBNR w KQkq c6 0 4"
  },
  {
    "fen": "rnbqkbnr/pp3ppp/4p3/2pp4/4P3/3P1N2/PPPN1PPP/R1BQKB1R b KQkq - 1 4"
  },
  {
    "fen": "r1bqkbnr/pp3ppp/2n1p3/2pp4/4P3/3P1N2/PPPN1PPP/R1BQKB1R w KQkq - 2 5"
  },
  {
    "fen": "r1bqkbnr/pp3ppp/2n1p3/2pp4/4P3/3P1NP1/PPPN1P1P/R1BQKB1R b KQkq - 0 5"
  },
  {
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1P1P/R1BQKB1R w KQkq - 1 6"
  },
  {
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQK2R b KQkq - 2 6"
  },
  {
    "fen": "r1bqk2r/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQK2R w KQkq - 3 7"
  },
  {
    "fen": "r1bqk2r/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQ1RK1 b kq - 4 7"
  },
  {
    "fen": "r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQ1RK1 w - - 5 8"
  },
  {
    "fen": "r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQR1K1 b - - 6 8"
  },
  {
    "fen": "r1bq1rk1/p3bppp/2n1pn2/1ppp4/4P3/3P1NP1/PPPN1PBP/R1BQR1K1 w - b6 0 9"
  },
  {
    "fen": "r1bq1rk1/p3bppp/2n1pn2/1pppP3/8/3P1NP1/PPPN1PBP/R1BQR1K1 b - - 0 9"
  },
  {
    "fen": "r1bq1rk1/p2nbppp/2n1p3/1pppP3/8/3P1NP1/PPPN1PBP/R1BQR1K1 w - - 1 10"
  },
  {
    "fen": "r1bq1rk1/p2nbppp/2n1p3/1pppP3/8/3P1NP1/PPP2PBP/R1BQRNK1 b - - 2 10"
  },
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