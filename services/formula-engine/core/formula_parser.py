# formula-engine/core/formula_parser.py
import sympy as sp
import re
from typing import Dict, List, Any

class MathematicalUnderstandingEngine:
    def __init__(self):
        pass
        
    def parse_formula(self, formula: str) -> Dict[str, Any]:
        """Parse a mathematical formula into structured representation"""
        # Clean LaTeX
        clean_formula = self.clean_latex(formula)
        
        try:
            # Attempt symbolic parsing
            expr = sp.sympify(clean_formula)
            
            # Generate comprehensive analysis
            analysis = {
                "original": formula,
                "cleaned": clean_formula,
                "expression": str(expr),
                "variables": [str(s) for s in expr.free_symbols],
                "type": self.classify_formula_type(expr),
                "spoken_form": self.generate_spoken_form(expr),
                "explanation": self.generate_explanation(expr),
                "complexity": self.calculate_complexity(expr)
            }
            return analysis
            
        except Exception as e:
            return {
                "original": formula,
                "error": str(e),
                "explanation": "Complex formula requiring advanced parsing"
            }
    
    def clean_latex(self, latex: str) -> str:
        """Clean and convert LaTeX to plain math for SymPy"""
        # Basic replacements
        replacements = {
            r'\\frac\{([^}]+)\}\{([^}]+)\}': r'(\1)/(\2)',
            r'\\sqrt\{([^}]+)\}': r'sqrt(\1)',
            r'\^': '**',
            r'\\cdot': '*',
            r'\\times': '*',
            r'\\sin': 'sin',
            r'\\cos': 'cos',
            r'\\tan': 'tan',
            r'\\pi': 'pi',
            r'\\theta': 'theta',
            r'\\int': 'integrate',
            r'\\frac{d}{dx}': 'diff'
        }
        
        for pattern, replacement in replacements.items():
            latex = re.sub(pattern, replacement, latex)
            
        # Remove remaining LaTeX commands
        latex = re.sub(r'\\[a-zA-Z]+\{([^}]*)\}', r'\1', latex)
        latex = re.sub(r'\$', '', latex)
        
        return latex

    def classify_formula_type(self, expr) -> str:
        """Classify the type of mathematical expression"""
        if isinstance(expr, sp.Derivative):
            return 'derivative'
        elif isinstance(expr, sp.Integral):
            return 'integral'
        elif isinstance(expr, sp.Eq):
            return 'equation'
        elif isinstance(expr, sp.Matrix):
            return 'matrix'
        return 'expression'

    def generate_spoken_form(self, expr) -> str:
        """Generate spoken description of formula"""
        if isinstance(expr, sp.Derivative):
            return self.speak_derivative(expr)
        elif isinstance(expr, sp.Integral):
            return self.speak_integral(expr)
        elif isinstance(expr, sp.Eq):
            return self.speak_equation(expr)
        else:
            return self.speak_general_formula(expr)

    def speak_derivative(self, expr) -> str:
        """Generate spoken description of derivative"""
        variables = list(expr.free_symbols)
        if variables:
            var = str(variables[0])
            return f"The derivative with respect to {var} of {expr.args[0]}"
        return f"The derivative of {expr}"

    def speak_integral(self, expr) -> str:
        """Generate spoken description of integral"""
        return f"The integral of {expr.args[0]}"

    def speak_equation(self, expr) -> str:
        """Generate spoken description of equation"""
        return f"{expr.lhs} equals {expr.rhs}"

    def speak_general_formula(self, expr) -> str:
        """General formula to speech conversion"""
        # Simple fallback for now, can be enhanced
        return str(expr).replace('**', ' to the power of ').replace('*', ' times ').replace('/', ' divided by ')

    def generate_explanation(self, expr) -> str:
        """Generate natural language explanation"""
        if isinstance(expr, sp.Add):
            return f"The sum of {', '.join([str(arg) for arg in expr.args])}"
        elif isinstance(expr, sp.Mul):
            return f"The product of {', '.join([str(arg) for arg in expr.args])}"
        elif isinstance(expr, sp.Pow):
            return f"{expr.base} raised to the power of {expr.exp}"
        elif isinstance(expr, sp.Derivative):
            return "This represents the rate of change of the function."
        elif isinstance(expr, sp.Integral):
            return "This represents the accumulation or area under the curve."
        else:
            return f"The expression {expr}"

    def calculate_complexity(self, expr) -> float:
        """Calculate complexity score for the formula"""
        score = 0
        score += len(expr.free_symbols) * 0.5
        score += expr.count_ops() * 0.2
        if isinstance(expr, (sp.Derivative, sp.Integral)):
            score += 2.0
        return min(10.0, score)
