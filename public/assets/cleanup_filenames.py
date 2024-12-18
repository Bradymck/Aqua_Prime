import os
import re

def clean_name(name):
    # Remove any .png extension
    name = name.replace('.png', '')
    # Convert to lowercase
    name = name.lower()
    # Replace special characters and spaces with underscore
    name = re.sub(r'[^a-z0-9]', '_', name)
    # Replace multiple underscores with single one
    name = re.sub(r'_+', '_', name)
    # Remove leading/trailing underscores
    name = name.strip('_')
    return name

def clean_directory(directory):
    # First rename all folders
    for root, dirs, files in os.walk(directory, topdown=True):
        for dir_name in dirs:
            old_dir_path = os.path.join(root, dir_name)
            new_dir_name = clean_name(dir_name)
            new_dir_path = os.path.join(root, new_dir_name)
            
            if old_dir_path != new_dir_path:
                try:
                    os.rename(old_dir_path, new_dir_path)
                    print(f"Renamed folder: {dir_name} -> {new_dir_name}")
                except Exception as e:
                    print(f"Error renaming folder {dir_name}: {str(e)}")

    # Then rename all files
    for root, dirs, files in os.walk(directory):
        files = [f for f in files if f not in ['get_structure.py', 'cleanup_filenames.py']]
        
        for filename in files:
            if filename.lower().endswith(('.png', '.PNG')):
                old_path = os.path.join(root, filename)
                new_filename = f"{clean_name(filename)}.png"
                new_path = os.path.join(root, new_filename)
                
                if old_path != new_path:
                    try:
                        os.rename(old_path, new_path)
                        print(f"Renamed file: {filename} -> {new_filename}")
                    except Exception as e:
                        print(f"Error renaming file {filename}: {str(e)}")

if __name__ == "__main__":
    assets_dir = "."
    print("Starting cleanup of folders and files...")
    clean_directory(assets_dir)
    print("Cleanup complete!")