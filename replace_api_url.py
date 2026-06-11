import os
import glob

directory = r"d:\Online Temple Management System\frontend\src"
files = glob.glob(directory + '/**/*.jsx', recursive=True) + glob.glob(directory + '/**/*.js', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the hardcoded local URL with a dynamic environment variable fallback
    if 'http://127.0.0.1:5000' in content:
        new_content = content.replace("'http://127.0.0.1:5000", "(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000') + '")
        new_content = new_content.replace("`http://127.0.0.1:5000", "`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}")
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {file}")
