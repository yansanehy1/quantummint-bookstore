# sympy_server.py
from flask import Flask, request, jsonify
from sympy import *
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/evaluate', methods=['POST'])
def evaluate():
    try:
        data = request.get_json()
        expr = sympify(data['expression'])
        result = str(expr.evalf())
        return jsonify({
            'result': result,
            'error': None,
            'latex': latex(expr)  # Optional: Return LaTeX representation
        })
    except Exception as e:
        return jsonify({
            'result': None,
            'error': str(e),
            'latex': None
        })

if __name__ == '__main__':
    app.run(port=5000, debug=True)