import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent

HTML_ATTR_RE = re.compile(r"""\b(?:src|href)\s*=\s*(["'])(.*?)\1""", re.I)
ID_RE = re.compile(r"""\bid\s*=\s*(["'])(.*?)\1""", re.I)
VIEWPORT_RE = re.compile(r"""<meta\s+[^>]*name\s*=\s*(["'])viewport\1""", re.I)
ANCHOR_RE = re.compile(r"""href\s*=\s*(["'])#([^"']+)\1""", re.I)
EXTERNAL_RE = re.compile(r"^(?:[a-zA-Z][a-zA-Z0-9+.-]*:|//)")


def iter_html_files():
    return sorted(ROOT.rglob("*.html"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="ignore")


def validate_viewport(files):
    missing = []
    for fp in files:
        if not VIEWPORT_RE.search(read_text(fp)):
            missing.append(fp)
    return missing


def validate_missing_local_refs(files):
    missing = []
    for fp in files:
        txt = read_text(fp)
        for _, url in HTML_ATTR_RE.findall(txt):
            if not url or url.startswith("#") or EXTERNAL_RE.match(url):
                continue
            url2 = url.split("#", 1)[0].split("?", 1)[0]
            if not url2:
                continue
            target = (fp.parent / url2).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                # ref points outside repo; ignore
                continue
            if not target.exists():
                missing.append((fp, url))
    return missing


def validate_duplicate_ids(files):
    duplicates = []
    for fp in files:
        ids = []
        for _, idv in ID_RE.findall(read_text(fp)):
            if idv:
                ids.append(idv.strip())
        counts = defaultdict(int)
        for idv in ids:
            counts[idv] += 1
        for idv, c in counts.items():
            if c > 1:
                duplicates.append((fp, idv, c))
    return duplicates


def validate_in_page_anchors(files):
    broken = []
    for fp in files:
        txt = read_text(fp)
        ids = {idv.strip() for _, idv in ID_RE.findall(txt) if idv.strip()}
        for _, frag in ANCHOR_RE.findall(txt):
            frag = frag.strip()
            if frag and frag not in ids:
                broken.append((fp, frag))
    return broken


def main():
    html_files = iter_html_files()
    print(f"Validating {len(html_files)} HTML files under {ROOT}...\n")

    viewport_missing = validate_viewport(html_files)
    local_missing = validate_missing_local_refs(html_files)
    duplicate_ids = validate_duplicate_ids(html_files)
    broken_anchors = validate_in_page_anchors(html_files)

    has_errors = False

    if viewport_missing:
        has_errors = True
        print("FAIL: Missing viewport meta tag in:")
        for fp in viewport_missing:
            print(f"- {fp.relative_to(ROOT).as_posix()}")
        print()
    else:
        print("PASS: All pages include viewport meta tag.\n")

    if local_missing:
        has_errors = True
        print("FAIL: Missing local referenced files (src/href):")
        for fp, url in local_missing:
            print(f"- {fp.relative_to(ROOT).as_posix()}: {url}")
        print()
    else:
        print("PASS: No missing local src/href file references.\n")

    if duplicate_ids:
        has_errors = True
        print("FAIL: Duplicate ids within a single HTML file:")
        for fp, idv, c in duplicate_ids:
            print(f"- {fp.relative_to(ROOT).as_posix()}: id=\"{idv}\" appears {c} times")
        print()
    else:
        print("PASS: No duplicate ids found within any single HTML file.\n")

    if broken_anchors:
        has_errors = True
        print("FAIL: Broken in-page anchors (href=\"#...\") without a matching id on the same page:")
        for fp, frag in broken_anchors:
            print(f"- {fp.relative_to(ROOT).as_posix()}: #{frag}")
        print()
    else:
        print("PASS: No broken in-page anchors on any page.\n")

    if has_errors:
        print("Validation result: FAIL")
        return 2
    print("Validation result: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

