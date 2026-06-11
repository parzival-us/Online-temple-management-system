import os

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # We patch the common class patterns used for inputs
            old_str1 = 'className="w-full mt-1 p-2 border rounded'
            new_str1 = 'className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            
            old_str2 = 'className="w-full p-2 border rounded'
            new_str2 = 'className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600'
            
            # Do the replacement only if we haven't already
            if new_str1 not in content:
                content = content.replace(old_str1, new_str1)
            if new_str2 not in content:
                content = content.replace(old_str2, new_str2)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
print("Forms patched")
