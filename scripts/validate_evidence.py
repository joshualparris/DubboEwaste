import yaml
import sys
import os

REQUIRED_FIELDS = {'id', 'claim', 'type', 'source', 'url', 'date_checked', 'verification_method', 'confidence', 'notes'}
ALLOWED_TYPES = {'Verified Fact', 'Proposed Policy', 'Hypothesis', 'Research Lead'}
ALLOWED_METHODS = {'Primary source', 'Direct contact', 'Public registry', 'Independent secondary source', 'Industry inference'}
ALLOWED_CONFIDENCE = {'High', 'Medium', 'Low'}

def validate():
    filepath = 'data/evidence.yaml'
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        sys.exit(1)
    
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)
    
    if not data:
        print("No evidence records found.")
        sys.exit(0)
    
    errors = 0
    for i, record in enumerate(data):
        missing = REQUIRED_FIELDS - set(record.keys())
        if missing:
            print(f"Record {i} missing fields: {missing}")
            errors += 1
            continue
        
        if record['type'] not in ALLOWED_TYPES:
            print(f"Record {record['id']} has invalid type: {record['type']}")
            errors += 1
        if record['verification_method'] not in ALLOWED_METHODS:
            print(f"Record {record['id']} has invalid verification_method: {record['verification_method']}")
            errors += 1
        if record['confidence'] not in ALLOWED_CONFIDENCE:
            print(f"Record {record['id']} has invalid confidence: {record['confidence']}")
            errors += 1

    if errors > 0:
        print(f"Validation failed with {errors} errors.")
        sys.exit(1)
    
    print("Evidence validation passed.")
    sys.exit(0)

if __name__ == '__main__':
    validate()
