# concept-visualizer/scientific_visualizer.py
import torch
from PIL import Image, ImageDraw, ImageFont
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import numpy as np

class ScientificConceptVisualizer:
    def __init__(self, model_path="/app/models"):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Visualizer initialized on {self.device}")
        
    def generate_concept_image(self, concept: str, explanation: str, style: str = "diagram") -> Image.Image:
        """Generate image visualizing a scientific concept"""
        
        if style == "diagram":
            return self.generate_diagram(concept, explanation)
        else:
            # Fallback to simple diagram for now
            return self.generate_diagram(concept, explanation)
    
    def generate_diagram(self, concept: str, explanation: str) -> Image.Image:
        """Generate explanatory diagram using Matplotlib"""
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Simple visualization logic based on keywords
        if "sin" in concept or "wave" in concept:
            x = np.linspace(0, 10, 100)
            y = np.sin(x)
            ax.plot(x, y, label='Sine Wave')
            ax.set_title(f"Visualization: {concept}")
        elif "exp" in concept or "growth" in concept:
            x = np.linspace(0, 5, 100)
            y = np.exp(x)
            ax.plot(x, y, color='red', label='Exponential Growth')
            ax.set_title(f"Visualization: {concept}")
        else:
            # Generic text visualization
            ax.text(0.5, 0.5, concept, ha='center', va='center', fontsize=20)
            ax.axis('off')
            
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        # Convert to PIL Image
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img = Image.open(buf)
        plt.close()
        
        return img
