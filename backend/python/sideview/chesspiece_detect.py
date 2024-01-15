import chess
import variable as vrb
import sys
import os
sys.path.append(os.getcwd() + "\python")
import file_data_module as fdm
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

#determine the middle pont of the bounding box, checking if the box is on the left or right side of the chessboard.
def middle(p1,p2,p3):
    val = ((p2[0] - p1[0])*(p3[1] - p1[1]) - (p2[1] - p1[1])*(p3[0] - p1[0]))
    thresh = 1e-9
    if val >= thresh:
        return "left"
    elif val <= -thresh:
        return "right"

#extract yolov5 class and convert into more appealing format
def chesspiece(code):
    match code:
        case 1:
            value = 'b'
        case 2:
            value = 'k'
        case 3:
            value = 'n'
        case 4:
            value = 'p'
        case 5:
            value = 'q'
        case 6:
            value = 'r'
        case 7:
            value = 'B'
        case 8:
            value = 'K'
        case 9:
            value = 'N'
        case 10:
            value = 'P'
        case 11:
            value = 'Q'
        case 12:
            value = 'R'
    return value

#convert yolov5 class and determine its colour
def colour(code):
    if code in (1, 2, 3, 4, 5, 6):
        value = 'black'
    elif code in (7, 8, 9, 10, 11, 12):
        value = 'white'
    return value

#initialize array and variable, prepare for next turn
def initialize():
    for i in range(8):
        for j in range(8):
            for k in range(4):
                vrb.cell[i][j][k+9] = 0
                vrb.cell_temp[i][j][k+9] = 0
                vrb.cell_trans[i][j][k+9] = 0
    vrb.move_string = None
    vrb.move = ""
    vrb.moves = None
    vrb.v_move_clist.clear()
    vrb.v_move_dlist.clear()

#input result from yolov5 detection, map the detected piece into their corresponding slot of array
def chess_yolo_detect(result):
    for i in range(len(result)):
        mid_point = [(result[i][0] + result[i][2])/2 , (result[i][1] + result[i][3])/2]
        x = middle (vrb.edge_coor[0][4],vrb.edge_coor[8][4],mid_point)
        #print(x)
        if x == 'left':
            centre_coor = [(result[i][2] - result[i][0]) * 0.7 + result[i][0] , (result[i][3] - result[i][1]) * 0.9 + result[i][1]]
        else:
            centre_coor = [(result[i][2] - result[i][0]) * 0.3 + result[i][0] , (result[i][3] - result[i][1]) * 0.9 + result[i][1]]
        #print (centre_coor)
        point = Point(centre_coor[0],centre_coor[1])
        for j in range(8):
            for k in range(8):
                a = (vrb.cell_temp[j][k][0],vrb.cell_temp[j][k][1])
                b = (vrb.cell_temp[j][k][2],vrb.cell_temp[j][k][3])
                c = (vrb.cell_temp[j][k][6],vrb.cell_temp[j][k][7])
                d = (vrb.cell_temp[j][k][4],vrb.cell_temp[j][k][5])
                polygon = Polygon([a,b,c,d])
                if polygon.contains(point):
                    #print(j, ". ", k , ". " , result[i][5])
                    if vrb.cell_temp[j][k][9] == True:
                        if vrb.cell_temp[j][k][10] > result[i][4]:
                            continue
                        else:
                            vrb.cell_temp[j][k][10] = float(result[i][4])
                            vrb.cell_temp[j][k][11] = chesspiece(result[i][5])
                            vrb.cell_temp[j][k][12] = colour(result[i][5])
                    else:
                        vrb.cell_temp[j][k][9] = True
                        vrb.cell_temp[j][k][10] = float(result[i][4])
                        vrb.cell_temp[j][k][11] = chesspiece(result[i][5])
                        vrb.cell_temp[j][k][12] = colour(result[i][5])

#use to determine if side of video taking(black/white at left or at right)
def side_determine():
    vrb.whitecount = 0
    vrb.blackcount = 0
    for i in range(8):
        for j in range(2):
            if vrb.cell_temp[i][j][12] == 'white':
                vrb.whitecount = vrb.whitecount + 1
            else:
                vrb.blackcount = vrb.blackcount + 1

#after decide the side, transform into desirable location   
def side_transform():    
    if vrb.whitecount > vrb.blackcount:
        vrb.cell = vrb.cell_temp.copy()
    else:
        for i in range(8):
            for j in range(8):
                vrb.cell[i][j][9] = vrb.cell_temp[7-i][7-j][9]
                vrb.cell[i][j][10] = vrb.cell_temp[7-i][7-j][10]
                vrb.cell[i][j][11] = vrb.cell_temp[7-i][7-j][11]
                vrb.cell[i][j][12] = vrb.cell_temp[7-i][7-j][12]

#final transform into exacly the same as the previous cell for comparison(movement detection)
def transform():
    for i in range(8):
        for j in range(8):
                vrb.cell_trans[7 -j][i] = vrb.cell[i][j].copy()

#check for castling
def black_castle():
    if vrb.board.has_queenside_castling_rights(chess.BLACK):
        if vrb.cell_prev[0][0][9] == True and vrb.cell_prev[0][4][9] == True:
            if vrb.cell_prev[0][1][9] == 0 and vrb.cell_prev[0][2][9] == 0 and vrb.cell_prev[0][3][9] == 0:
                if vrb.cell_trans[0][0][9] == 0 and vrb.cell_trans[0][4][9] == 0:
                    if vrb.cell_trans[0][2][9] == True and vrb.cell_trans[0][3][9] == True:
                        vrb.move_string = 'O-O-O'
                        vrb.move = 'e8c8'
                        vrb.moves = chess.Move.from_uci(vrb.move)
                        vrb.cell_prev[0][0][9],vrb.cell_prev[0][0][11],vrb.cell_prev[0][0][12] = 0,0,0
                        vrb.cell_prev[0][2][9],vrb.cell_prev[0][2][11],vrb.cell_prev[0][2][12] = True, 'k', 'black'
                        vrb.cell_prev[0][3][9],vrb.cell_prev[0][3][11],vrb.cell_prev[0][3][12] = True, 'r', 'black'
                        vrb.cell_prev[0][4][9],vrb.cell_prev[0][4][11],vrb.cell_prev[0][4][12] = 0,0,0
                        return True                   
    if vrb.board.has_kingside_castling_rights(chess.BLACK) == True:
        if vrb.cell_prev[0][4][9] == True and vrb.cell_prev[0][7][9] == True:
            if vrb.cell_prev[0][5][9] == 0 and vrb.cell_prev[0][6][9] == 0:
                if vrb.cell_trans[0][4][9] == 0 and vrb.cell_trans[0][7][9] == 0:
                    if vrb.cell_trans[0][5][9] == True and vrb.cell_trans[0][6][9] == True:
                        vrb.move_string = 'O-O'
                        vrb.move = 'e8g8'
                        vrb.moves = chess.Move.from_uci(vrb.move)
                        vrb.cell_prev[0][4][9],vrb.cell_prev[0][4][11],vrb.cell_prev[0][4][12] = 0,0,0
                        vrb.cell_prev[0][5][9],vrb.cell_prev[0][5][11],vrb.cell_prev[0][5][12] = True, 'r', 'black'
                        vrb.cell_prev[0][6][9],vrb.cell_prev[0][6][11],vrb.cell_prev[0][6][12] = True, 'k', 'black'
                        vrb.cell_prev[0][7][9],vrb.cell_prev[0][7][11],vrb.cell_prev[0][7][12] = 0,0,0
                        return True
    return False
    

def white_castle():
    if vrb.board.has_queenside_castling_rights(chess.WHITE):
        if vrb.cell_prev[7][0][9] == True and vrb.cell_prev[7][4][9] == True:
            if vrb.cell_prev[7][1][9] == 0 and vrb.cell_prev[7][2][9] == 0 and vrb.cell_prev[7][3][9] == 0:
                if vrb.cell_trans[7][0][9] == 0 and vrb.cell_trans[7][4][9] == 0:
                    if vrb.cell_trans[7][2][9] == True and vrb.cell_trans[7][3][9] == True:
                        vrb.move_string = 'O-O-O'
                        vrb.move = 'e1c1'
                        vrb.moves = chess.Move.from_uci(vrb.move)
                        vrb.cell_prev[7][0][9],vrb.cell_prev[7][0][11],vrb.cell_prev[7][0][12] = 0,0,0
                        vrb.cell_prev[7][2][9],vrb.cell_prev[7][2][11],vrb.cell_prev[7][2][12] = True, 'k', 'white'
                        vrb.cell_prev[7][3][9],vrb.cell_prev[7][3][11],vrb.cell_prev[7][3][12] = True, 'r', 'white'
                        vrb.cell_prev[7][4][9],vrb.cell_prev[7][4][11],vrb.cell_prev[7][4][12] = 0,0,0
                        return True            
    if vrb.board.has_kingside_castling_rights(chess.WHITE):
        if vrb.cell_prev[7][4][9] == True and vrb.cell_prev[7][7][9] == True:
            if vrb.cell_prev[7][5][9] == 0 and vrb.cell_prev[7][6][9] == 0:
                if vrb.cell_trans[7][4][9] == 0 and vrb.cell_trans[7][7][9] == 0:
                    if vrb.cell_trans[7][5][9] == True and vrb.cell_trans[7][6][9] == True:
                        vrb.move_string = 'O-O'
                        vrb.move = 'e1g1'
                        vrb.moves = chess.Move.from_uci(vrb.move)
                        vrb.cell_prev[7][4][9],vrb.cell_prev[7][4][11],vrb.cell_prev[7][4][12] = 0,0,0
                        vrb.cell_prev[7][5][9],vrb.cell_prev[7][5][11],vrb.cell_prev[7][5][12] = True, 'r', 'white'
                        vrb.cell_prev[7][6][9],vrb.cell_prev[7][6][11],vrb.cell_prev[7][6][12] = True, 'k', 'white'
                        vrb.cell_prev[7][7][9],vrb.cell_prev[7][7][11],vrb.cell_prev[7][7][12] = 0,0,0
                        return True
    return False

#check the movement through comparison of array obtain, save the move into an array if it is a valid move
def check_move():
    if vrb.board.turn:
        color = 'white'
    else:
        color = 'black'
    for i in range(8):
        for j in range(8):
            if vrb.cell_prev[7-i][j][12] == color:
                if (vrb.cell_trans[7-i][j][9] == 0) and (vrb.cell_prev[7-i][j][9] == True):
                    for k in range(8):
                        for l in range(8):
                            if (vrb.cell_trans[7-k][l][9] == True) and (vrb.cell_prev[7-k][l][9] == 0):
                                if vrb.cell_trans[7-k][l][12] == color:
                                    if i == 6 and k == 7 and j == l and (vrb.cell_prev[7-i][j][11] == 'P'):
                                        promote = (vrb.cell_trans[7-k][l][11]).lower()
                                        if promote in ('q','n','b','r'):
                                            vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8] + promote)
                                            vrb.moves = chess.Move.from_uci(vrb.move)
                                            if vrb.board.is_legal(vrb.moves):
                                                vrb.v_move_clist.append(vrb.move)
                                    elif i == 1 and k == 0 and j == l and (vrb.cell_prev[7-i][j][11] == 'p'):
                                        promote = (vrb.cell_trans[7-k][l][11]).lower()
                                        if promote in ('q','n','b','r'):
                                            vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8] + promote)
                                            vrb.moves = chess.Move.from_uci(vrb.move)
                                            if vrb.board.is_legal(vrb.moves):
                                                vrb.v_move_clist.append(vrb.move)
                                    else:                                     
                                        vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8])
                                        vrb.moves = chess.Move.from_uci(vrb.move)
                                        if vrb.board.is_legal(vrb.moves):
                                            if vrb.cell_trans[7-k][l][11] == vrb.cell_prev[7-i][j][11]:
                                                vrb.v_move_clist.append(vrb.move)
                                            else:
                                                vrb.v_move_dlist.append(vrb.move)
                                else:
                                    vrb.move = None
                                    vrb.moves = None
                                    continue
                            elif vrb.cell_trans[7-k][l][9] != 0 and vrb.cell_prev[7-k][l][9] !=0 and vrb.cell_trans[7-k][l][12] != vrb.cell_prev[7-k][l][12] and vrb.cell_trans[7-k][l][11] != vrb.cell_prev[7-k][l][11]:
                                if vrb.cell_trans[7-k][l][12] == color:
                                    if i == 6 and k == 7 and j-1 <= l <= j+1 and j !=l and (vrb.cell_prev[7-i][j][11] == 'P'):
                                        promote = (vrb.cell_trans[7-k][l][11]).lower()
                                        if promote in ('q','n','b','r'):
                                            vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8] + promote)
                                            vrb.moves = chess.Move.from_uci(vrb.move)
                                            if vrb.board.is_legal(vrb.moves):
                                                vrb.v_move_clist.append(vrb.move)
                                    elif i == 1 and k == 0 and j-1 <= l <= j+1 and j !=l and  (vrb.cell_prev[7-i][j][11] == 'p'):
                                        promote = (vrb.cell_trans[7-k][l][11]).lower()
                                        if promote in ('q','n','b','r'):
                                            vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8] + promote)
                                            vrb.moves = chess.Move.from_uci(vrb.move)
                                            if vrb.board.is_legal(vrb.moves):
                                                vrb.v_move_clist.append(vrb.move)
                                    else:                                     
                                        vrb.move = str(vrb.cell_trans[7-i][j][8] + vrb.cell_trans[7-k][l][8])
                                        vrb.moves = chess.Move.from_uci(vrb.move)
                                        if vrb.board.is_legal(vrb.moves):
                                            if vrb.cell_trans[7-k][l][11] == vrb.cell_prev[7-i][j][11]:
                                                vrb.v_move_clist.append(vrb.move)
                                            else:
                                                vrb.v_move_dlist.append(vrb.move)
                                else:
                                    vrb.move = None
                                    vrb.moves = None
                                    continue
                            else:
                                continue
                else:
                    continue
            else:
                continue

#if the movement detection is wrong, user will click the wrong detection button
#call the function to change the wrong movement detected
def detect_error():
    fdm.setIllegalMove(True)
    vrb.board.pop()
    vrb.cell_prev = vrb.cell_prev_backup.copy()
    enter = True
    while enter:
        try:
            vrb.move = "" 
            if fdm.readWrongDetection():
                fdm.setIllegalMove(True)
            while vrb.move == "":
                vrb.move = fdm.readIllegalCorrectMove()
            vrb.moves = chess.Move.from_uci(vrb.move)
            if vrb.board.is_legal(vrb.moves):
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
                print(vrb.board)
                fdm.fixLiveMove(vrb.board.fen(),san_notation)
                fdm.fixLivePosition(vrb.board.fen())
                enter = False
            else:
                vrb.move = None
                vrb.moves = None
                print("Invalid move. Please try again.")
        except chess.InvalidMoveError:
            print("Invalid UCI move. Please enter a valid UCI move.")

    