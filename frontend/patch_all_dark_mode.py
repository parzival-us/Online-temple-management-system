import os
import re

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Define simple class mappings
    mappings = {
        r'\btext-gray-900\b': 'text-gray-900 dark:text-gray-100',
        r'\btext-gray-800\b': 'text-gray-800 dark:text-gray-100',
        r'\btext-gray-700\b': 'text-gray-700 dark:text-gray-200',
        r'\btext-gray-600\b': 'text-gray-600 dark:text-gray-300',
        r'\btext-gray-500\b': 'text-gray-500 dark:text-gray-400',
        r'\btext-black\b': 'text-black dark:text-white',
        r'\bbg-white\b': 'bg-white dark:bg-gray-800',
        r'\bbg-gray-50\b': 'bg-gray-50 dark:bg-gray-900',
        r'\bbg-gray-100\b': 'bg-gray-100 dark:bg-gray-800',
    }

    original_content = content

    for old_regex, new_class in mappings.items():
        # Only replace if the new class isn't already there to avoid duplication
        # Find all occurrences of the base class
        def replacer(match):
            # Check context to ensure we don't duplicate
            return new_class

        # A simpler way without breaking existing dark: classes:
        # We temporarily remove the dark classes if they exist, then apply the mapping
        dark_variant = new_class.split(' ')[1]
        
        # Remove existing exact matches of the dark variant if they immediately follow
        content = re.sub(rf'{old_regex}\s+{dark_variant}', match_pattern(old_regex), content)
        # Apply the mapping
        content = re.sub(old_regex, new_class, content)

    # Clean up any accidental double dark classes like "dark:text-gray-100 dark:text-gray-100"
    content = re.sub(r'(dark:\S+)(?:\s+\1)+', r'\1', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def match_pattern(p):
    # Returns the literal class name from regex like \btext-gray-900\b
    return p.replace(r'\b', '')

# Redefining the logic slightly for safety
def safe_patch(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pairs = [
        ('text-gray-900', 'dark:text-gray-100'),
        ('text-gray-800', 'dark:text-gray-100'),
        ('text-gray-700', 'dark:text-gray-200'),
        ('text-gray-600', 'dark:text-gray-300'),
        ('text-gray-500', 'dark:text-gray-400'),
        ('text-black', 'dark:text-white'),
        ('bg-white', 'dark:bg-gray-800'),
        ('bg-gray-50', 'dark:bg-gray-900'),
        ('bg-gray-100', 'dark:bg-gray-800'),
    ]

    for base, dark in pairs:
        # We want to replace "base" with "base dark" if "dark" is not already next to it
        # and if we aren't replacing inside another word
        pattern = rf'\b{base}\b(?!\s+{dark})'
        replacement = f'{base} {dark}'
        content = re.sub(pattern, replacement, content)

    # Dedup
    for base, dark in pairs:
        content = content.replace(f'{base} {dark} {dark}', f'{base} {dark}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

count = 0
for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx'):
            safe_patch(os.path.join(root, file))
            count += 1
print(f"Patched {count} files for comprehensive dark mode text support.")
