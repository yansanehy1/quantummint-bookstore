import re
from typing import List, Dict, Any

class STEMParser:
    """
    Automatic STEM Recognition: TTS engine detects mathematical expressions, 
    chemical formulas, and physics equations in real time.
    """
    
    # regex for LaTeX math between $ or $$ (non-greedy)
    LATEX_PATTERN = r'\$\$(.*?)\$\$|\$(.*?)\$'
    
    # regex for common chemical formulas (e.g., H2O, C6H12O6, CO2, NaCl, NaOH)
    CHEM_PATTERN = r'\b([A-Z][a-z]?\d*)+\b'

    def __init__(self):
        pass

    def detect_stem_fragments(self, text: str) -> List[Dict[str, Any]]:
        fragments = []
        
        # Detect LaTeX
        for match in re.finditer(self.LATEX_PATTERN, text):
            # group(1) for $$...$$, group(2) for $...$
            content = match.group(1) or match.group(2)
            if content:
                fragments.append({
                    "type": "math",
                    "content": content,
                    "original": match.group(0),
                    "start": match.start(),
                    "end": match.end()
                })
            
        # Detect Chemistry (avoiding simple words that might match)
        for match in re.finditer(self.CHEM_PATTERN, text):
            content = match.group(0)
            
            # Simple heuristic to distinguish chemistry from words
            # 1. Contains a digit (H2O, CO2)
            # 2. Contains multiple capital letters (NaCl, NaOH)
            EXCLUDED_WORDS = {"He", "In", "As", "At", "Be", "No", "Am", "If"}
            
            is_chemistry = False
            if any(char.isdigit() for char in content):
                is_chemistry = True
            elif sum(1 for char in content if char.isupper()) >= 2:
                is_chemistry = True
                
            if is_chemistry and content not in EXCLUDED_WORDS:
                # Ensure we don't overlap with already detected LaTeX
                if not any(f["start"] <= match.start() < f["end"] for f in fragments):
                    fragments.append({
                        "type": "chemistry",
                        "content": content,
                        "original": content,
                        "start": match.start(),
                        "end": match.end()
                    })
                
        # Sort by start position
        fragments.sort(key=lambda x: x["start"])
        return fragments

    def segment_text(self, text: str) -> List[Dict[str, Any]]:
        """Segments text into plain text and STEM fragments"""
        fragments = self.detect_stem_fragments(text)
        segments = []
        last_end = 0
        
        for frag in fragments:
            if frag["start"] > last_end:
                segments.append({
                    "type": "text",
                    "content": text[last_end:frag["start"]]
                })
            segments.append(frag)
            last_end = frag["end"]
            
        if last_end < len(text):
            segments.append({
                "type": "text",
                "content": text[last_end:]
            })
            
        return segments
