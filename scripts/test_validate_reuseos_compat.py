import csv, tempfile, unittest
from pathlib import Path
import validate_reuseos_compat as v

def write(rows):
    f = tempfile.NamedTemporaryFile("w", suffix=".csv", delete=False, newline="")
    w = csv.DictWriter(f, fieldnames=v.REQUIRED); w.writeheader(); w.writerows(rows); f.close()
    return Path(f.name)

BASE = dict(id="x", category="computer", family_or_model="Test PC", architecture="x86_64", reuseos_edition="PC",
            install_path="USB", bootloader_requirement="", prerequisites="", upstream_project="Debian",
            upstream_status="maintained", reuseos_status="not-started", evidence="", source_url="", notes="")

class CompatTests(unittest.TestCase):
    def test_repository_database_is_valid(self):
        self.assertEqual(v.validate(), [])
    def test_architecture_match_alone_is_not_support(self):
        self.assertTrue(v.validate(write([dict(BASE, reuseos_status="physically-verified")])))
    def test_physical_claim_must_name_model(self):
        self.assertTrue(v.validate(write([dict(BASE, reuseos_status="physically-verified", evidence="worked")])))
        self.assertEqual(v.validate(write([dict(BASE, reuseos_status="physically-verified", evidence="model Dell Latitude E6440 booted 2026-11-25")])), [])
    def test_unknown_status_rejected(self):
        self.assertTrue(v.validate(write([dict(BASE, reuseos_status="supported")])))
    def test_blocked_needs_no_install_path(self):
        self.assertEqual(v.validate(write([dict(BASE, reuseos_status="blocked", install_path="")])), [])

if __name__ == "__main__":
    unittest.main()
