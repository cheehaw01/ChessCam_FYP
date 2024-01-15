import cv2
import torch
import chess
import os
import video_input as vi
import chesspiece_init as cpi
import chesspiece_detect as cpd
import chessboard_detect as cbd
import variable as vrb
import sys
sys.path.append(os.getcwd() + "\python")
import file_data_module as fdm

#import yolov5 model with weight file for detection
play = True
model = torch.hub.load(os.getcwd() + '\python\sideview\yolov5', 'custom', path = os.getcwd() + '\python\sideview\yolov5/runs/train/exp/weights/best.pt', source = 'local')
model.conf = 0.2
model.iou = 0.45 

vrb.board = cpi.board_init()
fdm.updateLivePosition(vrb.board.fen())
#read camera ip address(currently only private ip address are able)
while fdm.readCameraIpAddress == "":
    continue
url = "https://" + fdm.readCameraIpAddress() +":8080/video"
get = True
#call video read function for video processing and show video
while(get):
    string = "board_detect.jpg"
    vi.video_read_board(url,string)
    #chessboard detection
    img = cv2.imread('board_detect.jpg')
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    ret, corners = cv2.findChessboardCorners(gray, (3,7),None)
    if ret == True:
        get = False
    else:
        continue
        #print("Chess Board not found T_T\nPlease try again")
#building initial array    
cbd.locate_Corner(ret, corners)
cpi.cell_name()

vrb.cell_prev = vrb.cell_init.copy()

#main program for chess piece recognition and movement detection
while(play):
    #print(vrb.board)
    #print('previous cell:')
    #for i in range(8):
    #    for j in range(8):
    #        print(vrb.cell_prev[i][j])
    #sys.stdout.flush()
    string2 = "Next_Image.jpg"
    vi.video_read(url,string2)

    vrb.cell_prev_backup = vrb.cell_prev.copy()
    cpd.initialize()

    #input image into yolov5 for detection
    image2 = cv2.imread('Next_Image.jpg')
    results = model(image2)

    result = results.xyxy[0].cpu()
    result = result.numpy()
    result = result.reshape(len(result),6)
    results.show()
    
    cpd.chess_yolo_detect(result)
    if vrb.firstround == True:
        cpd.side_determine()
        vrb.firstround = False
    cpd.side_transform()
    cpd.transform()
    

    #for i in range(8):
    #    for j in range(8):
    #        print(cell_trans[i][j])
    #priorotize checking of castling move
    if vrb.board.turn:
        if vrb.board.has_castling_rights(chess.WHITE):
            next = cpd.white_castle()
        else:
            next = False
    else:
        if vrb.board.has_castling_rights(chess.BLACK):
            next = cpd.black_castle()
        else:
            next = False
    #if castling move not detected, start detecting the movement made by calling the function check_move()
    if not next:
        cpd.check_move()
        #determine the move in the array and make the movement, push fen and san to frontend for visualising
        if vrb.v_move_clist:
            print(vrb.v_move_clist[0])
            part1 = (vrb.v_move_clist[0])[:2]
            part2 = (vrb.v_move_clist[0])[2:4]
            for i in range(8):
                for j in range(8):
                    if vrb.cell_prev[i][j][8] == part1:
                        for k in range(8):
                            for l in range(8):
                                if vrb.cell_prev[k][l][8] == part2:
                                    vrb.cell_prev[k][l][9] = True
                                    vrb.cell_prev[k][l][11] = vrb.cell_prev[i][j][11]
                                    vrb.cell_prev[k][l][12] = vrb.cell_prev[i][j][12]
                                    vrb.cell_prev[i][j][9] = 0
                                    vrb.cell_prev[i][j][10] = 0
                                    vrb.cell_prev[i][j][11] = 0
                                    vrb.cell_prev[i][j][12] = 0
                                    if len(vrb.v_move_clist) == 5:
                                        vrb.cell_prev[k][l][11] = (vrb.v_move_clist[0])[4:]
            vrb.moves =chess.Move.from_uci(vrb.v_move_clist[0])
            san_notation = vrb.board.san(vrb.moves)
            vrb.board.push(vrb.moves)
            print(vrb.board)
            fdm.updateLiveMove(vrb.board.fen(),san_notation)
            fdm.updateLivePosition(vrb.board.fen())

        elif vrb.v_move_dlist:
            print(vrb.v_move_dlist[0])
            part1 = (vrb.v_move_dlist[0])[:2]
            part2 = (vrb.v_move_dlist[0])[2:4]
            for i in range(8):
                for j in range(8):
                    if vrb.cell_prev[i][j][8] == part1:
                        for k in range(8):
                            for l in range(8):
                                if vrb.cell_prev[k][l][8] == part2:
                                    vrb.cell_prev[k][l][9] = True
                                    vrb.cell_prev[k][l][11] = vrb.cell_prev[i][j][11]
                                    vrb.cell_prev[k][l][12] = vrb.cell_prev[i][j][12]
                                    vrb.cell_prev[i][j][9] = 0
                                    vrb.cell_prev[i][j][10] = 0
                                    vrb.cell_prev[i][j][11] = 0
                                    vrb.cell_prev[i][j][12] = 0
                                    if len(vrb.v_move_dlist) == 5:
                                        vrb.cell_prev[k][l][11] = (vrb.v_move_dlist[0])[4:]
            vrb.moves =chess.Move.from_uci(vrb.v_move_dlist[0])
            san_notation = vrb.board.san(vrb.moves)
            vrb.board.push(vrb.moves)
            fdm.updateLiveMove(vrb.board.fen(),san_notation)
            fdm.updateLivePosition(vrb.board.fen())
            print(vrb.board)
        else:
            #if both array are empty, it means that the prgram could not detect the movement made
            #due to illegal move/chess piece not detected/wrong detection
            #prompt user input for correct movement
            enter = True
            while enter:
                try:
                    vrb.move = ""
                    fdm.setIllegalMove(True)
                    while vrb.move == "":
                        vrb.move = fdm.readIllegalCorrectMove()
                    fdm.setIllegalMove(False)
                    vrb.moves = chess.Move.from_uci(vrb.move)
                    if vrb.board.is_legal(vrb.moves):
                        print(vrb.move)
                        part1 = vrb.move[:2]
                        part2 = vrb.move[2:4]
                        for i in range(8):
                            for j in range(8):
                                if vrb.cell_prev[i][j][8] == part1:
                                    for k in range(8):
                                        for l in range(8):
                                            if vrb.cell_prev[k][l][8] == part2:
                                                vrb.cell_prev[k][l][9] = True
                                                vrb.cell_prev[k][l][11] = vrb.cell_prev[i][j][11]
                                                vrb.cell_prev[k][l][12] = vrb.cell_prev[i][j][12]
                                                vrb.cell_prev[i][j][9] = 0
                                                vrb.cell_prev[i][j][10] = 0
                                                vrb.cell_prev[i][j][11] = 0
                                                vrb.cell_prev[i][j][12] = 0
                                                if len(vrb.move) == 5:
                                                    vrb.cell_prev[k][l][11] = (vrb.move)[4:]
                        san_notation = vrb.board.san(vrb.moves)
                        vrb.board.push(vrb.moves)
                        fdm.updateLiveMove(vrb.board.fen(),san_notation)
                        fdm.updateLivePosition(vrb.board.fen())
                        enter = False
                    else:
                        continue
                except chess.InvalidMoveError:
                    print("Invalid UCI move. Please enter a valid UCI move.")
    else:
        #print(vrb.move_string)
        san_notation = vrb.board.san(vrb.moves)
        vrb.board.push(vrb.moves)
        print(vrb.board)
        fdm.updateLiveMove(vrb.board.fen(),san_notation)
        fdm.updateLivePosition(vrb.board.fen())
    
    #end the game if it is over
    if vrb.board.is_game_over():
    # Get the result of the game and claim draw if needed
        res = vrb.board.outcome(claim_draw=True)
        if res.winner is not None:
            winner_color = "White" if res.winner == chess.WHITE else "Black"
            print(f"{winner_color} wins!")
            play = False
        else:
            print("The game is a draw.")
            play = False

