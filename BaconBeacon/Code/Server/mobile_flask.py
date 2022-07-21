#At the moment, this file is unlikely to be changed.

#import
import random
from user import *
from q_learning import *
from threading import Thread
from flask import Flask, request
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app)
users = {} #sid to User

def mobile_flask_main():
	socketio.run(app, host = "0.0.0.0", port = 12000, debug = True) 

def main():
	initialize_cells()
	mobile_flask_main()

@socketio.on("connect")
def connect(auth):
	user_id = request.sid
	location = auth["location"]
	new_user = User(user_id, location)
	users[user_id] = new_user

	a1 = Agent(); a2 = Agent(); a3 = Agent(); a4 = Agent()
	dic = {}
	number_of_episode = 250
	t1 = Thread(target = a1.q_learning, args = (number_of_episode, cells[location], cells["S01"])); t1.daemon = True; t1.start(); t1.join()
	t2 = Thread(target = a2.q_learning, args = (number_of_episode, cells[location], cells["E01"])); t2.daemon = True; t2.start(); t2.join()
	t3 = Thread(target = a3.q_learning, args = (number_of_episode, cells[location], cells["E02"])); t3.daemon = True; t3.start(); t3.join()
	t4 = Thread(target = a4.q_learning, args = (number_of_episode, cells[location], cells["E03"])); t4.daemon = True; t4.start(); t4.join()
	p1 = a1.get_evacuation_route(cells[location], cells["S01"]); r1 = a1.qtable[cells["S01"]] - len(p1); dic[r1] = p1
	p2 = a2.get_evacuation_route(cells[location], cells["E01"]); r2 = a2.qtable[cells["E01"]] - len(p2); dic[r2] = p2
	p3 = a3.get_evacuation_route(cells[location], cells["E02"]); r3 = a3.qtable[cells["E02"]] - len(p3); dic[r3] = p3
	p4 = a4.get_evacuation_route(cells[location], cells["E03"]); r4 = a4.qtable[cells["E03"]] - len(p4); dic[r4] = p4
	lst = [r1, r2, r3, r4]; lst.sort(); key = random.choice(lst[2 : 4])
	path = dic[key] 

	for cell in path:
		new_user.path[cell] = 0
	new_user.path[location] = 1
	socketio.emit("path", path, room = user_id)
	print("Client {0} connected. Number of connected clients = {1}".format(user_id, len(users)))

@socketio.on("location")
def get_location(data):
	user_id = request.sid
	location = data
	previous_location = users[user_id].location
	cells[previous_location].number_of_people -= 1
	cells[previous_location].update_congested_area()
	cells[location].number_of_people += 1
	cells[location].update_congested_area()
	users[user_id].location = location

@socketio.on("disconnect")
def disconnect():
	user_id = request.sid
	del users[user_id]
	print("Client {0} disconnected. Number of connected clients = {1}".format(user_id, len(users)))

if __name__ == '__main__':
	main()
