import pytest
from parser import STEMParser
from ssml_gen import SSMLGenerator

def test_latex_recognition():
    parser = STEMParser()
    text = "The energy is $E=mc^2$ and the volume is $$V=L^3$$."
    fragments = parser.detect_stem_fragments(text)
    
    assert len(fragments) == 2
    assert fragments[0]["type"] == "math"
    assert fragments[0]["content"] == "E=mc^2"
    assert fragments[1]["type"] == "math"
    assert fragments[1]["content"] == "V=L^3"

def test_chemistry_recognition():
    parser = STEMParser()
    text = "Mixing H2O and NaCl creates a solution."
    fragments = parser.detect_stem_fragments(text)
    
    # H2O and NaCl should be detected
    assert len(fragments) >= 2
    types = [f["type"] for f in fragments]
    contents = [f["content"] for f in fragments]
    
    assert "chemistry" in types
    assert "H2O" in contents
    assert "NaCl" in contents

def test_ssml_generation():
    gen = SSMLGenerator()
    segments = [
        {"type": "text", "content": "The formula is "},
        {"type": "math", "content": "E=mc^2"}
    ]
    ssml = gen.generate_ssml(segments)
    
    assert "<speak>" in ssml
    assert "<prosody" in ssml
    assert "E equals m c squared" in ssml
    assert "<emphasis" in ssml

def test_complexity_adjustment():
    gen = SSMLGenerator()
    segments = [{"type": "text", "content": "Simple text"}]
    
    # Low complexity
    ssml_simple = gen.generate_ssml(segments, complexity=1.0)
    assert 'rate="medium"' in ssml_simple
    
    # High complexity
    ssml_complex = gen.generate_ssml(segments, complexity=10.0)
    assert 'rate="slow"' in ssml_complex

def test_chemistry_pronunciation():
    gen = SSMLGenerator()
    assert gen.formula_to_speech("H2O", "chemistry") == "water"
    assert gen.formula_to_speech("CO2", "chemistry") == "carbon dioxide"
    # Fallback
    assert "H 2" in gen.formula_to_speech("H2", "chemistry")
