# knowledge-graph/server.py
from flask import Flask, request, jsonify
from scientific_knowledge import ScientificKnowledgeGraph

app = Flask(__name__)
kg = ScientificKnowledgeGraph()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "knowledge-graph"})

@app.route('/related', methods=['GET'])
def related():
    concept = request.args.get('concept', '')
    if not concept:
        return jsonify({"error": "No concept provided"}), 400
        
    results = kg.find_related_concepts(concept)
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)
