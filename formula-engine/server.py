# math-parser/server.py
from flask import Flask, request, jsonify
from formula_parser import MathematicalUnderstandingEngine

app = Flask(__name__)
engine = MathematicalUnderstandingEngine()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "math-parser"})

@app.route('/parse', methods=['POST'])
def parse():
    data = request.json
    formula = data.get('formula', '')
    
    if not formula:
        return jsonify({"error": "No formula provided"}), 400
        
    result = engine.parse_formula(formula)
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
