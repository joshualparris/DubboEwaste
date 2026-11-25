#!/usr/bin/env python3
"""Unit tests for query_device_compatibility."""

import unittest

import query_device_compatibility as q


class CompatibilityDbTests(unittest.TestCase):
    def setUp(self):
        self.rows = q.load()

    def test_schema_loads(self):
        self.assertTrue(self.rows)
        self.assertEqual(q.REQUIRED_COLUMNS - set(self.rows[0].keys()), set())

    def test_desire_530_present_and_verified(self):
        hits = q.search(self.rows, "2PST1")
        self.assertEqual(len(hits), 1)
        self.assertEqual(hits[0]["marketing_name"], "HTC Desire 530")
        self.assertTrue(q.is_verified(hits[0]))

    def test_search_by_soc_family(self):
        hits = q.search(self.rows, "msm8909")
        self.assertTrue(any(r["model_code"] == "2PST1" for r in hits))

    def test_example_rows_flagged_unverified(self):
        hits = q.search(self.rows, "hammerhead")
        self.assertTrue(hits)
        self.assertFalse(q.is_verified(hits[0]))

    def test_verified_only_filter_excludes_examples(self):
        verified = q.filter_rows(self.rows, verified_only=True)
        self.assertTrue(all(q.is_verified(r) for r in verified))
        self.assertTrue(any(r["model_code"] == "2PST1" for r in verified))

    def test_by_role(self):
        clocks = q.by_role(self.rows, "clock")
        self.assertTrue(any(r["model_code"] == "2PST1" for r in clocks))
        pianos = q.by_role(self.rows, "piano")
        self.assertEqual(pianos, [])

    def test_min_ram_filter(self):
        big = q.filter_rows(self.rows, min_ram=2000)
        self.assertTrue(all(int(r["ram_mb"]) >= 2000 for r in big))


if __name__ == "__main__":
    unittest.main()
