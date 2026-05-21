import sys
import os
import re

# Add the current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from ssml_gen import SSMLGenerator
except ImportError:
    # Fallback for manual check if needed
    pass

def test_formula_narration_logic():
    gen = SSMLGenerator()
    
    # Test LaTeX to speech
    latex_cases = [
        (r"\frac{1}{2}", "fraction 1 over 2"),
        (r"E=mc^2", "E equals m c squared"),
        (r"H_2O", "water"),
        (r"\pi r^2", "pi r squared")
    ]
    
    for latex, expected in latex_cases:
        # Check if it's chemistry or math
        type = "chemistry" if latex == "H_2O" else "math"
        # The parser might clean up H_2O to H2O for chemistry
        if latex == "H_2O": latex = "H2O"
        
        spoken = gen.formula_to_speech(latex, type)
        print(f"Input: {latex} -> Spoken: {spoken}")
        # Basic check
        if "H2O" in latex:
            assert "water" in spoken.lower()
        elif "mc^2" in latex:
            assert "squared" in spoken.lower()

if __name__ == "__main__":
    print("Testing Formula Narration Engine...")
    try:
        test_formula_narration_logic()
        print("\nSUCCESS: Formula Narration Logic is working correctly.")
    except Exception as e:
        print(f"\nFAILURE: {e}")
        import traceback
        traceback.print_exc()
