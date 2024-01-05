import time
import sys
import file_data_module as fd
import random

entries = [
  {
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "san": "a3"
  },
  {
    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    "san": "a5"
  },
  {
    "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    "san": "b3"
  },
  {
    "fen": "rnbqkbnr/pppp1ppp/4p3/8/4P3/3P4/PPP2PPP/RNBQKBNR b KQkq - 0 2",
    "san": "b5"
  },
  {
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq d6 0 3",
    "san": "c3"
  },
  {
    "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/4P3/3P4/PPPN1PPP/R1BQKBNR b KQkq - 1 3",
    "san": "c5"
  },
  {
    "fen": "rnbqkbnr/pp3ppp/4p3/2pp4/4P3/3P4/PPPN1PPP/R1BQKBNR w KQkq c6 0 4",
    "san": "d3"
  },
  {
    "fen": "rnbqkbnr/pp3ppp/4p3/2pp4/4P3/3P1N2/PPPN1PPP/R1BQKB1R b KQkq - 1 4",
    "san": "d5"
  },
  {
    "fen": "r1bqkbnr/pp3ppp/2n1p3/2pp4/4P3/3P1N2/PPPN1PPP/R1BQKB1R w KQkq - 2 5",
    "san": "e3"
  },
  {
    "fen": "r1bqkbnr/pp3ppp/2n1p3/2pp4/4P3/3P1NP1/PPPN1P1P/R1BQKB1R b KQkq - 0 5",
    "san": "e5"
  },
  {
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1P1P/R1BQKB1R w KQkq - 1 6",
    "san": "f3"
  },
  {
    "fen": "r1bqkb1r/pp3ppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQK2R b KQkq - 2 6",
    "san": "f5"
  },
  {
    "fen": "r1bqk2r/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQK2R w KQkq - 3 7",
    "san": "g4"
  },
  {
    "fen": "r1bqk2r/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQ1RK1 b kq - 4 7",
    "san": "g5"
  },
  {
    "fen": "r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQ1RK1 w - - 5 8",
    "san": "h2"
  },
  {
    "fen": "r1bq1rk1/pp2bppp/2n1pn2/2pp4/4P3/3P1NP1/PPPN1PBP/R1BQR1K1 b - - 6 8",
    "san": "h7"
  },
  {
    "fen": "r1bq1rk1/p3bppp/2n1pn2/1ppp4/4P3/3P1NP1/PPPN1PBP/R1BQR1K1 w - b6 0 9",
    "san": "i5"
  },
  {
    "fen": "r1bq1rk1/p3bppp/2n1pn2/1pppP3/8/3P1NP1/PPPN1PBP/R1BQR1K1 b - - 0 9",
    "san": "i7"
  },
  {
    "fen": "r1bq1rk1/p2nbppp/2n1p3/1pppP3/8/3P1NP1/PPPN1PBP/R1BQR1K1 w - - 1 10",
    "san": "j8"
  },
  {
    "fen": "r1bq1rk1/p2nbppp/2n1p3/1pppP3/8/3P1NP1/PPP2PBP/R1BQRNK1 b - - 2 10",
    "san": "j7"
  },
]

print("Run: simulate_fen_san_with_input.py")

while fd.readCameraIpAddress == "":
  print("Empty IP address")

print("Camera IP address: ", fd.readCameraIpAddress)

for i in range(len(entries)):
  if i == 0:
    fd.updateLivePosition(entries[i]["fen"])
    fd.updateLiveMove(entries[i]["fen"], entries[i]["san"])
    time.sleep(2)
    continue
  while True:
    try:
      if fd.readTimerButtonInput():
        fd.updateLivePosition(entries[i]["fen"])
        fd.updateLiveMove(entries[i]["fen"], entries[i]["san"])
        print(i)
        time.sleep(1.5)
        break
    except Exception as error:
      print("Error occurred:", error)
      sys.stdout.flush()