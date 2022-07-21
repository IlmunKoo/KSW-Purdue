#At the moment, this file is unlikely to be changed.

#import
import pie_flask
import mobile_flask
from q_learning import *
from multiprocessing import Process

def main():
	try:
		#Initialize cells for q learning.
		initialize_cells()
		#Process for raspberry_pie - server.
		pie_process = Process(target = pie_flask.pie_flask_main)
		#Process for mobile - server.
		mobile_process = Process(target = mobile_flask.mobile_flask_main)
		pie_process.start()
		mobile_process.start()
		pie_process.join()
		mobile_process.join()

	except KeyboardInterrupt:
		pie_process.terminate()
		pie_process.join()
		mobile_process.terminate()
		mobile_process.join()

if __name__ == "__main__":
	main()
