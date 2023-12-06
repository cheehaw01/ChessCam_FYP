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

def updateLivePosition(fen_string: str):
  """Gets and prints the spreadsheet's header columns

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