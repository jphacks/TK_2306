from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime
import get_free_time_list
import cvt_to_react_style
import add_schedule

app = Flask(__name__, static_folder="./build/static", template_folder="./build")
cors = CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/", methods=['GET', 'POST'])
def react_to_python():
    # free_list = get_free_time_list("2022-06-12", "2022-06-13", "09:00", "18:00", 'kitamura-yuka0808@g.ecc.u-tokyo.ac.jp')
    # formated_data = cvt_to_react_style(free_list)
    add_schedule.create_event('バイト', datetime.datetime(2023, 10, 28, 9, 0, 0), datetime.datetime(2023, 10, 28, 12, 0, 0), 'kitamura-yuka0808@g.ecc.u-tokyo.ac.jp')

    result = {'message': 'OK'}

    # 結果をJSON形式で返す
    return jsonify(result)

if __name__ == "__main__":
    app.debug = True
    app.run(port=8888)
