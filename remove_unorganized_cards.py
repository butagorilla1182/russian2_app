import json
import re
from pathlib import Path

path = Path("cards.js")
text = path.read_text(encoding="utf-8")

m = re.search(r"const\s+cards\s*=\s*(\[.*\]);?\s*$", text, re.S)
if not m:
    raise SystemExit("cards.js の形式を読み取れませんでした")

cards = json.loads(m.group(1))

before = len(cards)

def is_bad(card):
    values = [
        str(card.get("front", "")),
        str(card.get("back", "")),
        str(card.get("section", "")),
        str(card.get("source_context", "")),
        str(card.get("answer", "")),
    ]
    joined = "\n".join(values)
    bad_words = [
        "未整理語彙",
        "未整理",
        "要整理",
    ]
    return any(w in joined for w in bad_words)

cards = [c for c in cards if not is_bad(c)]

after = len(cards)

out = "const cards = "
out += json.dumps(cards, ensure_ascii=False, indent=2)
out += ";\n"

path.write_text(out, encoding="utf-8")

print(f"before: {before}")
print(f"after : {after}")
print(f"removed: {before - after}")
