import re
from flask import Flask
from flask import request
import jiagu

app = Flask(__name__)

jiagu.init()

@app.route('/jiagu')
def j():
    return '{"text": "%s"}' % jiagu.seg(request.args['text'])

if __name__ == '__main__':
    app.run()
