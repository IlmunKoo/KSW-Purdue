#At the moment, this file is unlikely to be changed.

#import
import random

cells = {} #Dictionary; cells["A11"] can access to Cell variable.

class Cell():
	reward_for_disaster_area = -1.3
	reward_for_disaster_predicted_area = -0.8
	reward_for_exit = 1.0
	reward_for_cell = -0.01
	reward_for_cell_type = {'E' : reward_for_exit, 'R' : reward_for_cell, 'C' : reward_for_cell, 'S' : reward_for_cell} #Add cell type for fire-prone cells

	def __init__(self, id: str, cell_type: str):
		self.id = id
		self.cell_type = cell_type #E, R, C, S for Exit, Room, Cell, Stair
		self.adjacent_cells = []
		self.number_of_people = 0
		self.reward = Cell.reward_for_cell_type[self.cell_type]
		self.disaster_area = False
		self.disaster_predicted_area = False
		self.congested_area = False

	def update_congested_area(self):
		self.congested_area = self.number_of_people >= 5
		if self.disaster_area or self.disaster_predicted_area:
			return
		self.reward = Cell.reward_for_disaster_predicted_area if self.congested_area else Cell.reward_for_cell_type[self.cell_type]
	
	def update_disaster_predicted_area(self):
		self.disaster_predicted_area = True
		if not self.disaster_area:
			self.reward = Cell.reward_for_disaster_predicted_area

	def update_disaster_area(self):
		self.disaster_area = True
		self.reward = Cell.reward_for_disaster_area
		for cell in self.adjacent_cells:
			cell.update_disaster_predicted_area()

class Agent():
	def __init__(self):
		self.alpha = 0.1
		self.gamma = 0.8
		self.epsilon = 1
		self.qtable = {cell : 0.0 for cell in cells.values()} #qtable for cells; qtable[cell] = qvalue

	def q(self, curr_cell: Cell, destination_cell: Cell):
		next_state_max_q = max(self.qtable[cell] for cell in curr_cell.adjacent_cells if cell.cell_type != 'R')
		reward = curr_cell.reward
		if curr_cell.cell_type == 'E' and curr_cell != destination_cell and not curr_cell.disaster_area and not curr_cell.disaster_predicted_area:
			reward = -0.01
		self.qtable[curr_cell] = self.qtable[curr_cell] + self.alpha * (reward + self.gamma * next_state_max_q - self.qtable[curr_cell])
		return self.qtable[curr_cell]

	def q_learning(self, num_simulations: int, starting_cell: Cell, destination_cell: Cell):
		for _ in range(num_simulations):
			curr_cell = starting_cell
			new_epsilon = 1 - _ / num_simulations #When num_simulations = 250, epsilon moves 1 to 0.004
			self.epsilon = new_epsilon if new_epsilon > 0 else self.epsilon
			previouse_cell: Cell = None
			while (curr_cell != destination_cell):
				rand_num = random.random()
				next_cell = curr_cell
				if rand_num < self.epsilon:
					adjacent_cells_without_rooms = [cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R' and cell != previouse_cell]
					if adjacent_cells_without_rooms:
						next_cell = random.choice(adjacent_cells_without_rooms)
					else:
						next_cell = random.choice([cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R'])
				else:
					possible_cells = [cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R' and cell != previouse_cell]
					if not possible_cells:
						possible_cells = [cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R']
					best_next_move_q = float('-inf')
					for cell in possible_cells:
						if self.qtable[cell] >= best_next_move_q:
							next_cell = cell
							best_next_move_q = self.qtable[cell]
				self.q(curr_cell, destination_cell)
				previouse_cell = curr_cell
				curr_cell = next_cell
			self.q(destination_cell, destination_cell)

	def get_evacuation_route(self, starting_cell: Cell, destination_cell: Cell):
		previous_cell = None
		curr_cell = starting_cell
		path = [starting_cell.id]
		while (curr_cell != destination_cell):
			possible_next_cells = [cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R' and cell != previous_cell]
			if not possible_next_cells:
				possible_next_cells = [cell for cell in curr_cell.adjacent_cells if cell.cell_type != 'R']
			best_next_cell: Cell
			best_next_cell_q = float('-inf')
			for cell in possible_next_cells:
				if self.qtable[cell] >= best_next_cell_q:
					best_next_cell = cell
					best_next_cell_q = self.qtable[cell]
			previous_cell = curr_cell
			curr_cell = best_next_cell
			path.append(curr_cell.id)
		return path

def initialize_cells():
	#EXIT
	S01 = Cell("S01", "E"); cells["S01"] = S01
	E01 = Cell("E01", "E"); cells["E01"] = E01
	E02 = Cell("E02", "E"); cells["E02"] = E02
	E03 = Cell("E03", "E"); cells["E03"] = E03

	#ROOM
	R01 = Cell("R01", "R"); cells["R01"] = R01
	R02 = Cell("R02", "R"); cells["R02"] = R02
	R03 = Cell("R03", "R"); cells["R03"] = R03
	R04 = Cell("R04", "R"); cells["R04"] = R04
	R05 = Cell("R05", "R"); cells["R05"] = R05

	#STAIR
	S02 = Cell("S02", "S"); cells["S02"] = S02
	S04 = Cell("S04", "S"); cells["S04"] = S04
	S05 = Cell("S05", "S"); cells["S05"] = S05
	S06 = Cell("S06", "S"); cells["S06"] = S06
	S07 = Cell("S07", "S"); cells["S07"] = S07
	S08 = Cell("S08", "S"); cells["S08"] = S08
	S09 = Cell("S09", "S"); cells["S09"] = S09

	#CELL
	S03 = Cell("S03", "C"); cells["S03"] = S03
	H01 = Cell("H01", "C"); cells["H01"] = H01
	H02 = Cell("H02", "C"); cells["H02"] = H02
	U01 = Cell("U01", "C"); cells["U01"] = U01
	A01 = Cell("A01", "C"); cells["A01"] = A01
	A02 = Cell("A02", "C"); cells["A02"] = A02
	A03 = Cell("A03", "C"); cells["A03"] = A03
	A04 = Cell("A04", "C"); cells["A04"] = A04
	A05 = Cell("A05", "C"); cells["A05"] = A05
	A06 = Cell("A06", "C"); cells["A06"] = A06
	A07 = Cell("A07", "C"); cells["A07"] = A07
	A08 = Cell("A08", "C"); cells["A08"] = A08
	A09 = Cell("A09", "C"); cells["A09"] = A09
	A10 = Cell("A10", "C"); cells["A10"] = A10
	A11 = Cell("A11", "C"); cells["A11"] = A11

	#EXIT
	S01.adjacent_cells = [E01]
	E01.adjacent_cells = [R03, A01, S01, S02]
	E02.adjacent_cells = [S07, S08]
	E03.adjacent_cells = [A11]

	#ROOM
	R01.adjacent_cells = [A03]
	R02.adjacent_cells = [A01]
	R03.adjacent_cells = [E01]
	R04.adjacent_cells = [A01]
	R05.adjacent_cells = [A05]

	#STAIR
	S02.adjacent_cells = [E01, S03]
	S04.adjacent_cells = [H01, S03]
	S05.adjacent_cells = [S06, H01]
	S06.adjacent_cells = [S05, H02]
	S07.adjacent_cells = [E02, H02]
	S08.adjacent_cells = [E02, S09]
	S09.adjacent_cells = [S08, U01]

	#CELL
	S03.adjacent_cells = [S02, S04]
	H01.adjacent_cells = [S04, S05]
	H02.adjacent_cells = [A07, S07, S06]
	U01.adjacent_cells = [S09]
	A01.adjacent_cells = [E01, R02, R04, A02]
	A02.adjacent_cells = [A01, A03, A08]
	A03.adjacent_cells = [A04, A02, A08, R01]
	A04.adjacent_cells = [A05, A03, A08, A09]
	A05.adjacent_cells = [A09, A04, A06, R05]
	A06.adjacent_cells = [A05, A09, A07]
	A07.adjacent_cells = [H02, A10, A06, A09]
	A08.adjacent_cells = [A09, A04, A03, A02]
	A09.adjacent_cells = [A04, A05, A06, A07, A08, A10, A11]
	A10.adjacent_cells = [A11, A07, A09]
	A11.adjacent_cells = [E03, A10, A09]

def path_printer(path):
	for cell in path:
		print(cell, end=' ')
	print()

def main():
	initialize_cells()
	for cell in cells.values():
		episode = 250
		a1 = Agent(); a2 = Agent(); a3 = Agent(); a4 = Agent()
		a1.q_learning(episode, cell, cells["S01"]); print(cell.id + " to " + "S01: ", end = ''); p1 = a1.get_evacuation_route(cell, cells["S01"]); path_printer(p1)
		a2.q_learning(episode, cell, cells["E01"]); print(cell.id + " to " + "E01: ", end = ''); p2 = a2.get_evacuation_route(cell, cells["E01"]); path_printer(p2)
		a3.q_learning(episode, cell, cells["E02"]); print(cell.id + " to " + "E02: ", end = ''); p3 = a3.get_evacuation_route(cell, cells["E02"]); path_printer(p3)
		a4.q_learning(episode, cell, cells["E03"]); print(cell.id + " to " + "E03: ", end = ''); p4 = a4.get_evacuation_route(cell, cells["E03"]); path_printer(p4)

if __name__ == "__main__":
	main()
