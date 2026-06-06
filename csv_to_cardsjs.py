import csv
import json
from pathlib import Path

csv_path = Path("cards_csv/russian2_master_vocab_60_86_audit_v05_1500.csv")
out_path = Path("cards.js")

cards = []

with csv_path.open("r", encoding="utf-8-sig", newline="") as f:
    reader = csv.DictReader(f)

    for i, row in enumerate(reader, start=1):
        card_id = row.get("card_id") or row.get("id") or f"r2-500-{i:04d}"
        front = row.get("front") or row.get("russian") or row.get("question") or ""
        back = row.get("back") or ""
        answer = row.get("answer") or row.get("japanese") or ""

        if not back:
            back = f"答え：{answer}"

        if "答え：" not in back:
            back = f"答え：{answer}\n{back}"

        card = {
            "id": card_id,
            "level": row.get("level") or 1,
            "category": row.get("category") or "vocab",
            "round": row.get("source_rounds") or row.get("round") or "",
            "section": row.get("source_section") or row.get("section") or "",
            "front": front,
            "back": back,
            "tags": ["russian2", "vocab500", "answer-required"],
            "part_of_speech": row.get("pos") or row.get("part_of_speech") or "",
            "noun_gender": row.get("gender") or row.get("noun_gender") or "",
            "noun_lemma": row.get("lemma") or row.get("noun_lemma") or "",
            "verb_aspect": row.get("aspect") or row.get("verb_aspect") or "",
            "aspect_pair": row.get("aspect_pair") or "",
            "imperfective": row.get("imperfective") or "",
            "perfective": row.get("perfective") or "",
            "case_pattern": row.get("case_pattern") or "",
            "source_context": row.get("source_context") or "",
            "answer": answer
        }

        cards.append(card)

js = "const cards = "
js += json.dumps(cards, ensure_ascii=False, indent=2)
js += ";\n"

out_path.write_text(js, encoding="utf-8")

print(f"created cards.js with {len(cards)} cards")
