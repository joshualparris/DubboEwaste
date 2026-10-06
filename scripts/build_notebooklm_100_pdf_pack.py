#!/usr/bin/env python3
"""Build the Dubbo eWaste NotebookLM 100-PDF research pack.

The pack intentionally contains exactly:
  * 1 master index PDF
  * 74 selected documents from this repository
  * 25 original briefing PDFs that summarise current external primary sources

Third-party web pages are not copied wholesale into the repository. External PDFs
are original source briefs with URLs and provenance so the pack remains useful
for NotebookLM without redistributing third-party copyrighted publications.
"""

from __future__ import annotations

import html
import json
import os
import re
import shutil
import textwrap
import zipfile
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, Paragraph, Preformatted, Spacer

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "notebooklm" / "notebooklm_100_sources.json"
PACK_ROOT = ROOT / "notebooklm" / "2026-10-06-100-pdf-pack"
PDF_DIR = PACK_ROOT / "pdfs"
ZIP_PATH = PACK_ROOT / "DubboEwaste-NotebookLM-100-PDF-Pack.zip"
MANIFEST_PATH = PACK_ROOT / "manifest.json"
README_PATH = PACK_ROOT / "README.md"

GENERATED_DATE = "6 October 2026"
SOURCE_COMMIT = os.environ.get("GITHUB_SHA", "local-working-tree")[:12]

FONT_REGULAR = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_MONO = "Courier"


def register_fonts() -> None:
    global FONT_REGULAR, FONT_BOLD, FONT_MONO
    candidates = [
        (
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        ),
        (
            "/usr/share/fonts/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/dejavu/DejaVuSansMono.ttf",
        ),
    ]
    for regular, bold, mono in candidates:
        if Path(regular).exists() and Path(bold).exists() and Path(mono).exists():
            pdfmetrics.registerFont(TTFont("PackSans", regular))
            pdfmetrics.registerFont(TTFont("PackSansBold", bold))
            pdfmetrics.registerFont(TTFont("PackMono", mono))
            FONT_REGULAR = "PackSans"
            FONT_BOLD = "PackSansBold"
            FONT_MONO = "PackMono"
            return


def clean_control_chars(value: str) -> str:
    value = value.replace("\x00", "")
    return "".join(ch for ch in value if ch in "\n\t" or ord(ch) >= 32)


def slugify(value: str, max_len: int = 88) -> str:
    value = value.replace("&", " and ")
    value = re.sub(r"[^A-Za-z0-9]+", "-", value).strip("-")
    value = re.sub(r"-+", "-", value)
    return (value[:max_len].rstrip("-") or "document")


def markdown_inline_to_text(value: str) -> str:
    value = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", r"Image: \1 (\2)", value)
    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 (\2)", value)
    value = value.replace("**", "").replace("__", "").replace("~~", "")
    value = value.replace(chr(96), "")
    value = re.sub(r"(?<!\w)[*_](.+?)[*_](?!\w)", r"\1", value)
    return value.strip()


def wrap_mono_line(line: str, width: int = 96) -> list[str]:
    if not line:
        return [""]
    return textwrap.wrap(
        line,
        width=width,
        replace_whitespace=False,
        drop_whitespace=False,
        break_long_words=True,
        break_on_hyphens=False,
    ) or [""]


class PackDocTemplate(BaseDocTemplate):
    def __init__(self, filename: str, title: str, source_label: str):
        self.pack_title = title
        self.source_label = source_label
        super().__init__(
            filename,
            pagesize=A4,
            rightMargin=18 * mm,
            leftMargin=18 * mm,
            topMargin=19 * mm,
            bottomMargin=18 * mm,
            title=title,
            author="Dubbo eWaste / AssetFlow",
            subject="NotebookLM research pack",
            creator="DubboEwaste reproducible PDF exporter",
            pageCompression=1,
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="normal")
        self.addPageTemplates(PageTemplate(id="pack", frames=[frame], onPage=self._on_page))

    def _on_page(self, canvas, doc):
        canvas.saveState()
        canvas.setFont(FONT_REGULAR, 7.5)
        canvas.setFillColor(colors.HexColor("#555555"))
        footer = f"Dubbo eWaste NotebookLM Pack | {self.source_label} | page {doc.page}"
        canvas.drawString(self.leftMargin, 9 * mm, footer[:135])
        canvas.restoreState()


def make_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "PackTitle", parent=styles["Title"], fontName=FONT_BOLD, fontSize=20,
            leading=24, alignment=TA_LEFT, spaceAfter=8,
            textColor=colors.HexColor("#202124"), wordWrap="CJK",
        ),
        "h1": ParagraphStyle(
            "H1", parent=styles["Heading1"], fontName=FONT_BOLD, fontSize=15,
            leading=19, spaceBefore=9, spaceAfter=5, keepWithNext=True, wordWrap="CJK",
        ),
        "h2": ParagraphStyle(
            "H2", parent=styles["Heading2"], fontName=FONT_BOLD, fontSize=12,
            leading=15, spaceBefore=7, spaceAfter=4, keepWithNext=True, wordWrap="CJK",
        ),
        "h3": ParagraphStyle(
            "H3", parent=styles["Heading3"], fontName=FONT_BOLD, fontSize=10.5,
            leading=13, spaceBefore=6, spaceAfter=3, keepWithNext=True, wordWrap="CJK",
        ),
        "body": ParagraphStyle(
            "Body", parent=styles["BodyText"], fontName=FONT_REGULAR, fontSize=8.7,
            leading=12, spaceAfter=3.5, alignment=TA_LEFT, wordWrap="CJK",
        ),
        "bullet": ParagraphStyle(
            "Bullet", parent=styles["BodyText"], fontName=FONT_REGULAR, fontSize=8.5,
            leading=11.5, leftIndent=10, firstLineIndent=-7, spaceAfter=2, wordWrap="CJK",
        ),
        "quote": ParagraphStyle(
            "Quote", parent=styles["BodyText"], fontName=FONT_REGULAR, fontSize=8.5,
            leading=11.5, leftIndent=10, rightIndent=6,
            textColor=colors.HexColor("#444444"), borderColor=colors.HexColor("#BBBBBB"),
            borderWidth=0.5, borderPadding=(0, 0, 0, 6), spaceAfter=4, wordWrap="CJK",
        ),
        "mono": ParagraphStyle(
            "Mono", parent=styles["Code"], fontName=FONT_MONO, fontSize=6.7,
            leading=8.5, leftIndent=4, rightIndent=2, backColor=colors.HexColor("#F5F5F5"),
            borderPadding=4, spaceAfter=4,
        ),
        "meta": ParagraphStyle(
            "Meta", parent=styles["BodyText"], fontName=FONT_REGULAR, fontSize=7.8,
            leading=10.2, textColor=colors.HexColor("#555555"), spaceAfter=2, wordWrap="CJK",
        ),
        "index": ParagraphStyle(
            "Index", parent=styles["BodyText"], fontName=FONT_REGULAR, fontSize=7.8,
            leading=10.2, leftIndent=10, firstLineIndent=-10, spaceAfter=2.2, wordWrap="CJK",
        ),
    }


def esc(value: str) -> str:
    return html.escape(clean_control_chars(value), quote=False)


def paragraph(text: str, style):
    return Paragraph(esc(markdown_inline_to_text(text)), style)


def markdown_story(markdown: str, styles: dict) -> list:
    lines = clean_control_chars(markdown).replace("\r\n", "\n").replace("\r", "\n").split("\n")
    story = []
    code_lines: list[str] = []
    in_code = False

    def flush_code():
        nonlocal code_lines
        if code_lines:
            wrapped = []
            for ln in code_lines:
                wrapped.extend(wrap_mono_line(ln))
            story.append(Preformatted("\n".join(wrapped), styles["mono"], maxLineLength=100))
            code_lines = []

    for raw in lines:
        line = raw.rstrip()

        if line.strip().startswith(chr(96) * 3):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if not line.strip():
            story.append(Spacer(1, 2.2 * mm))
            continue

        stripped = line.strip()
        if re.fullmatch(r"[-*_]{3,}", stripped):
            story.append(Spacer(1, 2.5 * mm))
            continue

        h = re.match(r"^(#{1,6})\s+(.*)$", stripped)
        if h:
            level = len(h.group(1))
            style = styles["h1"] if level == 1 else styles["h2"] if level == 2 else styles["h3"]
            story.append(paragraph(h.group(2), style))
            continue

        if stripped.startswith(">"):
            story.append(paragraph(stripped.lstrip("> ").strip(), styles["quote"]))
            continue

        task = re.match(r"^\s*[-*+]\s+\[([ xX])\]\s+(.*)$", line)
        bullet = re.match(r"^\s*[-*+]\s+(.*)$", line)
        numbered = re.match(r"^\s*(\d+)[.)]\s+(.*)$", line)
        if task:
            mark = "[x]" if task.group(1).lower() == "x" else "[ ]"
            story.append(paragraph(f"{mark} {task.group(2)}", styles["bullet"]))
            continue
        if bullet:
            story.append(paragraph(f"- {bullet.group(1)}", styles["bullet"]))
            continue
        if numbered:
            story.append(paragraph(f"{numbered.group(1)}. {numbered.group(2)}", styles["bullet"]))
            continue

        if stripped.startswith("|") and "|" in stripped[1:]:
            if re.fullmatch(r"\|?[\s:|-]+\|?", stripped):
                continue
            cells = [markdown_inline_to_text(c.strip()) for c in stripped.strip("|").split("|")]
            text = " | ".join(cells)
            wrapped = []
            for ln in wrap_mono_line(text, 100):
                wrapped.append(ln)
            story.append(Preformatted("\n".join(wrapped), styles["mono"], maxLineLength=104))
            continue

        story.append(paragraph(stripped, styles["body"]))

    if in_code:
        flush_code()
    return story


def build_pdf(output: Path, title: str, source_label: str, metadata: list[tuple[str, str]], body_story: list, styles: dict) -> None:
    doc = PackDocTemplate(str(output), title=title, source_label=source_label)
    story = [Paragraph(esc(title), styles["title"])]
    for key, value in metadata:
        story.append(Paragraph(f"<b>{esc(key)}:</b> {esc(value)}", styles["meta"]))
    story.append(Spacer(1, 3 * mm))
    story.extend(body_story)
    doc.build(story)


def repo_doc_title(path: str) -> str:
    stem = Path(path).stem
    if stem.upper() in {"README", "START-HERE"}:
        prefix = Path(path).parent.name
        if prefix not in {".", ""}:
            stem = f"{prefix} - {stem}"
    return stem.replace("-", " ").replace("_", " ").strip().title()


def build_index(manifest_entries: list[dict], output: Path, styles: dict) -> None:
    body = [
        Paragraph("Purpose", styles["h1"]),
        paragraph(
            "A curated, NotebookLM-ready research library for the Dubbo eWaste / AssetFlow project. "
            "It combines the project's strongest internal research with current primary-source briefs "
            "covering community repair, ITAD, e-waste, data sanitisation, policy, safety, schools, reuse, "
            "downstream recycling and digital inclusion.",
            styles["body"],
        ),
        Paragraph("Pack composition", styles["h1"]),
        paragraph(
            "Exactly 100 PDFs: 1 master index, 74 converted repository documents, and 25 original external-source briefs. "
            "The external briefs link to the source rather than reproducing full third-party publications.",
            styles["body"],
        ),
        Paragraph("Suggested NotebookLM use", styles["h1"]),
        paragraph(
            "Upload the 100 PDFs as one project. Start with this index and the executive synthesis, then ask NotebookLM to "
            "compare evidence across sources, identify conflicts, build operating procedures, draft partner questions, and "
            "separate verified facts from proposals or assumptions.",
            styles["body"],
        ),
        Paragraph("Contents", styles["h1"]),
    ]
    for item in manifest_entries:
        body.append(
            Paragraph(
                f"<b>{item['number']:03d}</b> - {esc(item['title'])}<br/>"
                f"<font color='#666666'>{esc(item['kind'])} | {esc(item['source'])}</font>",
                styles["index"],
            )
        )
    build_pdf(
        output,
        "Dubbo eWaste NotebookLM Research Pack - Master Index",
        "master index",
        [
            ("Generated", GENERATED_DATE),
            ("Repository source commit", SOURCE_COMMIT),
            ("PDF count", "100"),
            ("Internal repo documents", "74"),
            ("External primary-source briefs", "25"),
        ],
        body,
        styles,
    )


def verify_pdfs(pdf_paths: list[Path]) -> None:
    if len(pdf_paths) != 100:
        raise RuntimeError(f"Expected exactly 100 PDFs, found {len(pdf_paths)}")
    failures = []
    for path in pdf_paths:
        try:
            reader = PdfReader(str(path))
            if not reader.pages:
                failures.append(f"{path.name}: no pages")
                continue
            sample = "\n".join((page.extract_text() or "") for page in reader.pages[:2]).strip()
            if len(sample) < 30:
                failures.append(f"{path.name}: insufficient extractable text")
        except Exception as exc:
            failures.append(f"{path.name}: {exc}")
    if failures:
        raise RuntimeError("PDF verification failures:\n" + "\n".join(failures))


def main() -> None:
    register_fonts()
    styles = make_styles()
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))

    repo_docs = config["repo_documents"]
    external = config["external_briefs"]
    if len(repo_docs) != 74 or len(external) != 25:
        raise RuntimeError(f"Source selection must remain 74 repo + 25 external; got {len(repo_docs)} + {len(external)}")

    if PACK_ROOT.exists():
        shutil.rmtree(PACK_ROOT)
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    number = 2

    for source_path in repo_docs:
        src = ROOT / source_path
        if not src.exists():
            raise FileNotFoundError(f"Configured repository source missing: {source_path}")
        source_content = src.read_text(encoding="utf-8", errors="replace")
        title = repo_doc_title(source_path)
        filename = f"{number:03d}-repo-{slugify(source_path)}.pdf"
        output = PDF_DIR / filename
        build_pdf(
            output,
            title,
            source_path,
            [
                ("Source type", "DubboEwaste repository document"),
                ("Repository path", source_path),
                ("Source commit", SOURCE_COMMIT),
                ("Pack generated", GENERATED_DATE),
            ],
            markdown_story(source_content, styles),
            styles,
        )
        manifest.append({
            "number": number,
            "filename": filename,
            "title": title,
            "kind": "Repository document",
            "source": source_path,
        })
        number += 1

    for brief in external:
        title = brief["title"]
        filename = f"{number:03d}-external-{slugify(title)}.pdf"
        output = PDF_DIR / filename
        body = [
            Paragraph("Source summary", styles["h1"]),
            paragraph(brief["summary"], styles["body"]),
            Paragraph("Why this matters for Dubbo eWaste", styles["h1"]),
            paragraph(brief["why_it_matters"], styles["body"]),
            Paragraph("Source handling note", styles["h1"]),
            paragraph(
                "This PDF is an original research brief prepared for the NotebookLM pack. It summarises the linked source "
                "and does not reproduce the source publication in full. Re-check the linked primary source before relying "
                "on time-sensitive legal, regulatory, pricing or operational details.",
                styles["body"],
            ),
        ]
        build_pdf(
            output,
            title,
            brief["url"],
            [
                ("Source type", "External primary-source research brief"),
                ("Category", brief["category"]),
                ("Primary source", brief["url"]),
                ("Source checked", GENERATED_DATE),
            ],
            body,
            styles,
        )
        manifest.append({
            "number": number,
            "filename": filename,
            "title": title,
            "kind": "External source brief",
            "source": brief["url"],
            "category": brief["category"],
        })
        number += 1

    index_path = PDF_DIR / "001-MASTER-INDEX-Dubbo-eWaste-NotebookLM-Research-Pack.pdf"
    full_manifest = [{
        "number": 1,
        "filename": index_path.name,
        "title": "Dubbo eWaste NotebookLM Research Pack - Master Index",
        "kind": "Pack index",
        "source": "Curated from DubboEwaste repo + listed primary sources",
    }] + manifest
    build_index(full_manifest, index_path, styles)

    pdf_paths = sorted(PDF_DIR.glob("*.pdf"))
    verify_pdfs(pdf_paths)

    MANIFEST_PATH.write_text(
        json.dumps({
            "pack_name": config["pack_name"],
            "pack_date": config["pack_date"],
            "source_commit": SOURCE_COMMIT,
            "pdf_count": len(pdf_paths),
            "entries": sorted(full_manifest, key=lambda x: x["number"]),
        }, indent=2) + "\n",
        encoding="utf-8",
    )

    README_PATH.write_text(
        "# Dubbo eWaste NotebookLM 100-PDF Research Pack\n\n"
        "Generated 6 October 2026.\n\n"
        "- Exactly 100 PDFs in the pdfs folder.\n"
        "- 74 PDFs are conversions of curated DubboEwaste repository documents.\n"
        "- 25 PDFs are original research briefs pointing to current external primary sources.\n"
        "- 1 PDF is the master index.\n"
        "- The ZIP contains the 100 PDFs only.\n\n"
        "External briefs summarise and link to third-party sources rather than republishing their full text.\n",
        encoding="utf-8",
    )

    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for pdf in pdf_paths:
            zf.write(pdf, arcname=pdf.name)

    with zipfile.ZipFile(ZIP_PATH, "r") as zf:
        members = [n for n in zf.namelist() if n.lower().endswith(".pdf")]
        if len(members) != 100:
            raise RuntimeError(f"ZIP verification failed: expected 100 PDFs, found {len(members)}")

    size_mb = ZIP_PATH.stat().st_size / (1024 * 1024)
    print(f"Built {len(pdf_paths)} verified PDFs")
    print(f"ZIP: {ZIP_PATH.relative_to(ROOT)} ({size_mb:.2f} MiB)")


if __name__ == "__main__":
    main()
