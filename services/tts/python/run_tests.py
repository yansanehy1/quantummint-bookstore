import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from stem_parser import STEMParser
from ssml_gen import SSMLGenerator

def test_all():
    parser = STEMParser()
    gen = SSMLGenerator()
    
    # Test 1: Fragments
    text = "The energy is $E=mc^2$ and the volume is $$V=L^3$$."
    frags = parser.detect_stem_fragments(text)
    assert len(frags) == 2, f"Expected 2, got {len(frags)}"
    
    # Test 2: Chemistry
    text_chem = "Mixing H2O and NaCl."
    frags_chem = parser.detect_stem_fragments(text_chem)
    contents = [f["content"] for f in frags_chem]
    assert "H2O" in contents, "H2O missing"
    assert "NaCl" in contents, "NaCl missing"
    
    # Test 3: SSML
    segments = [{"type": "text", "content": "Hello "}, {"type": "math", "content": "E=mc^2"}]
    ssml = gen.generate_ssml(segments)
    assert "E equals mc squared" in ssml
    
    print("ALL TESTS PASSED")

if __name__ == "__main__":
    try:
        test_all()
    except Exception as e:
        print(f"TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
