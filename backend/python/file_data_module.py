"""File Data

This script allows the user to modified data file.

This script requires that `json` be installed within the Python
environment you are running this script in.

This file can also be imported as a module and contains the following
functions:

    * updateLivePosition      - modified live_positions.json file
    * updateLiveMove          - modified live_moves.json file
    * readTimerButtonInput    - read button timer pressed
    * readCameraIpAddress     - read camera ip address
    * setPromotion            - set promotion trigger value of live_interaction.json file
    * setIllegalMove          - set illegal move trigger value of live_interaction.json file
    * readPromotionNewPiece   - read new piece for pawn promotion from live_interaction.json file
    * readIllegalCorrectMove  - read correct move for illegal move from live_interaction.json file
    * readWrongDetection      - read wrong detection trigger from live_interaction.json file
    * setCameraStart          - set camera start trigger value of live_interaction.json file
"""

import json

# Files path (follow nodejs file path, when run using nodejs)
POSITION_FILENAME = './temp/live_positions.json'
MOVE_FILENAME = './temp/live_moves.json'
TIMER_FILENAME = './temp/live_timer.json'
INPUT_FILENAME = './temp/input.json'
INTERACTION_FILENAME = './temp/live_interaction.json'
LIVE_STATUS_FILENAME = './temp/live_status.json'

# Files path (follow python file path, when run without nodejs)
# POSITION_FILENAME = '../temp/live_positions.json'
# MOVE_FILENAME = '../temp/live_moves.json'
# TIMER_FILENAME = '../temp/live_timer.json'
# INPUT_FILENAME = '../temp/input.json'
# INTERACTION_FILENAME = '../temp/live_interaction.json'
# LIVE_STATUS_FILENAME = '../temp/live_status.json'

def updateLivePosition(fen_string: str):
  """Update the contents of `live_positions.json` file

    Parameters
    ----------
    fen_string : str
        string in FEN notation

    Returns
    -------
    success or fail : bool
    """

  try:
    # Opening timer JSON file
    timer_file = open(TIMER_FILENAME)

    # returns JSON object as 
    # a dictionary
    timer_data = json.load(timer_file)

    # Prepare a new data for appending
    newLiveData = { "fen": fen_string, "white": timer_data['white'], "black": timer_data['black']}

    # Open the position file to append the new data
    with open(POSITION_FILENAME, "r+") as file:
      data = json.load(file)
      print(data)
      data.append(newLiveData)
      file.seek(0)
      json.dump(data, file, indent=2)
      return True
  except Exception:
    return False

def fixLivePosition(fen_string: str):
  try:

    # Opening timer JSON file
    timer_file = open(TIMER_FILENAME)

    # returns JSON object as 
    # a dictionary
    timer_data = json.load(timer_file)

    # Prepare a new data for appending
    newLiveData = { "fen": fen_string, "white": timer_data['white'], "black": timer_data['black']}

    # Open the position file to append the new data
    with open(POSITION_FILENAME) as file:
      data = json.load(file)
      data_length = len(data)-1
      data = data[:data_length]
      print("Hi, here",data)
      data.append(newLiveData)
      with open(POSITION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except Exception:
    return False

def fixLiveMove(fen_string: str, san_string: str):
  try:
    # Split FEN string with space (" ")
    fen_string_parts = fen_string.split()
    position_only = fen_string_parts[0]
    side = fen_string_parts[1]

    # Open the move file to append the new data
    with open(MOVE_FILENAME, "r+") as file:
      data = json.load(file)
      data_length = len(data)

      if side == "w" and data [data_length-1]["black"] != "":
        newMove = {"step": data_length, "white": data[data_length-1]["white"], "black": san_string}
        data[data_length-1] = newMove
        file.seek(0)
        json.dump(data, file, indent=2)
        return True
      
      if side == "b":
        newMove = {"step": data_length, "white": san_string, "black": ""}        
        data[data_length-1] = newMove
        file.seek(0)
        json.dump(data, file, indent=2)
        return True

  except Exception:
    return False

def updateLiveMove(fen_string: str, san_string: str):
  """Update the contents of `live_moves.json` file

    Parameters
    ----------
    fen_string : str
        string in FEN notation
    san_string : str
        string in SAN notation

    Returns
    -------
    success or fail: bool
    """

  try:
    # Split FEN string with space (" ")
    fen_string_parts = fen_string.split()
    position_only = fen_string_parts[0]
    side = fen_string_parts[1]

    # Open the move file to append the new data
    with open(MOVE_FILENAME, "r+") as file:
      data = json.load(file)
      data_length = len(data)

      # If it is initial position, no record
      if position_only == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR":
        return False

      # Append new object to json file (white move)
      if data_length == 0 or side == "b":
        newMove = {"step": data_length+1, "white": san_string, "black": ""}
        data.append(newMove)
        file.seek(0)
        json.dump(data, file, indent=2)
        return True
      
      # Modify the last object of an array in json file (black move after white)
      if side == "w" and data[data_length-1]["black"] == "":
        newMove = {"step": data_length, "white": data[data_length-1]["white"], "black": san_string}
        data[data_length-1] = newMove
        file.seek(0)
        json.dump(data, file, indent=2)
        return True
      
      # Append new object to json file (black move)
      if side == "w":
        newMove = {"step": data_length+1, "white": "", "black": san_string}
        data.append(newMove)
        file.seek(0)
        json.dump(data, file, indent=2)
        return True
  except Exception:
    return False


def readTimerButtonInput():
  """Read the input instruction in `input.json` file

    Parameters
    ----------
    None

    Returns
    -------
    timerButton : bool
    """

  try:
    # Open the input instruction file to read and update the data
    with open(INPUT_FILENAME, "r+") as file:
      data = json.load(file)
      input_data = data['timerButton']
      if input_data:
        data['timerButton'] = False
        file.seek(0)
        json.dump(data, file, indent=2)

    # return value with key 'timerButton'
    return input_data
  except:
    return False
  

def readCameraIpAddress():
  """Read the camera ip address in `live_status.json` file

    Parameters
    ----------
    None

    Returns
    -------
    camera_ip : bool
    """

  try:
    # Open the live_status json file to read data
    with open(LIVE_STATUS_FILENAME) as file:
      data = json.load(file)
      return data['camera_ip']
  except:
    return "Error - Failed to read file."
  

def setPromotion(value : bool):
  """Set the pawn promotion trigger in `live_interaction.json` file

    Parameters
    ----------
    value : bool

    Returns
    -------
    success or fail : bool
    """

  try:
    # Open the live interaction file to override the new promotion trigger
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      data['promotion'] = value
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False
  

def setIllegalMove(value : bool):
  """Set the illegal move trigger in `live_interaction.json` file

    Parameters
    ----------
    value : bool

    Returns
    -------
    success or fail : bool
    """

  try:
    # Open the live interaction file to override the new illegal move trigger
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      data['illegalMove'] = value
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False


def readPromotionNewPiece():
  """Read the new piece for promotion from `live_interaction.json` file

    Parameters
    ----------
    None

    Returns
    -------
    promotionNewPiece : str
    """

  try:
    # Open the live_interaction json file to read data
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      new_piece = data['promotionNewPiece']
      # Set to empty string after reading
      if new_piece != "":
        data['promotionNewPiece'] = ""
        with open(INTERACTION_FILENAME, 'w') as writeFile:
          json.dump(data, writeFile, indent=2)
      return new_piece
  except:
    return "Error - Failed to read file."
  

def readIllegalCorrectMove():
  """Read the correction of illegal move from `live_interaction.json` file

    Parameters
    ----------
    None

    Returns
    -------
    illegalCorrectMove : str
    """

  try:
    # Open the live_interaction json file to read data
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      correct_move = data['illegalCorrectMove']
      if correct_move != "":
        data['illegalCorrectMove'] = ""
        with open(INTERACTION_FILENAME, 'w') as writeFile:
          json.dump(data, writeFile, indent=2)
      return correct_move
  except:
    return "Error - Failed to read file."
  

def readWrongDetection():
  """Read the wrong detection trigger from `live_interaction.json` file

    Parameters
    ----------
    None

    Returns
    -------
    wrongDetection : bool
    """

  try:
    # Open the live_interaction json file to read data
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      wrong_detection = data['wrongDetection']
      if wrong_detection == True:
        data['wrongDetection'] = False
        with open(INTERACTION_FILENAME, 'w') as writeFile:
          json.dump(data, writeFile, indent=2)
      return wrong_detection
  except:
    return False


def setCameraStart(value : bool):
  """Set the camera start trigger in `live_interaction.json` file

    Parameters
    ----------
    value : bool

    Returns
    -------
    success or fail : bool
    """

  try:
    # Open the live interaction file to override the new camera start trigger
    with open(INTERACTION_FILENAME) as file:
      data = json.load(file)
      data['cameraStart'] = value
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False
  
def setTimerButtonInput(value : bool):
  try:
    # Open the live interaction file to override the new camera start trigger
    with open(INPUT_FILENAME) as file:
      data = json.load(file)
      data['timerButton'] = value
      with open(INTERACTION_FILENAME, 'w') as writeFile:
        json.dump(data, writeFile, indent=2)
        return True
  except:
    return False