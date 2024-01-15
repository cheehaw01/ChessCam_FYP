import json
PACKAGE_FILENAME = "./frontend/package.json"
confirm = False

try:
  while not confirm: 
    ipAddress = input("Enter your ip address: ")
    c = input("Enter 'c' to confirm: ")
    if c == 'c':
      confirm = True
      break

  # Open the frontend package.json file to override the new proxy
  with open(PACKAGE_FILENAME) as file:
    data = json.load(file)
    data['proxy'] = "https://" + ipAddress + ":5000"
    with open(PACKAGE_FILENAME, 'w') as writeFile:
      json.dump(data, writeFile, indent=2)
except Exception as e:
  print(e)