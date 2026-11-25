import hashlib, json, tempfile, unittest
from pathlib import Path
import reuseos_assistant as ra

class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.iso = self.tmp / "reuseos-amd64.iso"; self.iso.write_bytes(b"ISO" * 1000)
        self.sums = self.tmp / "SHA256SUMS"
        self.sums.write_text(hashlib.sha256(self.iso.read_bytes()).hexdigest() + "  reuseos-amd64.iso\n")
        self.ventoy = self.tmp / "Ventoy"; (self.ventoy / "ventoy").mkdir(parents=True)

class ImageIntegrity(Base):
    def test_good_checksum(self):
        self.assertTrue(ra.verify(self.iso, self.sums)[0])
    def test_tampered_image_detected(self):
        self.iso.write_bytes(b"tampered")
        self.assertFalse(ra.verify(self.iso, self.sums)[0])
    def test_unlisted_image_rejected(self):
        other = self.tmp / "other.iso"; other.write_bytes(b"x")
        with self.assertRaises(ValueError): ra.verify(other, self.sums)

class InstallerSafety(Base):
    def test_copies_only_with_exact_confirmation(self):
        with self.assertRaisesRegex(ValueError, "Confirmation"):
            ra.ventoy_copy(self.iso, self.sums, self.ventoy, confirm="")
        self.assertFalse((self.ventoy / self.iso.name).exists())
        target = ra.ventoy_copy(self.iso, self.sums, self.ventoy, confirm=str(self.ventoy))
        self.assertEqual(ra.sha256(target), ra.sha256(self.iso))
    def test_refuses_non_ventoy_target(self):
        plain = self.tmp / "Documents"; plain.mkdir()
        with self.assertRaisesRegex(ValueError, "Ventoy"):
            ra.ventoy_copy(self.iso, self.sums, plain, confirm=str(plain))
        self.assertEqual(list(plain.iterdir()), [])
    def test_refuses_unverified_image(self):
        self.iso.write_bytes(b"corrupt")
        with self.assertRaisesRegex(ValueError, "checksum"):
            ra.ventoy_copy(self.iso, self.sums, self.ventoy, confirm=str(self.ventoy))
    def test_record_excludes_personal_fields(self):
        out = self.tmp / "af.jsonl"
        with self.assertRaises(ValueError): ra.record(out, serial="ABC123")
        e = ra.record(out, asset_tag="DE-0001", model="Dell Latitude E6440", result="booted", boot_mode="uefi")
        self.assertEqual(json.loads(out.read_text())["asset_tag"], "DE-0001"); self.assertEqual(e["schema"], "assetflow-import/v1")

class Classification(unittest.TestCase):
    def test_unknown_device_not_called_supported(self):
        self.assertEqual(ra.check("Totally Unknown Phone 9000"), [])
    def test_locked_and_apple_are_not_installable(self):
        rows = {r["id"]: r for r in ra.load_db()}
        self.assertEqual(rows["android-bootloader-locked"]["reuseos_status"], "blocked")
        self.assertEqual(rows["apple-ios"]["reuseos_status"], "unsupported")
    def test_every_status_has_plain_explanation(self):
        for r in ra.load_db():
            self.assertIn(r["reuseos_status"], ra.STATUS_TEXT)

if __name__ == "__main__":
    unittest.main()
