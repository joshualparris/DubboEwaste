import re

# 1. NSW
with open('NSW-Market-Sales-Channels.md', 'r') as f:
    nsw = f.read()

# Fix AusPost
nsw = re.sub(
    r'\*\   Follow Australia Post.*?cannot be sent\.',
    r'*   Follow Australia Post\'s current service-specific lithium battery requirements before sending. Air services generally require batteries installed in equipment; loose/packed-with batteries may be permitted on some surface services subject to packaging and dangerous-goods requirements.',
    nsw,
    flags=re.DOTALL
)

# Remove FB integrated shipping
nsw = re.sub(
    r'\*\   \*\*Shipping and Checkout Fees:\*\* If you opt to use Facebook.*?check current Australian fees\.\n',
    r'',
    nsw,
    flags=re.DOTALL
)

with open('NSW-Market-Sales-Channels.md', 'w') as f:
    f.write(nsw)


# 2. Education
with open('Education-Directory.md', 'r') as f:
    edu = f.read()

edu = re.sub(
    r'\[UNVERIFIED current status and location; sources are 2019-2020, contact them first\]',
    r'is an active e-waste social enterprise in Meadowbrook, QLD [VERIFIED]',
    edu
)

# Remove eWaste Ben
edu = re.sub(
    r'\*\   \*\*eWaste Ben:\*\*.*?salvage run\.\n',
    r'',
    edu,
    flags=re.DOTALL
)

# Remove Podcasts section if it contains The Smart Flip and The Flipping Ninja
edu = re.sub(
    r'### \*\*The Smart Flip \& The Flipping Ninja\*\*.*?(?=###|$)',
    r'',
    edu,
    flags=re.DOTALL
)

with open('Education-Directory.md', 'w') as f:
    f.write(edu)

