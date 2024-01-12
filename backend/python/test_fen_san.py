import time
import sys
import file_data_module as fd
import random

entries = [
  {
    "fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    "san": ""
  },
  {
    "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    "san": "e4"
  },
  {
    "fen": "rnbqkbnr/ppppp1pp/8/5p2/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2",
    "san": "f5"
  },
  {
    "fen": "rnbqkbnr/ppppp1pp/8/5p2/4P3/5P2/PPPP2PP/RNBQKBNR b KQkq - 0 2",
    "san": "f3"
  },
  {
    "fen": "rnbqkb1r/ppppp1pp/5n2/5p2/4P3/5P2/PPPP2PP/RNBQKBNR w KQkq - 1 3",
    "san": "Nf6"
  },
  {
    "fen": "rnbqkb1r/ppppp1pp/5n2/5P2/8/5P2/PPPP2PP/RNBQKBNR b KQkq - 0 3",
    "san": "exf5"
  },
  {
    "fen": "rnbqkb1r/pppp2pp/4pn2/5P2/8/5P2/PPPP2PP/RNBQKBNR w KQkq - 0 4",
    "san": "e6"
  },
  {
    "fen": "rnbqkb1r/pppp2pp/4pn2/5P2/2B5/5P2/PPPP2PP/RNBQK1NR b KQkq - 1 4",
    "san": "Bc4"
  },
  {
    "fen": "rnbqk2r/pppp2pp/4pn2/2b2P2/2B5/5P2/PPPP2PP/RNBQK1NR w KQkq - 2 5",
    "san": "Bc5"
  },
  {
    "fen": "rnbqk2r/pppp2pp/4pn2/2b2P2/2B5/5P2/PPPPN1PP/RNBQK2R b KQkq - 3 5",
    "san": "Ne2"
  },
  {
    "fen": "rnbq1rk1/pppp2pp/4pn2/2b2P2/2B5/5P2/PPPPN1PP/RNBQK2R w KQ - 4 6",
    "san": "O-O"
  },
  {
    "fen": "rnbq1rk1/pppp2pp/4pn2/2b2P2/2BP4/5P2/PPP1N1PP/RNBQK2R b KQ - 0 6",
    "san": "d4"
  },
  {
    "fen": "rnbq1rk1/ppp3pp/4pn2/2bp1P2/2BP4/5P2/PPP1N1PP/RNBQK2R w KQ - 0 7",
    "san": "d5"
  },
  {
    "fen": "rnbq1rk1/ppp3pp/4pn2/2Pp1P2/2B5/5P2/PPP1N1PP/RNBQK2R b KQ - 0 7",
    "san": "dxc5"
  },
  {
    "fen": "rnbq1rk1/ppp3pp/4pn2/2P2P2/2p5/5P2/PPP1N1PP/RNBQK2R w KQ - 0 8",
    "san": "dxc4"
  },
  {
    "fen": "rnbQ1rk1/ppp3pp/4pn2/2P2P2/2p5/5P2/PPP1N1PP/RNB1K2R b KQ - 0 8",
    "san": "Qxd8"
  },
  {
    "fen": "rnbr2k1/ppp3pp/4pn2/2P2P2/2p5/5P2/PPP1N1PP/RNB1K2R w KQ - 0 9",
    "san": "Rxd8"
  },
  {
    "fen": "rnbr2k1/ppp3pp/4pn2/2P2PB1/2p5/5P2/PPP1N1PP/RN2K2R b KQ - 1 9",
    "san": "Bg5"
  },
  {
    "fen": "rnbr2k1/ppp3pp/5n2/2P2pB1/2p5/5P2/PPP1N1PP/RN2K2R w KQ - 0 10",
    "san": "exf5"
  },
  {
    "fen": "rnbr2k1/ppp3pp/5n2/2P2pB1/2p2N2/5P2/PPP3PP/RN2K2R b KQ - 1 10",
    "san": "Nf4"
  },
  {
    "fen": "rnbr2k1/ppp3p1/5n1p/2P2pB1/2p2N2/5P2/PPP3PP/RN2K2R w KQ - 0 11",
    "san": "h6"
  },
  {
    "fen": "rnbr2k1/ppp3p1/5B1p/2P2p2/2p2N2/5P2/PPP3PP/RN2K2R b KQ - 0 11",
    "san": "Bxf6"
  },
  {
    "fen": "rnb1r1k1/ppp3p1/5B1p/2P2p2/2p2N2/5P2/PPP3PP/RN2K2R w KQ - 1 12",
    "san": "Re8+"
  },
  {
    "fen": "rnb1r1k1/ppp3p1/5B1p/2P2p2/2p2N2/5P2/PPPK2PP/RN5R b - - 2 12",
    "san": "Kd2"
  },
  {
    "fen": "rnb1r1k1/p1p3p1/1p3B1p/2P2p2/2p2N2/5P2/PPPK2PP/RN5R w - - 0 13",
    "san": "b6"
  },
  {
    "fen": "rnb1r1k1/p1p3p1/1p3B1p/2PN1p2/2p5/5P2/PPPK2PP/RN5R b - - 1 13",
    "san": "Nd5"
  },
  {
    "fen": "rnb1r1k1/p1p3p1/5B1p/2pN1p2/2p5/5P2/PPPK2PP/RN5R w - - 0 14",
    "san": "bxc5"
  },
  {
    "fen": "rnb1r1k1/p1p1N1p1/5B1p/2p2p2/2p5/5P2/PPPK2PP/RN5R b - - 1 14",
    "san": "Ne7+"
  },
  {
    "fen": "rnb3k1/p1p1r1p1/5B1p/2p2p2/2p5/5P2/PPPK2PP/RN5R w - - 0 15",
    "san": "Rxe7"
  },
  {
    "fen": "rnb3k1/p1p1B1p1/7p/2p2p2/2p5/5P2/PPPK2PP/RN5R b - - 0 15",
    "san": "Bxe7"
  },
  {
    "fen": "r1b3k1/p1p1B1p1/2n4p/2p2p2/2p5/5P2/PPPK2PP/RN5R w - - 1 16",
    "san": "Nc6"
  },
  {
    "fen": "r1b3k1/p1p1B1p1/2n4p/2p2p2/2p5/2N2P2/PPPK2PP/R6R b - - 2 16",
    "san": "Nc3"
  },
  {
    "fen": "r1b3k1/p1p1B1p1/7p/2p1np2/2p5/2N2P2/PPPK2PP/R6R w - - 3 17",
    "san": "Ne5"
  },
  {
    "fen": "r1b3k1/p1p3p1/7p/2B1np2/2p5/2N2P2/PPPK2PP/R6R b - - 0 17",
    "san": "Bxc5"
  },
  {
    "fen": "1rb3k1/p1p3p1/7p/2B1np2/2p5/2N2P2/PPPK2PP/R6R w - - 1 18",
    "san": "Rb8"
  },
  {
    "fen": "1rb3k1/p1p3p1/7p/2B1np2/2p5/1PN2P2/P1PK2PP/R6R b - - 0 18",
    "san": "b3"
  },
  {
    "fen": "1rb3k1/p1p3p1/7p/2B1np2/8/1pN2P2/P1PK2PP/R6R w - - 0 19",
    "san": "cxb3"
  },
  {
    "fen": "1rb3k1/p1p3p1/7p/2B1np2/8/1PN2P2/2PK2PP/R6R b - - 0 19",
    "san": "axb3"
  },
  {
    "fen": "1rb3k1/2p3p1/p6p/2B1np2/8/1PN2P2/2PK2PP/R6R w - - 0 20",
    "san": "a6"
  },
  {
    "fen": "1rb3k1/2p3p1/p6p/2BNnp2/8/1P3P2/2PK2PP/R6R b - - 1 20",
    "san": "Nd5"
  },
  {
    "fen": "2b3k1/2p3p1/p6p/1rBNnp2/8/1P3P2/2PK2PP/R6R w - - 2 21",
    "san": "Rb5"
  },
  {
    "fen": "2b3k1/2p3p1/p6p/1rBNnp2/8/1P3P2/2PK2PP/4R2R b - - 3 21",
    "san": "Rae1"
  },
  {
    "fen": "2b3k1/2p2np1/p6p/1rBN1p2/8/1P3P2/2PK2PP/4R2R w - - 4 22",
    "san": "Nf7"
  },
  {
    "fen": "2b1R1k1/2p2np1/p6p/1rBN1p2/8/1P3P2/2PK2PP/7R b - - 5 22",
    "san": "Re8+"
  },
  {
    "fen": "2b1R3/2p2npk/p6p/1rBN1p2/8/1P3P2/2PK2PP/7R w - - 6 23",
    "san": "Kh7"
  },
  {
    "fen": "2R5/2p2npk/p6p/1rBN1p2/8/1P3P2/2PK2PP/7R b - - 0 23",
    "san": "Rxc8"
  },
  {
    "fen": "2R5/2p2npk/p6p/2rN1p2/8/1P3P2/2PK2PP/7R w - - 0 24",
    "san": "Rxc5"
  },
  {
    "fen": "2R5/2p2npk/p6p/2rN1p2/8/1P3P2/2PK2PP/R7 b - - 1 24",
    "san": "Ra1"
  },
  {
    "fen": "2R5/2p2npk/p6p/3r1p2/8/1P3P2/2PK2PP/R7 w - - 0 25",
    "san": "Rxd5+"
  },
  {
    "fen": "2R5/2p2npk/p6p/3r1p2/8/1P2KP2/2P3PP/R7 b - - 1 25",
    "san": "Ke3"
  },
  {
    "fen": "2R5/2p3pk/p2n3p/3r1p2/8/1P2KP2/2P3PP/R7 w - - 2 26",
    "san": "Nd6"
  },
  {
    "fen": "8/2R3pk/p2n3p/3r1p2/8/1P2KP2/2P3PP/R7 b - - 0 26",
    "san": "Rxc7"
  },
  {
    "fen": "8/2R3pk/p6p/1n1r1p2/8/1P2KP2/2P3PP/R7 w - - 1 27",
    "san": "Nb5"
  },
  {
    "fen": "8/5Rpk/p6p/1n1r1p2/8/1P2KP2/2P3PP/R7 b - - 2 27",
    "san": "Rf7"
  },
  {
    "fen": "8/5Rpk/p6p/3r1p2/8/1Pn1KP2/2P3PP/R7 w - - 3 28",
    "san": "Nc3"
  },
  {
    "fen": "8/5Rpk/R6p/3r1p2/8/1Pn1KP2/2P3PP/8 b - - 0 28",
    "san": "Rxa6"
  },
  {
    "fen": "6k1/5Rp1/R6p/3r1p2/8/1Pn1KP2/2P3PP/8 w - - 1 29",
    "san": "Kg8"
  },
  {
    "fen": "6k1/R4Rp1/7p/3r1p2/8/1Pn1KP2/2P3PP/8 b - - 2 29",
    "san": "Raa7"
  },
  {
    "fen": "6k1/R4Rp1/7p/3r1p2/8/1P2KP2/2P3PP/3n4 w - - 3 30",
    "san": "Nd1+"
  },
  {
    "fen": "6k1/R4Rp1/7p/3r1p2/8/1P3P2/2P1K1PP/3n4 b - - 4 30",
    "san": "Ke2"
  },
  {
    "fen": "6k1/R4Rp1/7p/3r1p2/8/1Pn2P2/2P1K1PP/8 w - - 5 31",
    "san": "Nc3+"
  },
  {
    "fen": "6k1/R4Rp1/7p/3r1p2/8/1Pn2P2/2P2KPP/8 b - - 6 31",
    "san": "Kf2"
  },
  {
    "fen": "6k1/R4Rp1/7p/5p2/8/1Pn2P2/2Pr1KPP/8 w - - 7 32",
    "san": "Rd2+"
  },
  {
    "fen": "6k1/R4Rp1/7p/5p2/8/1Pn2P2/2Pr2PP/4K3 b - - 8 32",
    "san": "Ke1"
  },
  {
    "fen": "6k1/R4Rp1/7p/5p2/8/1Pn2P2/2P3rP/4K3 w - - 0 33",
    "san": "Rxg2"
  },
  {
    "fen": "6k1/R4Rp1/7p/5p2/1P6/2n2P2/2P3rP/4K3 b - - 0 33",
    "san": "b4"
  },
  {
    "fen": "6k1/R4Rp1/7p/5p2/1P6/5P2/2P1n1rP/4K3 w - - 1 34",
    "san": "Ne2"
  },
  {
    "fen": "6k1/R4Rp1/7p/1P3p2/8/5P2/2P1n1rP/4K3 b - - 0 34",
    "san": "b5"
  },
  {
    "fen": "6k1/R4R2/7p/1P3pp1/8/5P2/2P1n1rP/4K3 w - - 0 35",
    "san": "g5"
  },
  {
    "fen": "6k1/R4R2/1P5p/5pp1/8/5P2/2P1n1rP/4K3 b - - 0 35",
    "san": "b6"
  },
  {
    "fen": "6k1/R4R2/1P5p/5pp1/8/5P2/2P1n2r/4K3 w - - 0 36",
    "san": "Rxh2"
  },
  {
    "fen": "6k1/R7/1P5p/5Rp1/8/5P2/2P1n2r/4K3 b - - 0 36",
    "san": "Rxf5"
  },
  {
    "fen": "6k1/R7/1P5p/5Rp1/8/5Pn1/2P4r/4K3 w - - 1 37",
    "san": "Ng3"
  },
  {
    "fen": "6k1/R7/1P5p/3R2p1/8/5Pn1/2P4r/4K3 b - - 2 37",
    "san": "Rd5"
  },
  {
    "fen": "6k1/R7/1P6/3R2pp/8/5Pn1/2P4r/4K3 w - - 0 38",
    "san": "h5"
  },
  {
    "fen": "6k1/RP6/8/3R2pp/8/5Pn1/2P4r/4K3 b - - 0 38",
    "san": "b7"
  },
  {
    "fen": "8/RP3k2/8/3R2pp/8/5Pn1/2P4r/4K3 w - - 1 39",
    "san": "Kf7"
  },
  {
    "fen": "1N6/R4k2/8/3R2pp/8/5Pn1/2P4r/4K3 b - - 0 39",
    "san": "b8=Q+"
  },
  {
    "fen": "1Q6/R7/4k3/3R2pp/8/5Pn1/2P4r/4K3 w - - 1 40",
    "san": "Ke6"
  },
  {
    "fen": "1Q6/3R4/4k3/3R2pp/8/5Pn1/2P4r/4K3 b - - 2 40",
    "san": "Rad7"
  },
  {
    "fen": "1Q6/3R4/4k3/3R2pp/8/5Pn1/2P5/4K2r w - - 3 41",
    "san": "Rh1+"
  },
  {
    "fen": "1Q6/3R4/4k3/3R2pp/8/5Pn1/2P2K2/7r b - - 4 41",
    "san": "Kf2"
  },
  {
    "fen": "1Q6/3R4/4k3/3R2pp/8/5Pnr/2P2K2/8 w - - 5 42",
    "san": "Rh3"
  },
  {
    "fen": "8/3R4/3Qk3/3R2pp/8/5Pnr/2P2K2/8 b - - 6 42",
    "san": "Qd6#"
  }
]

print("Run: test_fen_san.py")

while fd.readCameraIpAddress == "":
  print("Empty IP address")

print("Camera IP address: ", fd.readCameraIpAddress)

for i in range(len(entries)):
  try:
    fd.updateLiveMove(entries[i]["fen"], entries[i]["san"])
    fd.updateLivePosition(entries[i]["fen"])
    print(i)
    print("fen ", entries[i]["fen"])
    print("san ", entries[i]["san"])
    time.sleep(random.randint(5,7))
  except Exception as error:
    print("Error occurred:", error)
    sys.stdout.flush()