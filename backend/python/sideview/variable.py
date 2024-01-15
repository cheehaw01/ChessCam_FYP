#variable file

board = None
edge_coor =[[[0 for x in range(2)]for y in range(9)]for z in range(9)]
cell = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
cell_init = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
cell_prev = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
cell_prev_backup = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
cell_trans = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
cell_temp = [[[0 for x in range(13)]for y in range(8)]for z in range(8)]
move_string = None
move = None
moves = None
v_move_clist = []
v_move_dlist = []
firstround = True
whitecount = 0
blackcount = 0