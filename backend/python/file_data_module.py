"""File Data

This script allows the user to modified data file.

This script requires that `json` be installed within the Python
environment you are running this script in.

This file can also be imported as a module and contains the following
functions:

    * updateLivePosition - modified live_position.json file
"""

import json

# Files path (follow nodejs file path)
POSITION_FILENAME = './temp/live_positions.json'
TIMER_FILENAME = './temp/live_timer.json'
INPUT_FILENAME = './temp/input.json'

def updateLivePosition(fen_string: str):
  """Update the contents of `live_position.json` file

    Parameters
    ----------
    fen_string : str
        string in FEN notation

    Returns
    -------
    None
    """

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


def readTimerButtonInput():
  """Read the input instruction in `input.json` file

    Parameters
    ----------
    None

    Returns
    -------
    timerButton : bool
    """

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