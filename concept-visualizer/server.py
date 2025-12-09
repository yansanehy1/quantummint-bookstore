# concept-visualizer/server.py
from flask import Flask, request, jsonify, send_file
from scientific_visualizer import ScientificConceptVisualizer
import os
import uuid
import io

app = Flask(__name__)
visualizer = ScientificConceptVisualizer()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "concept-visualizer"})

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    concept = data.get('concept', '')
    explanation = data.get('explanation', '')
    style = data.get('style', 'diagram')
    
    if not concept:
        return jsonify({"error": "No concept provided"}), 400
        
    image = visualizer.generate_concept_image(concept, explanation, style)
    
    # Save to file
    filename = f"{uuid.uuid4()}.png"
    output_path = os.path.join("/app/output", filename)
    image.save(output_path)
    
    return jsonify({
        "status": "success",
        "file": filename,
        "url": f"/generated/images/{filename}"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)
