#!/usr/bin/env python3
"""Unit tests for query_postmarketos_devices."""

import unittest

import query_postmarketos_devices as q


class PmosDeviceListTests(unittest.TestCase):
    def setUp(self):
        self.rows = q.load()

    def test_schema_and_nonempty(self):
        self.assertTrue(self.rows)
        self.assertEqual(q.REQUIRED_COLUMNS - set(self.rows[0].keys()), set())

    def test_generic_msm8909_present(self):
        hits = q.search(self.rows, "msm8909")
        self.assertTrue(any(r["codename"] == "qcom-msm8909" for r in hits))

    def test_search_by_name(self):
        hits = q.search(self.rows, "fairphone")
        self.assertTrue(hits)
        self.assertTrue(all("fairphone" in r["name"].lower() for r in hits))

    def test_category_filter(self):
        community = q.filter_rows(self.rows, category="community")
        self.assertTrue(community)
        self.assertTrue(all(r["category"] == "community" for r in community))

    def test_arch_filter(self):
        armv7 = q.filter_rows(self.rows, arch="armv7")
        self.assertTrue(armv7)
        self.assertTrue(all(r["arch"] == "armv7" for r in armv7))

    def test_maturity_sort_puts_community_before_testing(self):
        rows = [
            {"category": "testing", "name": "B", "codename": "b"},
            {"category": "community", "name": "A", "codename": "a"},
        ]
        ordered = q.sort_by_maturity(rows)
        self.assertEqual(ordered[0]["category"], "community")

    def test_provenance_recorded(self):
        # Every row must carry an upstream provenance tag (reproducibility).
        self.assertTrue(all(r["source"].startswith("postmarketos-pmaports@") for r in self.rows))


if __name__ == "__main__":
    unittest.main()
