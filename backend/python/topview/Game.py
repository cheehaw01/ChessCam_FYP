import chess
import cv2
import numpy as np
from Board import Board
from board_recognition import board_Recognition
import sys
import imutils
import os
sys.path.append(os.getcwd() + "\python")
import file_data_module as DataModule

cameraIP = ""
while cameraIP == "":
    cameraIP = DataModule.readCameraIpAddress()
# Initialize video capture
# Change the parameter if using a different camera source
cap = cv2.VideoCapture("https://" + cameraIP + ":8080/video")

# Callback function for drawing rectangle
def draw_rectangle(event, x, y, flags, param):
    global x_init, y_init, drawing, top_left_pt, bottom_right_pt

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        x_init, y_init = x, y
        top_left_pt, bottom_right_pt = (-1, -1), (-1, -1)

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            top_left_pt, bottom_right_pt = (x_init, y_init), (x, y)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        top_left_pt, bottom_right_pt = (x_init, y_init), (x, y)


# Create window and set mouse callback
cv2.namedWindow('Select ROI')
cv2.setMouseCallback('Select ROI', draw_rectangle)

# Variables for ROI
drawing = False
top_left_pt, bottom_right_pt = (-1, -1), (-1, -1)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Draw the rectangle on the frame
    if not drawing:
        cv2.putText(frame, 'Select ROI by clicking and dragging the mouse', (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2, cv2.LINE_AA)
    else:
        cv2.rectangle(frame, top_left_pt, bottom_right_pt, (255, 0, 0), 2)

    cv2.imshow('Select ROI', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Define the ROI coordinates
x1, y1 = top_left_pt
x2, y2 = bottom_right_pt
roi = frame[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]

# Display the selected ROI in a separate window
cv2.imshow('Selected ROI', roi)
cv2.waitKey(0)
cv2.destroyAllWindows()
cap.release()

# Chess Board Initialization Process
boardRec = board_Recognition()
GameBoard = boardRec.initialize_Board(roi)
GameBoard.assignState()

cap = cv2.VideoCapture("https://" + cameraIP + ":8080/video")
ret, currentPhoto = cap.read()
cap.release()
x1, y1 = top_left_pt
x2, y2 = bottom_right_pt
roi = currentPhoto[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]
cv2.imshow('First Frame', roi)
cv2.waitKey(0)
cv2.destroyAllWindows()

engBoard = chess.Board()
fen_string = engBoard.fen()
DataModule.updateLivePosition(fen_string)

while True:
    DataModule.setCameraStart(True)
    if DataModule.readWrongDetection():
        DataModule.setIllegalMove(True)
        DataModule.setCameraStart(False)
        engBoard.pop()
        correctMove = DataModule.readIllegalCorrectMove()
        while correctMove == "":
            correctMove = DataModule.readIllegalCorrectMove()
        uciMove = chess.Move.from_uci(correctMove)
        while uciMove not in engBoard.legal_moves:
            correctMove = DataModule.readIllegalCorrectMove()
            while (correctMove == ""):
                correctMove = DataModule.readIllegalCorrectMove() 
            uciMove = chess.Move.from_uci(correctMove)
        san_notation = engBoard.san(uciMove)
        engBoard.push_san(san_notation)
        fen_string = engBoard.fen()
        DataModule.fixLivePosition(fen_string)
        DataModule.fixLiveMove(fen_string, san_notation)
        cap = cv2.VideoCapture("https://" + cameraIP + ":8080/video")
        ret, correctedPhoto = cap.read()
        cap.release()
        roi = correctedPhoto[min(y1, y2):max(
            y1, y2), min(x1, x2):max(x1, x2)]
        cv2.imshow('Corrected Frame', roi)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    else:
        if DataModule.readTimerButtonInput():
            previousPhoto = roi
            cap = cv2.VideoCapture("https://" + cameraIP + ":8080/video")
            ret, currentPhoto = cap.read()
            cap.release()
            DataModule.setCameraStart(False)
            x1, y1 = top_left_pt
            x2, y2 = bottom_right_pt
            roi = currentPhoto[min(y1, y2):max(y1, y2), min(x1, x2):max(x1, x2)]
            move = GameBoard.determineChanges(previousPhoto, roi)
            uciMove = chess.Move.from_uci(move)

            # Check for valid moves
            if uciMove in engBoard.legal_moves:
                print(uciMove)
                print("Move is valid. Board after move: \n")
                san_notation = engBoard.san(uciMove)
                print(san_notation)
                engBoard.push_san(san_notation)
                fen_string = engBoard.fen()
                print(fen_string)
                print(engBoard)
                DataModule.updateLivePosition(fen_string)
                DataModule.updateLiveMove(fen_string, san_notation)
            else:
                print(uciMove)
                # print("Move is not valid. Press 'c' to recapture move!")
                while uciMove not in engBoard.legal_moves:
                    DataModule.setIllegalMove(True)
                    correctMove = DataModule.readIllegalCorrectMove()
                    while (correctMove == ""):
                        correctMove = DataModule.readIllegalCorrectMove()
                    uciMove = chess.Move.from_uci(correctMove)
                san_notation = engBoard.san(uciMove)
                engBoard.push_san(san_notation)
                fen_string = engBoard.fen()
                DataModule.updateLivePosition(fen_string)
                DataModule.updateLiveMove(fen_string, san_notation)
                cap = cv2.VideoCapture("https://" + cameraIP + ":8080/video")
                ret, correctedPhoto = cap.read()
                cap.release()
                roi = correctedPhoto[min(y1, y2):max(
                    y1, y2), min(x1, x2):max(x1, x2)]
                cv2.imshow('Corrected Frame', roi)
                cv2.waitKey(0)
                cv2.destroyAllWindows()


            '''
            Future Implementation: Auto termination of program
            upon checkmate
            # Check if the game is over
            if engBoard.is_game_over():
                result = engBoard.result()
                if result == "1-0":
                    print("White wins by checkmate!")
                    break
                elif result == "0-1":
                    print("Black wins by checkmate!")
                    break
                elif result == "1/2-1/2":
                    print(
                        "The game is drawn by stalemate, insufficient material, or repetition.")
                    break
                else:
                    print("The game is over for some other reason.")
                    break
            else:
                print("The game is still ongoing.")
            '''
