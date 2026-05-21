import re
from typing import List, Dict, Any

class STEMParser:
    """
    Automatic STEM Recognition: TTS engine detects mathematical expressions, 
    chemical formulas, and physics equations in real time.
    """
    
    # Detect math/chemistry/physics formulas → render LaTeX → narrate with clarity.
    LATEX_PATTERN = r'\$\$(.{0,1000}?)\$\$|\$(.{0,500}?)\$'
    
    # Safer chemical formula pattern
    CHEM_PATTERN = r'\b[A-Z][a-z]?(?:\d{1,3})?(?:[A-Z][a-z]?(?:\d{1,3})?)?\b'

    # Dialogue detection: "Name:", "Q:", "A:", "Speaker:"
    DIALOGUE_PATTERN = r'^(?:[A-Z][a-zA-Z\s]{1,20}:|Q:|A:|Narrator:)\s*(.*)$'
    
    # Tutorial steps: "Step 1:", "1. ", "Firstly,"
    STEP_PATTERN = r'^(?:Step\s*\d+:|\d+\.|\w+ly,)\s*(.*)$'

    def __init__(self):
        self._latex_re = re.compile(self.LATEX_PATTERN, re.DOTALL)
        self._chem_re = re.compile(self.CHEM_PATTERN)
        self._dialogue_re = re.compile(self.DIALOGUE_PATTERN, re.MULTILINE)
        self._step_re = re.compile(self.STEP_PATTERN, re.MULTILINE)

    def detect_stem_fragments(self, text: str) -> List[Dict[str, Any]]:
        if not isinstance(text, str) or not text:
            return []
        
        text = text[:10000]
        fragments = []
        
        # Detect LaTeX
        try:
            for match in self._latex_re.finditer(text):
                content = match.group(1) or match.group(2)
                if content and len(content) < 500:
                    fragments.append({
                        "type": "math",
                        "content": content,
                        "original": match.group(0),
                        "start": match.start(),
                        "end": match.end()
                    })
        except Exception as e:
            import logging
            logging.warning(f"LaTeX parsing error: {e}")

        # Detect Dialogue
        try:
            for match in self._dialogue_re.finditer(text):
                fragments.append({
                    "type": "dialogue",
                    "content": match.group(1),
                    "original": match.group(0),
                    "start": match.start(),
                    "end": match.end()
                })
        except Exception as e:
            import logging
            logging.warning(f"Dialogue parsing error: {e}")

        # Detect Steps
        try:
            for match in self._step_re.finditer(text):
                # Only add if not already matched as dialogue
                if not any(f["start"] <= match.start() < f["end"] for f in fragments):
                    fragments.append({
                        "type": "step",
                        "content": match.group(1),
                        "original": match.group(0),
                        "start": match.start(),
                        "end": match.end()
                    })
        except Exception as e:
            import logging
            logging.warning(f"Step parsing error: {e}")
            
        # Detect Chemistry
        try:
            for match in self._chem_re.finditer(text):
                content = match.group(0)
                EXCLUDED_WORDS = {"He", "In", "As", "At", "Be", "No", "Am", "If", "Is", "To", "On"}
                
                is_chemistry = False
                if any(char.isdigit() for char in content):
                    is_chemistry = True
                elif sum(1 for char in content if char.isupper()) >= 2 and len(content) >= 3:
                    is_chemistry = True
                    
                if is_chemistry and content not in EXCLUDED_WORDS:
                    # Check if this overlaps with any existing fragment
                    if not any(f["start"] <= match.start() < f["end"] for f in fragments):
                        fragments.append({
                            "type": "chemistry",
                            "content": content,
                            "original": content,
                            "start": match.start(),
                            "end": match.end()
                        })
        except Exception as e:
            import logging
            logging.warning(f"Chemistry parsing error: {e}")
                
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
