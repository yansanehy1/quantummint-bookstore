import re
from typing import List, Dict, Any

class SSMLGenerator:
    """
    Intelligent Pronunciation: Renders formulas with proper pauses, emphasis, 
    and scientific terminology.
    SSML Integration: Uses Speech Synthesis Markup Language to control prosody.
    """

    def __init__(self):
        # Basic LaTeX to spoken word mappings
        self.latex_rules = {
            r'\\frac\{([^}]+)\}\{([^}]+)\}': r'the fraction \1 over \2',
            r'\\sqrt\{([^}]+)\}': r'the square root of \1',
            r'\^2': r' squared',
            r'\^3': r' cubed',
            r'\^\{([^}]+)\}': r' to the power of \1',
            r'\\int_\{([^}]+)\}\^\{([^}]+)\}': r'the integral from \1 to \2 of ',
            r'\\int': r'the integral of ',
            r'\\pi': r' pi ',
            r'\\theta': r' theta ',
            r'=': r' equals ',
            r'\+': r' plus ',
            r'-': r' minus ',
            r'\*': r' times ',
            r'\\cdot': r' times ',
            r'\\pm': r' plus or minus ',
            r'\\infty': r' infinity ',
        }

        self.chem_pronunciation = {
            'H2O': 'water',
            'CO2': 'carbon dioxide',
            'NaCl': 'sodium chloride',
            'O2': 'oxygen',
            'C6H12O6': 'glucose'
        }

    def formula_to_speech(self, formula: str, type: str) -> str:
        """Converts a formula piece to spoken text with scientific rules"""
        if type == "chemistry":
            return self._chemistry_to_speech(formula)
        else:
            return self._latex_to_speech(formula)

    def _chemistry_to_speech(self, formula: str) -> str:
        if formula in self.chem_pronunciation:
            return self.chem_pronunciation[formula]
        
        # fallback: read H 2 O as "H two O"
        spoken = ""
        for char in formula:
            if char.isdigit():
                spoken += f" {char} "
            else:
                spoken += char
        return spoken.strip()

    def _latex_to_speech(self, latex: str) -> str:
        spoken = latex
        for pattern, replacement in self.latex_rules.items():
            spoken = re.sub(pattern, replacement, spoken)
        
        # Clean up extra spaces
        spoken = re.sub(r'\s+', ' ', spoken).strip()
        return spoken

    def generate_ssml(self, segments: List[Dict[str, Any]], complexity: float = 1.0) -> str:
        """
        Wraps segments in SSML. 
        Context-Aware Narration: Adapts tone and speed based on formula complexity.
        """
        ssml_parts = ["<speak>"]
        
        # Global prosody based on complexity
        # slower for high complexity (derivations)
        rate = "medium"
        if complexity > 5:
            rate = "slow"
        elif complexity < 2:
            rate = "medium" # default

        ssml_parts.append(f'<prosody rate="{rate}">')

        for seg in segments:
            if seg["type"] == "text":
                ssml_parts.append(seg["content"])
            elif seg["type"] in ["math", "chemistry"]:
                spoken = self.formula_to_speech(seg["content"], seg["type"])
                # Add emphasis and pauses around formulas
                ssml_parts.append('<break time="200ms"/>')
                ssml_parts.append(f'<emphasis level="strong">{spoken}</emphasis>')
                ssml_parts.append('<break time="200ms"/>')
                
        ssml_parts.append('</prosody>')
        ssml_parts.append("</speak>")
        
        return "".join(ssml_parts)
