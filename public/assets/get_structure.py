import os
from pathlib import Path

def print_structure(path, prefix=""):
    """Print the folder structure with a simple ASCII tree format"""
    # Get the contents of the directory
    entries = os.listdir(path)
    
    # Sort entries (folders first, then files)
    folders = [e for e in entries if os.path.isdir(os.path.join(path, e))]
    files = [e for e in entries if os.path.isfile(os.path.join(path, e))]
    
    folders.sort()
    files.sort()
    
    # Process all folders
    for i, folder in enumerate(folders):
        is_last_folder = i == len(folders) - 1 and len(files) == 0
        print(f"{prefix}{'└──' if is_last_folder else '├──'} 📁 {folder}")
        next_prefix = prefix + ("    " if is_last_folder else "│   ")
        print_structure(os.path.join(path, folder), next_prefix)
    
    # Process all files
    for i, file in enumerate(files):
        is_last = i == len(files) - 1
        print(f"{prefix}{'└──' if is_last else '├──'} 📄 {file}")

# Replace this with your folder path
folder_path = "."  # Current directory by default

print("\nFolder Structure:")
print("================")
print(f"📁 Root ({folder_path})")
print_structure(folder_path) 