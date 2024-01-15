import cv2
import numpy as np
import variable as vrb

#find intersection of 2 line
def intersect(a,b,c,d):    
    # standard form line eq Line_AB
    a1 = b[1]-a[1]
    b1 = a[0]-b[0]
    c1 = a1*a[0] + b1*a[1]
    # standard form line eq Line_CD
    a2 = d[1]-c[1]
    b2 = c[0]-d[0]
    c2 = a2*c[0] + b2*c[1]
    determinant = a1*b2 - a2*b1
    x = (b2*c1 - b1*c2)/determinant
    y = (a1*c2 - a2*c1)/determinant
    return x,y

#extract corner coordinate and record into array
def locate_Corner(ret, corners):
    a = np.ravel(corners)
    x = 0
    for i in range(7):
        for j in range(3):
            for k in range(2):
                vrb.edge_coor[1+i][3+j][k] = a[x]
                x = x + 1
    image = cv2.imread('board_detect.jpg')
    initial_board = cv2.drawChessboardCorners(image, (3,7), corners,ret)
    cv2.imshow('Chessboard Detected',initial_board)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    calc_corner()

def calc_corner():
    #manually calculate every corner in the chessboard based on the point found in function locate_Corner by using intersection of 2 lines
    vrb.edge_coor[0][1][0],vrb.edge_coor[0][1][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[2][5],vrb.edge_coor[2][3],vrb.edge_coor[4][5])
    vrb.edge_coor[0][2][0],vrb.edge_coor[0][2][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[3][5],vrb.edge_coor[2][3],vrb.edge_coor[4][4])
    vrb.edge_coor[0][3][0],vrb.edge_coor[0][3][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[7][3],vrb.edge_coor[1][4],vrb.edge_coor[2][5])
    vrb.edge_coor[0][5][0],vrb.edge_coor[0][5][1] = intersect(vrb.edge_coor[1][5],vrb.edge_coor[7][5],vrb.edge_coor[1][4],vrb.edge_coor[2][3])
    vrb.edge_coor[0][6][0],vrb.edge_coor[0][6][1] = intersect(vrb.edge_coor[1][5],vrb.edge_coor[3][3],vrb.edge_coor[2][5],vrb.edge_coor[4][4])
    vrb.edge_coor[0][7][0],vrb.edge_coor[0][7][1] = intersect(vrb.edge_coor[1][5],vrb.edge_coor[2][3],vrb.edge_coor[2][5],vrb.edge_coor[4][3])

    vrb.edge_coor[1][1][0],vrb.edge_coor[1][1][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[1][5],vrb.edge_coor[2][3],vrb.edge_coor[3][5])
    vrb.edge_coor[1][2][0],vrb.edge_coor[1][2][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[1][5],vrb.edge_coor[2][3],vrb.edge_coor[4][5])
    vrb.edge_coor[1][6][0],vrb.edge_coor[1][6][1] = intersect(vrb.edge_coor[1][5],vrb.edge_coor[1][3],vrb.edge_coor[2][5],vrb.edge_coor[4][3])
    vrb.edge_coor[1][7][0],vrb.edge_coor[1][7][1] = intersect(vrb.edge_coor[1][5],vrb.edge_coor[1][3],vrb.edge_coor[2][5],vrb.edge_coor[3][3])

    vrb.edge_coor[2][1][0],vrb.edge_coor[2][1][1] = intersect(vrb.edge_coor[2][3],vrb.edge_coor[2][5],vrb.edge_coor[3][3],vrb.edge_coor[4][5])
    vrb.edge_coor[2][2][0],vrb.edge_coor[2][2][1] = intersect(vrb.edge_coor[2][3],vrb.edge_coor[2][5],vrb.edge_coor[3][3],vrb.edge_coor[5][5])
    vrb.edge_coor[2][6][0],vrb.edge_coor[2][6][1] = intersect(vrb.edge_coor[2][5],vrb.edge_coor[2][3],vrb.edge_coor[3][5],vrb.edge_coor[5][3])
    vrb.edge_coor[2][7][0],vrb.edge_coor[2][7][1] = intersect(vrb.edge_coor[2][5],vrb.edge_coor[2][3],vrb.edge_coor[3][5],vrb.edge_coor[4][3])

    vrb.edge_coor[3][1][0],vrb.edge_coor[3][1][1] = intersect(vrb.edge_coor[3][3],vrb.edge_coor[3][5],vrb.edge_coor[2][3],vrb.edge_coor[1][5])
    vrb.edge_coor[3][2][0],vrb.edge_coor[3][2][1] = intersect(vrb.edge_coor[3][3],vrb.edge_coor[3][5],vrb.edge_coor[2][3],vrb.edge_coor[1][4])
    vrb.edge_coor[3][6][0],vrb.edge_coor[3][6][1] = intersect(vrb.edge_coor[3][5],vrb.edge_coor[3][3],vrb.edge_coor[2][5],vrb.edge_coor[1][4])
    vrb.edge_coor[3][7][0],vrb.edge_coor[3][7][1] = intersect(vrb.edge_coor[3][5],vrb.edge_coor[3][3],vrb.edge_coor[2][5],vrb.edge_coor[1][3])

    vrb.edge_coor[4][1][0],vrb.edge_coor[4][1][1] = intersect(vrb.edge_coor[4][3],vrb.edge_coor[4][5],vrb.edge_coor[3][3],vrb.edge_coor[2][5])
    vrb.edge_coor[4][2][0],vrb.edge_coor[4][2][1] = intersect(vrb.edge_coor[4][3],vrb.edge_coor[4][5],vrb.edge_coor[3][3],vrb.edge_coor[1][5])
    vrb.edge_coor[4][6][0],vrb.edge_coor[4][6][1] = intersect(vrb.edge_coor[4][5],vrb.edge_coor[4][3],vrb.edge_coor[3][5],vrb.edge_coor[1][3])
    vrb.edge_coor[4][7][0],vrb.edge_coor[4][7][1] = intersect(vrb.edge_coor[4][5],vrb.edge_coor[4][3],vrb.edge_coor[3][5],vrb.edge_coor[2][3])

    vrb.edge_coor[5][1][0],vrb.edge_coor[5][1][1] = intersect(vrb.edge_coor[5][3],vrb.edge_coor[5][5],vrb.edge_coor[4][3],vrb.edge_coor[3][5])
    vrb.edge_coor[5][2][0],vrb.edge_coor[5][2][1] = intersect(vrb.edge_coor[5][3],vrb.edge_coor[5][5],vrb.edge_coor[4][3],vrb.edge_coor[3][4])
    vrb.edge_coor[5][6][0],vrb.edge_coor[5][6][1] = intersect(vrb.edge_coor[5][5],vrb.edge_coor[5][3],vrb.edge_coor[4][5],vrb.edge_coor[3][4])
    vrb.edge_coor[5][7][0],vrb.edge_coor[5][7][1] = intersect(vrb.edge_coor[5][5],vrb.edge_coor[5][3],vrb.edge_coor[4][5],vrb.edge_coor[3][3])

    vrb.edge_coor[6][1][0],vrb.edge_coor[6][1][1] = intersect(vrb.edge_coor[6][3],vrb.edge_coor[6][5],vrb.edge_coor[5][3],vrb.edge_coor[4][5])
    vrb.edge_coor[6][2][0],vrb.edge_coor[6][2][1] = intersect(vrb.edge_coor[6][3],vrb.edge_coor[6][5],vrb.edge_coor[5][3],vrb.edge_coor[3][5])
    vrb.edge_coor[6][6][0],vrb.edge_coor[6][6][1] = intersect(vrb.edge_coor[6][5],vrb.edge_coor[6][3],vrb.edge_coor[5][5],vrb.edge_coor[3][3])
    vrb.edge_coor[6][7][0],vrb.edge_coor[6][7][1] = intersect(vrb.edge_coor[6][5],vrb.edge_coor[6][3],vrb.edge_coor[5][5],vrb.edge_coor[4][3])

    vrb.edge_coor[7][1][0],vrb.edge_coor[7][1][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[7][5],vrb.edge_coor[6][3],vrb.edge_coor[5][5])
    vrb.edge_coor[7][2][0],vrb.edge_coor[7][2][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[7][5],vrb.edge_coor[6][3],vrb.edge_coor[5][4])
    vrb.edge_coor[7][6][0],vrb.edge_coor[7][6][1] = intersect(vrb.edge_coor[7][5],vrb.edge_coor[7][3],vrb.edge_coor[6][5],vrb.edge_coor[5][4])
    vrb.edge_coor[7][7][0],vrb.edge_coor[7][7][1] = intersect(vrb.edge_coor[7][5],vrb.edge_coor[7][3],vrb.edge_coor[6][5],vrb.edge_coor[5][3])

    vrb.edge_coor[8][1][0],vrb.edge_coor[8][1][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[6][5],vrb.edge_coor[6][3],vrb.edge_coor[5][4])
    vrb.edge_coor[8][2][0],vrb.edge_coor[8][2][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[6][4],vrb.edge_coor[6][3],vrb.edge_coor[4][4])
    vrb.edge_coor[8][3][0],vrb.edge_coor[8][3][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[1][3],vrb.edge_coor[7][4],vrb.edge_coor[6][5])
    vrb.edge_coor[8][5][0],vrb.edge_coor[8][5][1] = intersect(vrb.edge_coor[7][5],vrb.edge_coor[1][5],vrb.edge_coor[7][4],vrb.edge_coor[6][3])
    vrb.edge_coor[8][6][0],vrb.edge_coor[8][6][1] = intersect(vrb.edge_coor[7][5],vrb.edge_coor[5][3],vrb.edge_coor[6][5],vrb.edge_coor[4][4])
    vrb.edge_coor[8][7][0],vrb.edge_coor[8][7][1] = intersect(vrb.edge_coor[7][5],vrb.edge_coor[6][3],vrb.edge_coor[6][5],vrb.edge_coor[4][3])

    vrb.edge_coor[0][4][0],vrb.edge_coor[0][4][1] = intersect(vrb.edge_coor[1][4],vrb.edge_coor[7][4],vrb.edge_coor[1][3],vrb.edge_coor[2][2])
    vrb.edge_coor[8][4][0],vrb.edge_coor[8][4][1] = intersect(vrb.edge_coor[1][4],vrb.edge_coor[7][4],vrb.edge_coor[7][3],vrb.edge_coor[6][2])

    vrb.edge_coor[0][0][0],vrb.edge_coor[0][0][1] = intersect(vrb.edge_coor[1][2],vrb.edge_coor[2][4],vrb.edge_coor[2][2],vrb.edge_coor[4][4])
    vrb.edge_coor[8][0][0],vrb.edge_coor[8][0][1] = intersect(vrb.edge_coor[7][2],vrb.edge_coor[6][4],vrb.edge_coor[6][2],vrb.edge_coor[4][4])
    vrb.edge_coor[1][0][0],vrb.edge_coor[1][0][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[1][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[2][0][0],vrb.edge_coor[2][0][1] = intersect(vrb.edge_coor[2][3],vrb.edge_coor[2][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[3][0][0],vrb.edge_coor[3][0][1] = intersect(vrb.edge_coor[3][3],vrb.edge_coor[3][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[4][0][0],vrb.edge_coor[4][0][1] = intersect(vrb.edge_coor[4][3],vrb.edge_coor[4][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[5][0][0],vrb.edge_coor[5][0][1] = intersect(vrb.edge_coor[5][3],vrb.edge_coor[5][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[6][0][0],vrb.edge_coor[6][0][1] = intersect(vrb.edge_coor[6][3],vrb.edge_coor[6][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])
    vrb.edge_coor[7][0][0],vrb.edge_coor[7][0][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[7][5],vrb.edge_coor[0][0],vrb.edge_coor[8][0])

    vrb.edge_coor[0][8][0],vrb.edge_coor[0][8][1] = intersect(vrb.edge_coor[1][6],vrb.edge_coor[2][4],vrb.edge_coor[2][6],vrb.edge_coor[4][4])
    vrb.edge_coor[8][8][0],vrb.edge_coor[8][8][1] = intersect(vrb.edge_coor[7][6],vrb.edge_coor[6][4],vrb.edge_coor[6][6],vrb.edge_coor[4][4])
    vrb.edge_coor[1][8][0],vrb.edge_coor[1][8][1] = intersect(vrb.edge_coor[1][3],vrb.edge_coor[1][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[2][8][0],vrb.edge_coor[2][8][1] = intersect(vrb.edge_coor[2][3],vrb.edge_coor[2][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[3][8][0],vrb.edge_coor[3][8][1] = intersect(vrb.edge_coor[3][3],vrb.edge_coor[3][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[4][8][0],vrb.edge_coor[4][8][1] = intersect(vrb.edge_coor[4][3],vrb.edge_coor[4][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[5][8][0],vrb.edge_coor[5][8][1] = intersect(vrb.edge_coor[5][3],vrb.edge_coor[5][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[6][8][0],vrb.edge_coor[6][8][1] = intersect(vrb.edge_coor[6][3],vrb.edge_coor[6][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    vrb.edge_coor[7][8][0],vrb.edge_coor[7][8][1] = intersect(vrb.edge_coor[7][3],vrb.edge_coor[7][5],vrb.edge_coor[0][8],vrb.edge_coor[8][8])
    img = cv2.imread('board_detect.jpg')
    for i in range(9):
        for j in range(9):
            c = (int(vrb.edge_coor[i][j][0]),int(vrb.edge_coor[i][j][1]))
            corner_detect = cv2.circle(img, c, 2, (0,0,255), -1)
    cv2.imshow('Chessboard Detected',corner_detect)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
