# scientific-engine/audiobook_generator.py
import re

class ScientificAudiobookGenerator:
    def __init__(self, tts_engine, visualizer, knowledge_graph):
        self.tts = tts_engine
        self.visualizer = visualizer
        self.kg = knowledge_graph
        
    def analyze_text(self, text):
        """Analyze scientific text for structure and content"""
        
        # Simple regex-based analysis for now
        words = len(text.split())
        
        # Extract potential concepts (capitalized phrases)
        concepts = list(set(re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)))
        
        # Extract formulas (simple detection of LaTeX-like patterns)
        formulas = re.findall(r'\$\$?.*?\$\$?', text, re.DOTALL)
        
        # Estimate difficulty
        difficulty_score = min(10, len(formulas) * 2 + len(concepts) * 0.5)
        difficulty_level = 'Intermediate'
        if difficulty_score < 3: difficulty_level = 'Beginner'
        elif difficulty_score > 7: difficulty_level = 'Advanced'
        
        return {
            'word_count': words,
            'estimated_duration': words / 150 * 60, # seconds
            'concepts': concepts[:10], # Top 10
            'formulas': [f[:50] + '...' if len(f) > 50 else f for f in formulas[:5]],
            'difficulty': {
                'score': difficulty_score,
                'level': difficulty_level,
                'estimated_study_time': f"{int(words/100)} minutes"
            }
        }
