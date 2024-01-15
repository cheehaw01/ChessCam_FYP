import cv2
import time
import chesspiece_detect as cpd
import variable as vrb
import sys
import os
sys.path.append(os.getcwd() + "\python")
import file_data_module as fdm


#fuction to read video for chessboard detection, user need to press c button to capture
def video_read_board(url,string):
    capture = True
    while capture:
        try:
            # Attempt to connect to the camera
            cap = cv2.VideoCapture(url)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

            # Check if the camera connection is successful
            if not cap.isOpened():
                raise ConnectionError("Camera connection failed.")

            # If the connection is successful, start capturing frames
            while True:
                ret, frame = cap.read()
                if not ret:
                    raise ConnectionError("Error reading frame from the camera.")

                if ret == True:
                    cv2.imshow('Press \"C\" to capture chessboard ', frame)
                    key = cv2.waitKey(1)
                    if key == ord('c'):
                        cv2.imwrite(string, frame)
                        capture = False
                if not capture:
                    break
                # Add a delay to control frame rate

        except ConnectionError as e:
            # Handle the connection error
            print(f"Connection error: {e}\n Retrying in 3 seconds..." )
            time.sleep(3)
        except Exception as e:
            # Handle other exceptions
            print(f"An error occurred: {e}")
            break

    # Release the camera and clean up when done
    cap.release()
    cv2.destroyAllWindows()

# read video input from cap, capture and return the frame
# when press timer button, automatically capture current frame
def video_read(url,string):
    fdm.setTimerButtonInput(False)
    fdm.setCameraStart(True)
    onlive = True
    while onlive:
        try:
            # Attempt to connect to the camera
            cap = cv2.VideoCapture(url)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

            # Check if the camera connection is successful
            if not cap.isOpened():
                raise ConnectionError("Camera connection failed.")

            #if not (vrb.board.turn and vrb.board.fullmove_number == 1):
            #    print('If the detection is wrong, please press e to change the movement:')
            # If the connection is successful, start capturing frames
            while onlive:
                ret, frame = cap.read()
                if not ret:
                    raise ConnectionError("Error reading frame from the camera.")

                if ret == True:
                    cv2.imshow('Game Start', frame)
                    cv2.waitKey(1)
                    if fdm.readTimerButtonInput():
                        cv2.imwrite(string, frame)
                        onlive = False
                        fdm.setCameraStart(False)
                    elif fdm.readWrongDetection():
                        if not (vrb.board.turn and vrb.board.fullmove_number == 1):
                            cpd.detect_error()
                        else:
                            print('The game is not started yet!')
                    

        except ConnectionError as e:
            # Handle the connection error
            print(f"Connection error: {e}")
            print("Retrying in 3 seconds...")
            time.sleep(3)
        except Exception as e:
            # Handle other exceptions
            print(f"An error occurred: {e}")
            break

    # Release the camera and clean up when done
    cap.release()
    cv2.destroyAllWindows()