#!/usr/bin/env python3
"""Visitor Check-in Register — a small CLI app with JSON persistence.
Models front-desk / reception visitor management (check in, check out, list, report)."""
import json, sys, os
from datetime import datetime

DB = os.path.join(os.path.dirname(__file__), "visitors.json")

def load():
    if not os.path.exists(DB): return []
    with open(DB) as f: return json.load(f)

def store(rows):
    with open(DB, "w") as f: json.dump(rows, f, indent=2)

def check_in(name, company, host):
    rows = load()
    vid = (max([r["id"] for r in rows], default=0)) + 1
    rows.append({"id": vid, "name": name, "company": company, "host": host,
                 "in": datetime.now().isoformat(timespec="seconds"), "out": None})
    store(rows)
    return vid

def check_out(vid):
    rows = load()
    for r in rows:
        if r["id"] == vid and r["out"] is None:
            r["out"] = datetime.now().isoformat(timespec="seconds"); store(rows); return True
    return False

def on_site(rows=None):
    rows = rows if rows is not None else load()
    return [r for r in rows if r["out"] is None]

def report(rows=None):
    rows = rows if rows is not None else load()
    return {"total": len(rows), "on_site": len(on_site(rows)),
            "checked_out": len([r for r in rows if r["out"]])}

def _print_usage():
    print("Usage:\n  visitor.py in  <name> <company> <host>\n  visitor.py out <id>\n"
          "  visitor.py list\n  visitor.py report")

def main(argv):
    if not argv: _print_usage(); return 1
    cmd = argv[0]
    if cmd == "in" and len(argv) >= 4:
        print(f"Checked in. Visitor ID = {check_in(argv[1], argv[2], ' '.join(argv[3:]))}")
    elif cmd == "out" and len(argv) == 2:
        print("Checked out." if check_out(int(argv[1])) else "Not found / already out.")
    elif cmd == "list":
        for r in on_site(): print(f'#{r["id"]:>3} {r["name"]} ({r["company"]}) -> {r["host"]}  since {r["in"]}')
        if not on_site(): print("Nobody on site.")
    elif cmd == "report":
        s = report(); print(f'Total: {s["total"]} | On-site: {s["on_site"]} | Checked out: {s["checked_out"]}')
    else:
        _print_usage(); return 1
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
