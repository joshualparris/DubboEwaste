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

    def test_unverified_rows_flagged(self):
        row = dict(self.rows[0], verification="EXAMPLE-UNVERIFIED")
        self.assertFalse(q.is_verified(row))
        self.assertEqual(q.recommend(row)[0][0], "Research needed")

    def row(self, code):
        return q.search(self.rows, code)[0]

    def test_recommend_prefers_maintained_lineageos_then_linux_options(self):
        names = [n for n, _ in q.recommend(self.row("enchilada"))]
        self.assertEqual(names, ["LineageOS", "postmarketOS", "Ubuntu Touch", "Droidian",
                                 "Dubbo Reuse app on the existing Android"])

    def test_locked_bootloader_gets_app_only_whatever_upstream_says(self):
        locked = dict(self.row("enchilada"), bootloader_unlock="no")
        names = [n for n, _ in q.recommend(locked)]
        self.assertEqual(names, ["No OS replacement", "Dubbo Reuse app on the existing Android"])
        self.assertEqual([n for n, _ in q.recommend(self.row("AMN-LX2"))][0], "No OS replacement")

    def test_soc_match_alone_is_never_a_recommendation(self):
        # Same SoC as a supported phone but no upstream listings: only the app.
        clone = dict(self.row("enchilada"), model_code="clone", lineageos_official="no",
                     postmarketos_status="unknown", ubuntu_touch_status="unknown", droidian_status="no")
        self.assertEqual([n for n, _ in q.recommend(clone)], ["Dubbo Reuse app on the existing Android"])

    def test_unmaintained_lineageos_ranked_last_with_warning(self):
        recs = q.recommend(self.row("hammerhead"))
        names = [n for n, _ in recs]
        self.assertEqual(names[0], "Ubuntu Touch")
        self.assertIn("LineageOS (unmaintained)", names)
        self.assertIn("No security updates", dict(recs)["LineageOS (unmaintained)"])

    def test_carrier_caveat_shown(self):
        self.assertIn("Carrier-locked", q.recommend(self.row("sargo"))[0][1])

    def test_linux_phone_gets_no_android_app(self):
        names = [n for n, _ in q.recommend(self.row("pinephone"))]
        self.assertEqual(names, ["postmarketOS", "Ubuntu Touch"])

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
