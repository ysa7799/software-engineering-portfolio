"""Tests for the visitor register — run: python3 test_visitor.py"""
import os, tempfile, importlib.util

spec = importlib.util.spec_from_file_location("visitor", os.path.join(os.path.dirname(__file__), "visitor.py"))
v = importlib.util.module_from_spec(spec); spec.loader.exec_module(v)

def run():
    v.DB = os.path.join(tempfile.mkdtemp(), "t.json")
    a = v.check_in("Ali", "ACME", "Ops Desk")
    b = v.check_in("Sara", "Globex", "Reception")
    assert len(v.on_site()) == 2, "two on site"
    assert v.check_out(a) is True
    assert v.check_out(a) is False, "cannot check out twice"
    assert len(v.on_site()) == 1
    r = v.report(); assert r == {"total":2,"on_site":1,"checked_out":1}, r
    print("All visitor tests passed ✓")

if __name__ == "__main__":
    run()
