import cv2
import torch
import chess
import os
import video_input as vi
import chesspiece_init as cpi
import chesspiece_detect as cpd
import chessboard_detect as cbd
import variable as vrb
import file_data_module as fdm
import sys

play = True
model = torch.hub.load(os.getcwd() + '\python\yolov5', 'custom', path = os.getcwd() + '\python\yolov5/runs/train/exp/weights/best.pt', source = 'local')
model.conf = 0.2
model.iou = 0.45 

vrb.board = cpi.board_init()
while fdm.readCameraIpAddress == "":
    continue
url = "https://" + fdm.readCameraIpAddress() +":8080/video"
get = True
while(get):
    string = "board_detect.jpg"
    vi.video_read_board(url,string)
    img = cv2.imread('board_detect.jpg')
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    ret, corners = cv2.findChessboardCorners(gray, (3,7),None)
    if ret == True:
        get = False
    else:
        print("Chess Board not found T_T\nPlease try again")
cbd.locate_Corner()
cpi.cell_name()

vrb.cell_prev = vrb.cell_init.copy()

while(play):
    print(vrb.board)
    sys.stdout.flush()
    #print('previous cell:')
    #for i in range(8):
    #    for j in range(8):
    #        print(vrb.cell_prev[i][j])
    string2 = "Next_Image.jpg"
    vi.video_read(url,string2)

    vrb.cell_prev_backup = vrb.cell_prev.copy()
    cpd.initialize()
    image2 = cv2.imread('Next_Image.jpg')
    results = model(image2)

    result = results.xyxy[0].cpu()
    result = result.numpy()
    result = result.reshape(len(result),6)
    results.show()
    
    cpd.chess_yolo_detect(result)
    cpd.transform()
    

    #for i in range(8):
    #    for j in range(8):
    #        print(cell_trans[i][j])
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

    if not next:
        cpd.check_move()
        if vrb.v_move_clist:
            print(vrb.v_move_clist[0])
            part1 = (vrb.v_move_clist[0])[:2]
            part2 = (vrb.v_move_clist[0])[2:]
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
            vrb.moves =chess.Move.from_uci(vrb.v_move_clist[0])
            san_notation = vrb.board.san(vrb.moves)
            vrb.board.push(vrb.moves)
            print(vrb.board)
            fdm.updateLivePosition(vrb.board.fen())
            fdm.updateLiveMove(vrb.board.fen(),san_notation)

        elif vrb.v_move_dlist:
            print(vrb.v_move_dlist[0])
            part1 = (vrb.v_move_dlist[0])[:2]
            part2 = (vrb.v_move_dlist[0])[2:]
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
            vrb.moves =chess.Move.from_uci(vrb.v_move_dlist[0])
            san_notation = vrb.board.san(vrb.moves)
            vrb.board.push(vrb.moves)
            fdm.updateLivePosition(vrb.board.fen())
            fdm.updateLiveMove(vrb.board.fen(),san_notation)
            print(vrb.board)
        else:
            enter = True
            while enter:
                try:
                    vrb.move = ""
                    fdm.setIllegalMove(True)
                    while vrb.move == "":
                        vrb.move = fdm.readIllegalCorrectMove()
                    vrb.moves = chess.Move.from_uci(vrb.move)
                    if vrb.board.is_legal(vrb.moves):
                        print(vrb.move)
                        part1 = vrb.move[:2]
                        part2 = vrb.move[2:]
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
                        san_notation = vrb.board.san(vrb.moves)
                        vrb.board.push(vrb.moves)
                        fdm.updateLivePosition(vrb.board.fen())
                        fdm.updateLiveMove(vrb.board.fen(),san_notation)
                        enter = False
                    else:
                        continue
                except chess.InvalidMoveError:
                    print("Invalid UCI move. Please enter a valid UCI move.")
    else:
        print(vrb.move_string)
        san_notation = vrb.board.san(vrb.moves)
        vrb.board.push(vrb.moves)
        print(vrb.board)
        fdm.updateLivePosition(vrb.board.fen())
        fdm.updateLiveMove(vrb.board.fen(),san_notation)

    if vrb.board.is_game_over():
    # Get the result of the game and claim draw if needed
        res = vrb.board.outcome(claim_draw=True)
        if res.winner is not None:
            winner_color = "White" if res.winner == chess.WHITE else "Black"
            print(f"{winner_color} wins!")
        else:
            print("The game is a draw.")
            play = False

