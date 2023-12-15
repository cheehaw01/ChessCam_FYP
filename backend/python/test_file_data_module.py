import file_data_module as fdm

print("updateLivePosition: ", fdm.updateLivePosition("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1"))
print("updateLiveMove: " , fdm.updateLiveMove("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1", "f4"))
print("readInput: ", fdm.readTimerButtonInput())
