// Minimal rules + tiny lexicon for English.
// Phoneme set: ARPAbet-like (AA, AE, AH, AO, EH, ER, IH, IY, OW, UH, UW, B, CH, DH, D, F, G, HH, JH, K, L, M, N, NG, P, R, S, SH, T, TH, V, W, Y, Z, ZH)
const lexicon: Record<string, string[]> = {
    "physics": ["F", "IH", "Z", "IH", "K", "S"],
    "formula": ["F", "AO", "R", "M", "Y", "AH", "L", "AH"],
    "energy": ["EH", "N", "ER", "JH", "IY"],
    "mass": ["M", "AE", "S"],
    "velocity": ["V", "AH", "L", "AO", "S", "AH", "T", "IY"],
    "the": ["DH", "AH"],
    "is": ["IH", "Z"],
    "equals": ["IY", "K", "W", "AH", "L", "Z"],
    "squared": ["S", "K", "W", "EH", "R", "D"]
};

const vowels = ["AA", "AE", "AH", "AO", "EH", "ER", "IH", "IY", "OW", "UH", "UW"];
const rules: { pattern: RegExp, out: string[] }[] = [
    { pattern: /tion$/i, out: ["SH", "AH", "N"] },
    { pattern: /ing$/i, out: ["IH", "NG"] },
    { pattern: /^th/i, out: ["TH"] },
    { pattern: /ph/i, out: ["F"] },
    { pattern: /qu/i, out: ["K", "W"] }
];

export function wordToPhonemes(word: string): string[] {
    const w = word.toLowerCase();
    if (lexicon[w]) return lexicon[w];
    for (const r of rules) if (r.pattern.test(w)) return r.out.concat(simpleFallback(w.replace(r.pattern, '')));
    return simpleFallback(w);
}

function simpleFallback(w: string): string[] {
    const out: string[] = [];
    for (const ch of w) {
        if (/[aeiou]/.test(ch)) {
            out.push(mapVowel(ch));
        } else if (/[bcdfghjklmnpqrstvwxyz]/.test(ch)) {
            out.push(mapConsonant(ch));
        }
    }
    return out.filter(Boolean);
}

function mapVowel(ch: string): string {
    switch (ch) {
        case 'a': return "AE";
        case 'e': return "EH";
        case 'i': return "IH";
        case 'o': return "AO";
        case 'u': return "UH";
        default: return "AH";
    }
}

function mapConsonant(ch: string): string {
    const m: Record<string, string> = { b: "B", c: "K", d: "D", f: "F", g: "G", h: "HH", j: "JH", k: "K", l: "L", m: "M", n: "N", p: "P", q: "K", r: "R", s: "S", t: "T", v: "V", w: "W", x: "K", y: "Y", z: "Z" };
    return m[ch] || "HH";
}

export function ssmlToPhonemeSequence(ssml: string): string[] {
    // Strip tags, split on spaces, map words
    const text = ssml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ');
    return words.flatMap(wordToPhonemes);
}
