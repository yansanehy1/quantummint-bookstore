import re
from typing import List, Dict, Any
from formula_narrator import FormulaNarrator

class SSMLGenerator:
    """
    Intelligent Pronunciation: Renders formulas with proper pauses, emphasis, 
    and scientific terminology.
    SSML Integration: Uses Speech Synthesis Markup Language to control prosody.
    """

    def __init__(self):
        # Default voices
        self.voices = {
            "narrative": "en-US-AriaNeural",
            "tutor": "en-US-GuyNeural",
            "character": "en-US-JennyNeural",
            "formula": "en-US-DavisNeural"
        }
        self.narrator = FormulaNarrator()

    def formula_to_speech(self, formula: str, type: str) -> str:
        """Converts a formula piece to spoken text with scientific rules"""
        return self.narrator.narrate(formula)

    def generate_ssml(self, segments: List[Dict[str, Any]], voice_map: Dict[str, str] = None) -> str:
        """
        Wraps segments in SSML with multi-voice support.
        """
        if not voice_map:
            voice_map = self.voices

        ssml_parts = ["<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>"]
        
        for seg in segments:
            seg_type = seg["type"]
            content = seg["content"]
            
            # Map segment type to voice
            voice = voice_map.get(seg_type, voice_map.get("narrative"))
            if seg_type == "math":
                voice = voice_map.get("formula", voice)
            elif seg_type == "dialogue":
                voice = voice_map.get("character", voice)
            elif seg_type == "step":
                voice = voice_map.get("tutor", voice)

            ssml_parts.append(f'<voice name="{voice}">')

            if seg_type == "text":
                ssml_parts.append(f'<prosody rate="medium">{content}</prosody>')
            elif seg_type == "math" or seg_type == "chemistry":
                spoken = self.formula_to_speech(content, seg_type)
                # Adaptive narration: slow down for formulas
                ssml_parts.append('<break time="300ms"/>')
                ssml_parts.append(f'<prosody rate="slow" pitch="+5%"><emphasis level="strong">{spoken}</emphasis></prosody>')
                ssml_parts.append('<break time="300ms"/>')
            elif seg_type == "dialogue":
                ssml_parts.append(f'<prosody pitch="+10%">{content}</prosody>')
            elif seg_type == "step":
                ssml_parts.append('<break time="500ms"/>')
                ssml_parts.append(f'<prosody rate="medium" pitch="-5%"><emphasis level="moderate">{content}</emphasis></prosody>')
                ssml_parts.append('<break time="500ms"/>')
            else:
                ssml_parts.append(content)

            ssml_parts.append('</voice>')
                
        ssml_parts.append("</speak>")
        
        return "".join(ssml_parts)
