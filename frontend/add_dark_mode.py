import os

replacements = {
    'bg-white': 'bg-white dark:bg-gray-800',
    'text-gray-800': 'text-gray-800 dark:text-gray-100',
    'text-gray-700': 'text-gray-700 dark:text-gray-200',
    'text-gray-600': 'text-gray-600 dark:text-gray-300',
    'text-gray-500': 'text-gray-500 dark:text-gray-400',
    'bg-gray-50': 'bg-gray-50 dark:bg-gray-700',
    'border-gray-200': 'border-gray-200 dark:border-gray-700',
}

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            for old, new in replacements.items():
                # Make sure we don't double replace
                if old in content and new not in content:
                    content = content.replace(old, new)
                    
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Dark mode classes added to all components.")
