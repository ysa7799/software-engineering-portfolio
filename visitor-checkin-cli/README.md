# Visitor Check-in Register (CLI)

A command-line **visitor management** tool in **Python** with JSON persistence — models front-desk / reception check-in used in facilities and security operations.

## Features
- Check visitors **in** (name, company, host) and **out** (by ID)
- **List** everyone currently on-site; **report** totals (total / on-site / checked-out)
- Persists to `visitors.json`; guards against double check-out
- Zero third-party dependencies; includes a **test suite**

## Run it
```bash
python3 visitor.py in "Ali" "ACME" "Ops Desk"
python3 visitor.py list
python3 visitor.py out 1
python3 visitor.py report
python3 test_visitor.py     # run tests
```

## Skills demonstrated
Python, CLI design, file/JSON persistence, state modeling, input handling, unit testing, defensive logic (no double check-out).
