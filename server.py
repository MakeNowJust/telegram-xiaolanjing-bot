import pycorrector
import re
from flask import Flask
from flask import request

app = Flask(__name__)

pycorrector.correct('因该为老人让坐')

@app.route('/corrector')
def corrector():
    return '{text: "%s"}' % pycorrector.correct(request.args['text'])[0]

app.run();
