import sys
sys.path.append('/libsvm-3.22/python') #Path to libsvm directory
sys.path.append('/Users/aditi/anaconda/lib/python2.7/site-packages')
sys.path.append('/Users/aditi/anaconda/lib/site-python')

from flask import Flask, url_for, send_from_directory, request
import logging, os
from werkzeug import secure_filename
import datetime
import time
from model import *
from texure_detection import *

app = Flask(__name__)
file_handler = logging.FileHandler('server.log')
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)

PROJECT_HOME = os.path.dirname(os.path.realpath(__file__))
UPLOAD_FOLDER = '{}/uploads/'.format(PROJECT_HOME)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def create_new_folder(local_dir):
	newpath = local_dir
	if not os.path.exists(newpath):
		os.makedirs(newpath)
	return newpath

@app.route('/', methods = ['POST'])
def api_root():
	app.logger.info(PROJECT_HOME)
	if request.method == 'POST' and request.files['image']:
		app.logger.info(app.config['UPLOAD_FOLDER'])
		img = request.files['image']
		#img_name = secure_filename(img.filename)
		ts = time.time()
		img_name_2 = datetime.datetime.fromtimestamp(ts).strftime('%Y_%m_%d_%H_%M_%S')
		create_new_folder(app.config['UPLOAD_FOLDER'])
		saved_path = os.path.join(app.config['UPLOAD_FOLDER'], img_name_2) # We ignore the extension of the file, assuming it is an image
		app.logger.info("saving {}".format(saved_path))
		img.save(saved_path)


		# call the prediction module to predict the items
		item = make_prediction(saved_path)
		svc_texture, rf_texture = find_texture(item, saved_path)
		"""
		Item from make_prediction is a list in the form of: ['capsicum']
		Call the functions of freshness here
		and return the details
		"""
		
		
		app.logger.info("Predicted Item : {}".format(item[0]))
		app.logger.info("Predicted Quality using SVC: {}".format(svc_texture))
		app.logger.info("Predicted Quality using Random Forest: {}".format(rf_texture))
		#return 'Completed Processing'
		return_string = 'Predicted Item = '+item[0]+'\nPredicted Quality using SVC = '+svc_texture+'\nPredicted Quality using RF = '+rf_texture
		return return_string
	else:
		return "Where is the image?"

if __name__ == '__main__':
	app.run(host='192.168.10.107', debug=False)
