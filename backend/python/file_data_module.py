"""File Data

This script allows the user to modified data file.

This script requires that `json` be installed within the Python
environment you are running this script in.

This file can also be imported as a module and contains the following
functions:

    * updateLivePosition - modified live_positions.json file
    * updateLiveMove     - modified live_moves.json file
    * readTimerButtonInput - read button timer pressed
"""

import json

# Files path (follow nodejs file path, when run using nodejs)
POSITION_FILENAME = './temp/live_positions.json'
MOVE_FILENAME = './temp/live_moves.json'
TIMER_FILENAME = './temp/live_timer.json'
INPUT_FILENAME = './temp/input.json'

# Files path (follow python file path, when run without nodejs)
# POSITION_FILENAME = '../temp/live_positions.json'
# MOVE_FILENAME = '../temp/live_moves.json'
# TIMER_FILENAME = '../temp/live_timer.json'
# INPUT_FILENAME = '../temp/input.json'

def updateLivePosition(fen_string: str):
  """Update the contents of `live_positions.json` file

    Parameters
    ----------
    fen_string : str
        string in FEN notation

    Returns
    -------
    None
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
    None
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