import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const Page = z.object({
    index: z.number().nonnegative(),
    text: z.string(),
    formulas: z.array(z.object({ start: z.number(), end: z.number(), latex: z.string() })).default([])
});

const Chapter = z.object({
    id: z.string(),
    title: z.string(),
    pages: z.array(Page)
});

const Book = z.object({
    id: z.string(),
    title: z.string(),
    authorId: z.string(),
    language: z.string().default('en'),
    chapters: z.array(Chapter).default([])
});

const books: Record<string, z.infer<typeof Book>> = {};

app.post('/content/book', (req, res) => {
    const base = { ...req.body, id: uuid(), chapters: [] };
    const parse = Book.safeParse(base);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
    books[parse.data.id] = parse.data;
    res.json(parse.data);
});

app.post('/content/book/:id/chapter', (req, res) => {
    const book = books[req.params.id];
    if (!book) return res.status(404).json({ error: 'book not found' });
    const chapter: z.infer<typeof Chapter> = { id: uuid(), title: req.body.title, pages: [] };
    book.chapters.push(chapter);
    res.json(chapter);
});

app.post('/content/book/:id/chapter/:cid/page', (req, res) => {
    const book = books[req.params.id];
    const chap = book?.chapters.find(c => c.id === req.params.cid);
    if (!chap) return res.status(404).json({ error: 'chapter not found' });

    const text: string = req.body.text ?? '';
    const formulas = extractLatexSpans(text);
    const page = { index: chap.pages.length, text, formulas };
    const parse = Page.safeParse(page);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    chap.pages.push(parse.data);
    res.json(parse.data);
});

function extractLatexSpans(text: string) {
    const spans: { start: number; end: number; latex: string }[] = [];
    const patterns = [/(\$\$[\s\S]+?\$\$)/g, /(\\\[([\s\S]+?)\\\])/g, /(\\\(([\s\S]+?)\\\))/g];
    for (const pat of patterns) {
        for (const m of text.matchAll(pat)) {
            const start = m.index!;
            const end = start + m[0].length;
            const latex = m[0].replace(/^\$\$|\$\$$|^\\\[|\\\]$|^\\\(|\\\)$/g, '');
            spans.push({ start, end, latex });
        }
    }
    spans.sort((a, b) => a.start - b.start);
    return spans;
}

app.listen(7003, () => console.log('Content service on :7003'));
