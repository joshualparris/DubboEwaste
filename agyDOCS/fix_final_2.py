import re

# 1. NSW
with open('NSW-Market-Sales-Channels.md', 'r') as f:
    nsw = f.read()

# Fix AusPost (user previously changed it to '*   **Australia Post rules:** Follow the current Australia Post lithium battery rules...')
nsw = re.sub(
    r'\*\s*\*\*Australia Post rules:\*\* Follow the current Australia Post lithium battery rules.*?were not confirmed on the current page\.\]',
    r'*   **Australia Post rules:** Follow Australia Post\'s current service-specific lithium battery requirements before sending. Air services generally require batteries installed in equipment; loose/packed-with batteries may be permitted on some surface services subject to packaging and dangerous-goods requirements.',
    nsw,
    flags=re.DOTALL
)

with open('NSW-Market-Sales-Channels.md', 'w') as f:
    f.write(nsw)

# 2. Education
with open('Education-Directory.md', 'r') as f:
    edu = f.read()

# Remove eWaste Ben completely
edu = re.sub(
    r'### \*\*\[UNVERIFIED\] eWaste Ben \(Australian\)\*\*.*?scrap value" baseline of electronics you cannot fix\.',
    r'',
    edu,
    flags=re.DOTALL
)

with open('Education-Directory.md', 'w') as f:
    f.write(edu)

