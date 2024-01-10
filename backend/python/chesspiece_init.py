import variable as vrb
import chess


def board_init():
    board = chess.Board()
    return board

def cell_name():
    for i in range(8):
        match i:
            case 0:
                notation = 'a'
            case 1:
                notation = 'b'
            case 2:
                notation = 'c'
            case 3:
                notation = 'd'
            case 4:
                notation = 'e'
            case 5:
                notation = 'f'
            case 6:
                notation = 'g'
            case 7:
                notation = 'h'
        for j in range(8):
            x = 0
            string = notation + str(j+1)
            vrb.cell[i][j][8] = string
            for k in range(8):
                if x < 2:
                    vrb.cell[i][j][k] = vrb.edge_coor[i][j][k]
                    x += 1
                elif x < 4:
                    vrb.cell[i][j][k] = vrb.edge_coor[i][j + 1][k - 2]
                    x += 1
                elif x < 6:
                    vrb.cell[i][j][k] = vrb.edge_coor[i + 1][j][k - 4]
                    x += 1
                elif x < 8:
                    vrb.cell[i][j][k] = vrb.edge_coor[i + 1][j + 1][k - 6]
                    x += 1
    transform()
    init_loc()

def transform():
    for i in range(8):
        for j in range(8):
            vrb.cell_init[7 - j][i] = vrb.cell[i][j].copy()
            vrb.cell_temp[i][j] = vrb.cell[i][j].copy()

def init_loc():
    vrb.cell_init[0][0][9],vrb.cell_init[0][0][11],vrb.cell_init[0][0][12] = True,'r','black'
    vrb.cell_init[0][1][9],vrb.cell_init[0][1][11],vrb.cell_init[0][1][12] = True,'n','black'
    vrb.cell_init[0][2][9],vrb.cell_init[0][2][11],vrb.cell_init[0][2][12] = True,'b','black'
    vrb.cell_init[0][3][9],vrb.cell_init[0][3][11],vrb.cell_init[0][3][12] = True,'q','black'
    vrb.cell_init[0][4][9],vrb.cell_init[0][4][11],vrb.cell_init[0][4][12] = True,'k','black'
    vrb.cell_init[0][5][9],vrb.cell_init[0][5][11],vrb.cell_init[0][5][12] = True,'b','black'
    vrb.cell_init[0][6][9],vrb.cell_init[0][6][11],vrb.cell_init[0][6][12] = True,'n','black'
    vrb.cell_init[0][7][9],vrb.cell_init[0][7][11],vrb.cell_init[0][7][12] = True,'r','black'

    vrb.cell_init[1][0][9],vrb.cell_init[1][0][11],vrb.cell_init[1][0][12] = True,'p','black'
    vrb.cell_init[1][1][9],vrb.cell_init[1][1][11],vrb.cell_init[1][1][12] = True,'p','black'
    vrb.cell_init[1][2][9],vrb.cell_init[1][2][11],vrb.cell_init[1][2][12] = True,'p','black'
    vrb.cell_init[1][3][9],vrb.cell_init[1][3][11],vrb.cell_init[1][3][12] = True,'p','black'
    vrb.cell_init[1][4][9],vrb.cell_init[1][4][11],vrb.cell_init[1][4][12] = True,'p','black'
    vrb.cell_init[1][5][9],vrb.cell_init[1][5][11],vrb.cell_init[1][5][12] = True,'p','black'
    vrb.cell_init[1][6][9],vrb.cell_init[1][6][11],vrb.cell_init[1][6][12] = True,'p','black'
    vrb.cell_init[1][7][9],vrb.cell_init[1][7][11],vrb.cell_init[1][7][12] = True,'p','black'

    vrb.cell_init[6][0][9],vrb.cell_init[6][0][11],vrb.cell_init[6][0][12] = True,'P','white'
    vrb.cell_init[6][1][9],vrb.cell_init[6][1][11],vrb.cell_init[6][1][12] = True,'P','white'
    vrb.cell_init[6][2][9],vrb.cell_init[6][2][11],vrb.cell_init[6][2][12] = True,'P','white'
    vrb.cell_init[6][3][9],vrb.cell_init[6][3][11],vrb.cell_init[6][3][12] = True,'P','white'
    vrb.cell_init[6][4][9],vrb.cell_init[6][4][11],vrb.cell_init[6][4][12] = True,'P','white'
    vrb.cell_init[6][5][9],vrb.cell_init[6][5][11],vrb.cell_init[6][5][12] = True,'P','white'
    vrb.cell_init[6][6][9],vrb.cell_init[6][6][11],vrb.cell_init[6][6][12] = True,'P','white'
    vrb.cell_init[6][7][9],vrb.cell_init[6][7][11],vrb.cell_init[6][7][12] = True,'P','white'

    vrb.cell_init[7][0][9],vrb.cell_init[7][0][11],vrb.cell_init[7][0][12] = True,'R','white'
    vrb.cell_init[7][1][9],vrb.cell_init[7][1][11],vrb.cell_init[7][1][12] = True,'N','white'
    vrb.cell_init[7][2][9],vrb.cell_init[7][2][11],vrb.cell_init[7][2][12] = True,'B','white'
    vrb.cell_init[7][3][9],vrb.cell_init[7][3][11],vrb.cell_init[7][3][12] = True,'Q','white'
    vrb.cell_init[7][4][9],vrb.cell_init[7][4][11],vrb.cell_init[7][4][12] = True,'K','white'
    vrb.cell_init[7][5][9],vrb.cell_init[7][5][11],vrb.cell_init[7][5][12] = True,'B','white'
    vrb.cell_init[7][6][9],vrb.cell_init[7][6][11],vrb.cell_init[7][6][12] = True,'N','white'
    vrb.cell_init[7][7][9],vrb.cell_init[7][7][11],vrb.cell_init[7][7][12] = True,'R','white'
