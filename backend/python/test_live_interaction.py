import file_data_module as fdm
import json
INTERACTION_FILENAME = './temp/live_interaction.json'

# write new piece on 'live_interaction.json' file
def setPromotionNewPiece(newPiece : str):
  try:
    # Open the live interaction file to override the new promotion trigger
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      data['promotionNewPiece'] = newPiece
      data['promotion'] = False
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False

# write correct move on 'live_interaction.json' file
def setIllegalCorrectMove(uciMove : str):
  try:
    # Open the live interaction file to override the new promotion trigger
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      data['illegalCorrectMove'] = uciMove
      data['illegalMove'] = False
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False

# Pawn promotion test
print("Trigger Pawn Promotion: ", fdm.setPromotion(True))
print("Set New Piece for Promotion: ", setPromotionNewPiece("Queen"))
print("New Piece: ", fdm.readPromotionNewPiece())

# Illegal move test
print("Trigger Illegal Move: ", fdm.setIllegalMove(True))
print("Set Correct Move for Illegal: ", setIllegalCorrectMove("b2b4"))
print("Correct Move: ", fdm.readIllegalCorrectMove())

# Others
print("Wrong Detection: ", fdm.readWrongDetection())
print("Camera IP: ", fdm.readCameraIpAddress())
print("Set Camera Start: ", fdm.setCameraStart(True))
