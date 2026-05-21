import re
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional

class FormulaNarrator:
    """
    Universal STEM Formula Narration Engine.
    Handles thousands of LaTeX symbols and MathML structures across Math, Physics, Chemistry, and Engineering.
    """
    
    def __init__(self):
        # 1. COMPREHENSIVE GREEK ALPHABET
        self.greek_alphabet = {
            r'\\alpha': 'alpha', r'\\beta': 'beta', r'\\gamma': 'gamma', r'\\delta': 'delta',
            r'\\epsilon': 'epsilon', r'\\zeta': 'zeta', r'\\eta': 'eta', r'\\theta': 'theta',
            r'\\iota': 'iota', r'\\kappa': 'kappa', r'\\lambda': 'lambda', r'\\mu': 'mu',
            r'\\nu': 'nu', r'\\xi': 'xi', r'\\omicron': 'omicron', r'\\pi': 'pi',
            r'\\rho': 'rho', r'\\sigma': 'sigma', r'\\tau': 'tau', r'\\upsilon': 'upsilon',
            r'\\phi': 'phi', r'\\chi': 'chi', r'\\psi': 'psi', r'\\omega': 'omega',
            r'\\Gamma': 'Capital Gamma', r'\\Delta': 'Capital Delta', r'\\Theta': 'Capital Theta',
            r'\\Lambda': 'Capital Lambda', r'\\Xi': 'Capital Xi', r'\\Pi': 'Capital Pi',
            r'\\Sigma': 'Capital Sigma', r'\\Upsilon': 'Capital Upsilon', r'\\Phi': 'Capital Phi',
            r'\\Psi': 'Capital Psi', r'\\Omega': 'Capital Omega'
        }

        # 2. MATHEMATICAL OPERATORS & SYMBOLS
        self.operators = {
            # Arithmetic & Basic
            r'\\pm': 'plus or minus', r'\\mp': 'minus or plus', r'\\times': 'times', r'\\div': 'divided by',
            r'\\cdot': 'dot', r'\\ast': 'asterisk', r'\\star': 'star', r'\\circ': 'composition',
            r'\\bullet': 'bullet', r'\\infty': 'infinity', r'\\propto': 'is proportional to',
            # Relations
            r'=': 'equals', r'\\neq': 'is not equal to', r'\\approx': 'is approximately',
            r'\\sim': 'is similar to', r'\\cong': 'is congruent to', r'\\equiv': 'is equivalent to',
            r'\\leq': 'is less than or equal to', r'\\geq': 'is greater than or equal to',
            r'<': 'is less than', r'>': 'is greater than', r'\\ll': 'is much less than', r'\\gg': 'is much greater than',
            # Logic & Sets
            r'\\forall': 'for all', r'\\exists': 'there exists', r'\\nexists': 'there does not exist',
            r'\\in': 'is an element of', r'\\notin': 'is not an element of', r'\\ni': 'contains as element',
            r'\\subset': 'is a subset of', r'\\supset': 'is a superset of', r'\\subseteq': 'is a subset or equal to',
            r'\\supseteq': 'is a superset or equal to', r'\\cup': 'union', r'\\cap': 'intersection',
            r'\\setminus': 'set minus', r'\\empty': 'empty set', r'\\emptyset': 'empty set',
            r'\\neg': 'not', r'\\wedge': 'and', r'\\vee': 'or', r'\\implies': 'implies', r'\\iff': 'if and only if',
            # Calculus & Advanced
            r'\\partial': 'partial derivative', r'\\nabla': 'del operator', r'\\int': 'integral of',
            r'\\iint': 'double integral of', r'\\iiint': 'triple integral of', r'\\oint': 'contour integral of',
            r'\\sum': 'summation of', r'\\prod': 'product of', r'\\coprod': 'coproduct of',
            r'\\lim': 'limit', r'\\log': 'logarithm', r'\\ln': 'natural log', r'\\exp': 'exponential',
            r'\\sin': 'sine', r'\\cos': 'cosine', r'\\tan': 'tangent', r'\\sec': 'secant', r'\\csc': 'cosecant', r'\\cot': 'cotangent',
            # Geometry & Vectors
            r'\\angle': 'angle', r'\\triangle': 'triangle', r'\\perp': 'is perpendicular to', r'\\parallel': 'is parallel to',
            r'\\vec': 'vector', r'\\hat': 'unit vector', r'\\dot': 'derivative with respect to time', r'\\ddot': 'second derivative with respect to time',
            # Arrows
            r'\\rightarrow': 'approaches', r'\\leftarrow': 'left arrow', r'\\uparrow': 'up arrow', r'\\downarrow': 'down arrow',
            r'\\leftrightarrow': 'left right arrow', r'\\Rightarrow': 'implies', r'\\Leftarrow': 'is implied by',
            r'\\Leftrightarrow': 'is equivalent to', r'\\mapsto': 'maps to', r'\\hookrightarrow': 'hooks right arrow',
            r'\\rightharpoonup': 'right harpoon up', r'\\rightharpoondown': 'right harpoon down',
            r'\\longrightarrow': 'long right arrow', r'\\Longrightarrow': 'long double right arrow',
            # Linear Algebra
            r'\\det': 'determinant', r'\\tr': 'trace', r'\\ker': 'kernel', r'\\dim': 'dimension',
            r'\\rank': 'rank', r'\\vec': 'vector', r'\\mathbf': 'bold vector',
            # Quantum Mechanics
            r'\\hbar': 'h bar', r'\\psi': 'psi', r'\\Psi': 'Capital Psi', r'\\phi': 'phi', r'\\Phi': 'Capital Phi',
            r'\\langle': 'bra', r'\\rangle': 'ket', r'\\dagger': 'dagger', r'\\otimes': 'tensor product',
            # Topology & Analysis
            r'\\partial': 'partial derivative', r'\\nabla': 'del operator', r'\\square': 'd Alembert operator',
            r'\\diamond': 'diamond operator', r'\\triangle': 'triangle', r'\\triangleleft': 'left triangle',
            r'\\nabla\^2': 'Laplacian operator', r'\\nabla \cdot': 'divergence of', r'\\nabla \\times': 'curl of',
            # Set Theory & Logic
            r'\\aleph': 'aleph', r'\\beth': 'beth', r'\\daleth': 'daleth', r'\\gimel': 'gimel',
            r'\\complement': 'complement', r'\\subset': 'is a subset of', r'\\supset': 'is a superset of',
            r'\\subseteq': 'is a subset of or equal to', r'\\supseteq': 'is a superset of or equal to',
            r'\\cup': 'union', r'\\cap': 'intersection', r'\\setminus': 'set difference',
            # Accents
            r'\\overline': 'overline', r'\\underline': 'underline', r'\\widetilde': 'tilde', r'\\widehat': 'hat',
            r'\\bar': 'bar', r'\\vec': 'vector', r'\\dot': 'dot', r'\\ddot': 'double dot',
            r'\\breve': 'breve', r'\\check': 'check', r'\\grave': 'grave', r'\\acute': 'acute',
            # Miscellaneous Scientific
            r'\\hbar': 'h bar', r'\\ell': 'ell', r'\\wp': 'Weierstrass p', r'\\Re': 'real part', r'\\Im': 'imaginary part',
            r'\\partial': 'partial', r'\\eth': 'eth', r'\\mho': 'mho', r'\\nabla': 'nabla',
            r'\\surd': 'surd', r'\\angle': 'angle', r'\\measuredangle': 'measured angle', r'\\sphericalangle': 'spherical angle',
            # Probability & Statistics
            r'\\mathbb\{P\}': 'probability', r'\\mathbb\{E\}': 'expected value', r'\\mathbb\{V\}': 'variance',
            r'\\sigma\^2': 'variance', r'\\mu': 'mean', r'\\bar\{x\}': 'sample mean',
            r'\\sim': 'is distributed as', r'\\approx': 'is approximately',
            # Chemistry (Extended mhchem support)
            r'\\xleftarrow': 'reversed reaction', r'\\xrightarrow': 'reaction yielding',
            r'\\uparrow': 'gas evolved', r'\\downarrow': 'precipitate formed'
        }

        # 2.1 EXTENDED OPERATORS
        self.extended_operators = {
            r'\\oplus': 'direct sum', r'\\otimes': 'tensor product', r'\\odot': 'dotted product',
            r'\\ominus': 'circled minus', r'\\uplus': 'multiset union', r'\\sqcap': 'square intersection',
            r'\\sqcup': 'square union', r'\\triangleleft': 'normal subgroup', r'\\triangleright': 'contains as normal subgroup',
            r'\\wr': 'wreath product', r'\\amalg': 'amalgamation', r'\\dagger': 'dagger', r'\\ddagger': 'double dagger'
        }

        # 3. SPECIAL CONTENT & UNITS
        self.special_units = {
            'H2O': 'water', 'CO2': 'carbon dioxide', 'NaCl': 'sodium chloride',
            'NaOH': 'sodium hydroxide', 'HCl': 'hydrochloric acid', 'H2SO4': 'sulfuric acid',
            'NH3': 'ammonia', 'CH4': 'methane', 'C6H12O6': 'glucose', 'KMnO4': 'potassium permanganate',
            'Ω': 'Ohm', 'Pa': 'Pascal', 'J': 'Joule', 'V': 'Volt', 'W': 'Watt', 'Hz': 'Hertz',
            'μF': 'micro Farad', 'nm': 'nanometers', 'kg': 'kilograms', 'm/s': 'meters per second',
            'm/s^2': 'meters per second squared', 'N': 'Newton', 'C': 'Coulomb', 'T': 'Tesla',
            'G': 'Gauss', 'Wb': 'Weber', 'H': 'Henry', 'lm': 'lumen', 'lx': 'lux', 'Bq': 'becquerel',
            'Gy': 'gray', 'Sv': 'sievert', 'kat': 'katal', 'mol': 'mole', 'cd': 'candela'
        }

        # Interactive Breakdown Symbol Dictionary
        self.symbol_metadata = {
            "E": ("E", "Energy"),
            "m": ("m", "Mass"),
            "c": ("speed of light", "Universal constant, speed of light in vacuum (approx. 3.00 × 10^8 m/s)"),
            "G": ("G", "Gibbs Free Energy"),
            "λ": ("wavelength", "Distance between consecutive peaks of a wave"),
            "π": ("pi", "Mathematical constant, ratio of a circle's circumference to its diameter"),
            "h": ("Planck's constant", "Physical constant that is the quantum of action"),
            "k": ("Boltzmann constant", "Physical constant relating temperature and energy"),
            "R": ("Ideal gas constant", "Physical constant in the equation of state of a hypothetical ideal gas"),
            "σ": ("Stefan-Boltzmann constant", "Constant of proportionality in the Stefan-Boltzmann law"),
            "ε0": ("Vacuum permittivity", "Physical constant representing the capability of a vacuum to permit electric field lines"),
            "μ0": ("Vacuum permeability", "Physical constant representing the capability of a vacuum to permit magnetic field lines"),
            "F": ("Faraday constant", "Magnitude of electric charge per mole of electrons"),
            "N_A": ("Avogadro constant", "Number of constituent particles that are contained in the amount of substance given by one mole"),
            "e": ("Elementary charge", "Electric charge carried by a single proton"),
            "m_e": ("Electron mass", "Mass of a stationary electron"),
            "m_p": ("Proton mass", "Mass of a stationary proton"),
            "G_constant": ("Gravitational constant", "Empirical physical constant involved in the calculation of gravitational effects"),
            "i": ("Imaginary unit", "A number whose square is negative one"),
            "j": ("Imaginary unit", "Commonly used in engineering for the imaginary unit"),
            "e_number": ("Euler's number", "Mathematical constant approximately equal to 2.71828"),
            "phi": ("Golden ratio", "Mathematical constant approximately equal to 1.61803")
        }

    def narrate(self, formula: str) -> str:
        """Universal entry point for formula narration."""
        if '<math' in formula:
            return self.narrate_mathml(formula)
        return self.narrate_latex(formula)

    def narrate_latex(self, latex: str) -> str:
        """Recursive LaTeX Narration Engine."""
        # 0. Handle mhchem: \ce{H2O}
        latex = re.sub(r'\\ce\{([^}]+)\}', r' \1 ', latex)

        # 1. Handle Structural Constructs (Fractions, Roots, Integrals)
        latex = self._handle_structural_constructs(latex)

        # 2. Handle Scripts (Superscript, Subscript)
        latex = self._handle_scripts(latex)

        # 3. Handle Matrices and Environments
        latex = self._handle_environments(latex)

        # 4. Handle Greek Alphabet and Operators
        for pattern, replacement in {**self.greek_alphabet, **self.operators, **self.extended_operators}.items():
            # Use negative lookbehind/lookahead to avoid partial matches
            latex = re.sub(r'(?<!\\)' + re.escape(pattern) + r'(?![a-zA-Z])', ' ' + replacement + ' ', latex)
        
        # 5. Handle direct UTF-8 symbols if any
        for symbol, spoken in self.special_units.items():
            latex = latex.replace(symbol, ' ' + spoken + ' ')

        # Final Clean-up
        latex = latex.replace('\\', '').replace('{', '').replace('}', '')
        latex = re.sub(r'\s+', ' ', latex).strip()
        return latex

    def _handle_structural_constructs(self, text: str) -> str:
        # Fractions: \frac{num}{den}
        while r'\frac' in text:
            text = re.sub(r'\\frac\{([^}]+)\}\{([^}]+)\}', r' the fraction \1 over \2 ', text)
        
        # Square Roots: \sqrt{arg} or \sqrt[n]{arg}
        text = re.sub(r'\\sqrt\[([^\]]+)\]\{([^}]+)\}', r' the \1th root of \2 ', text)
        text = re.sub(r'\\sqrt\{([^}]+)\}', r' the square root of \1 ', text)
        
        # Integrals with limits: \int_{a}^{b}
        text = re.sub(r'\\int_\{([^}]+)\}\^\{([^}]+)\}', r' the integral from \1 to \2 of ', text)
        text = re.sub(r'\\int_\{([^}]+)\}', r' the integral over \1 of ', text)
        
        # Summations with limits: \sum_{i=1}^{n}
        text = re.sub(r'\\sum_\{([^}]+)\}\^\{([^}]+)\}', r' the summation from \1 to \2 of ', text)
        
        return text

    def _handle_scripts(self, text: str) -> str:
        # Common powers
        text = text.replace('^2', ' squared').replace('^3', ' cubed')
        
        # General superscripts: x^{...} or x^...
        text = re.sub(r'([A-Za-z0-9])\^\{([^}]+)\}', r'\1 to the power of \2', text)
        text = re.sub(r'([A-Za-z0-9])\^([a-zA-Z0-9])', r'\1 to the power of \2', text)
        
        # General subscripts: x_{...} or x_...
        text = re.sub(r'([A-Za-z0-9])_\{([^}]+)\}', r'\1 sub \2', text)
        text = re.sub(r'([A-Za-z0-9])_([a-zA-Z0-9])', r'\1 sub \2', text)
        
        return text

    def _handle_environments(self, text: str) -> str:
        # Matrices: \begin{matrix} ... \end{matrix}
        def parse_matrix(match):
            content = match.group(1)
            rows = content.split(r'\\')
            num_rows = len(rows)
            # Find max number of columns by splitting each row by &
            num_cols = max(len(row.split('&')) for row in rows)
            
            spoken_matrix = f" a {num_rows} by {num_cols} matrix containing "
            spoken_rows = []
            for row in rows:
                if row.strip():
                    spoken_rows.append(row.replace('&', ' and '))
            
            return spoken_matrix + ". Next row: ".join(spoken_rows)

        if r'\begin{matrix}' in text:
            text = re.sub(r'\\begin\{matrix\}(.+?)\\end\{matrix\}', parse_matrix, text)
        
        # Other matrix types
        for mtype in ['pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix']:
            if f'\\begin{{{mtype}}}' in text:
                text = re.sub(fr'\\begin{{{mtype}}}(.+?)\\end{{{mtype}}}', parse_matrix, text)
        
        # Cases: \begin{cases} ... \end{cases}
        text = re.sub(r'\\begin\{cases\}(.+?)\\end\{cases\}', r' defined as follows: \1 ', text)
        
        # Align/Gather: \begin{align} ... \end{align}
        text = re.sub(r'\\begin\{align\*?\}(.+?)\\end\{align\*?\}', lambda m: ' a sequence of aligned equations: ' + m.group(1).replace('&', ' resulting in ').replace('\\\\', '. Next equation: '), text)
        text = re.sub(r'\\begin\{gather\*?\}(.+?)\\end\{gather\*?\}', lambda m: ' a collection of equations: ' + m.group(1).replace('\\\\', '. Next equation: '), text)
        text = re.sub(r'\\begin\{eqnarray\*?\}(.+?)\\end\{eqnarray\*?\}', lambda m: ' an equation array: ' + m.group(1).replace('&', ' ').replace('\\\\', '. Next equation: '), text)
        
        return text

    def narrate_mathml(self, mathml: str) -> str:
        """MathML Narration Module."""
        try:
            root = ET.fromstring(mathml)
            return self._parse_mathml_element(root)
        except Exception as e:
            return "Unable to narrate MathML content"

    def _parse_mathml_element(self, element: ET.Element) -> str:
        tag = element.tag.split('}')[-1] # Handle namespaces
        
        # Structural tags
        if tag == 'mfrac':
            children = list(element)
            return f" the fraction {self._parse_mathml_element(children[0])} over {self._parse_mathml_element(children[1])} "
        elif tag == 'msqrt':
            return f" the square root of {' '.join(self._parse_mathml_element(c) for c in element)} "
        elif tag == 'mroot':
            children = list(element)
            return f" the {self._parse_mathml_element(children[1])} root of {self._parse_mathml_element(children[0])} "
        elif tag == 'msup':
            children = list(element)
            base = self._parse_mathml_element(children[0])
            exp = self._parse_mathml_element(children[1])
            if exp == '2': return f" {base} squared "
            if exp == '3': return f" {base} cubed "
            return f" {base} to the power of {exp} "
        elif tag == 'msub':
            children = list(element)
            return f" {self._parse_mathml_element(children[0])} sub {self._parse_mathml_element(children[1])} "
        elif tag == 'mover':
            children = list(element)
            return f" {self._parse_mathml_element(children[0])} with {self._parse_mathml_element(children[1])} above "
        elif tag == 'munder':
            children = list(element)
            return f" {self._parse_mathml_element(children[0])} with {self._parse_mathml_element(children[1])} below "
        elif tag == 'munderover':
            children = list(element)
            return f" {self._parse_mathml_element(children[0])} from {self._parse_mathml_element(children[1])} to {self._parse_mathml_element(children[2])} "
        elif tag == 'mtable':
            return " a table containing " + " ".join(self._parse_mathml_element(c) for c in element)
        elif tag == 'mtr':
            return " next row: " + " ".join(self._parse_mathml_element(c) for c in element)
        elif tag == 'mtd':
            return " entry: " + " ".join(self._parse_mathml_element(c) for c in element)
        elif tag == 'mfenced':
            open_attr = element.get('open', '(')
            close_attr = element.get('close', ')')
            content = " ".join(self._parse_mathml_element(c) for c in element)
            return f" {open_attr} {content} {close_attr} "
        
        # Leaf tags
        if tag in ['mi', 'mn', 'mo']:
            text = element.text or ''
            # Check if it's a known operator or greek symbol
            # (In a full impl, we'd have a large mapping for MathML operator names/entities)
            return f" {text} "
        
        # Container tags
        return ' '.join(self._parse_mathml_element(child) for child in element)

    def get_breakdown(self, formula: str) -> List[Dict[str, str]]:
        """Parses a formula into interactive tokens with definitions."""
        tokens = []
        # Sort by length descending to match longer strings first
        sorted_symbols = sorted(self.symbol_metadata.keys(), key=len, reverse=True)
        remaining_formula = formula
        
        for symbol in sorted_symbols:
            if symbol in remaining_formula:
                spoken, definition = self.symbol_metadata[symbol]
                start = 0
                while True:
                    idx = remaining_formula.find(symbol, start)
                    if idx == -1: break
                    tokens.append({
                        "symbol": symbol,
                        "spoken": spoken,
                        "definition": definition,
                        "offset": idx
                    })
                    start = idx + len(symbol)
        
        tokens.sort(key=lambda x: x["offset"])
        return tokens

# Global instance
narrator = FormulaNarrator()
