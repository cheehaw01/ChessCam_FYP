@echo off

rem Check if Python is installed
python --version >nul 2>nul

if %errorlevel% neq 0 (
    echo Python is not installed. Installing Python 3.10.10 for Windows x64...

    rem Download and install Python 3.10.10 for Windows x64
    curl -o python_installer.exe https://www.python.org/ftp/python/3.10.10/python-3.10.10-amd64.exe
    python_installer.exe /quiet /passive /norestart

    if %errorlevel% neq 0 (
        echo Error: Python installation failed.
        exit /b 1
    )

    echo Python 3.10.10 for Windows x64 installed successfully.
)

rem Store the original working directory
set "target_directory=%~dp0\backend\python\sideview"


rem Check if the target directory exists
if not exist "%target_directory%" (
    echo Error: The directory '%target_directory%' does not exist.
    exit /b 1
)

rem Check if yolov5 directory already exists
if exist "%target_directory%\yolov5" (
    echo YOLOv5 directory already exists in '%target_directory%'. Skipping clone.
) else (
    rem Change into the target directory
    cd /d "%target_directory%"

    rem GitHub repository URL
    set repository_url=https://github.com/ultralytics/yolov5

    rem Clone the GitHub repository
    git clone "%repository_url%"

    rem Check if the cloning was successful
    if not exist "%target_directory%\yolov5" (
        echo Error: Cloning failed.
        exit /b 1
    )

    echo Repository cloned successfully into '%target_directory%\yolov5'.
)

rem Copy requirements.txt from a directory into the yolov5 folder
copy "%target_directory%\requirements.txt" "%target_directory%\yolov5\requirements.txt" /Y

echo requirements.txt copied successfully.

rem Change into the yolov5 directory
cd /d "%target_directory%\yolov5"

rem Install Python dependencies from requirements.txt using pip
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies.
    exit /b 1
)

echo Python dependencies installed successfully.

rem Change into the sideview directory
cd /d "%target_directory%"

rem Create a Python virtual environment
python -m venv venv

if %errorlevel% neq 0 (
    echo Error: Failed to create the virtual environment.
    exit /b 1
)

echo Virtual environment created successfully.

rem Activate the virtual environment
call venv\Scripts\activate

if %errorlevel% neq 0 (
    echo Error: Failed to activate the virtual environment.
    exit /b 1
)

echo Virtual environment activated.

rem Specify the path for requirements2.txt
set "requirements2_path=%cd%\requirements2.txt"

rem Install additional Python dependencies from requirements2.txt using pip
pip install -r "%requirements2_path%"

if %errorlevel% neq 0 (
    echo Error: Failed to install additional Python dependencies from requirements2.txt.
    exit /b 1
)

echo Additional Python dependencies from requirements2.txt installed successfully.

echo Python dependencies installed successfully.

