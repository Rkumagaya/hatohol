import os
from hatohol import transporter

"""
Load all pyton files in this directory except for files which begin
with hyphen.
"""

def is_valid_module_name(filename):
    if not filename.endswith(".py"):
        return False
    if filename.startswith("_"):
        return False
    return True

def extract_module_name(filename):
    if not is_valid_module_name(filename):
        return None
    return filename[:-3] # remove the extension ".py"

file_dir = os.path.dirname(__file__)
files = os.listdir(file_dir)
for filename in files:
    module_name = extract_module_name(filename)
    if module_name is None:
        continue
    transporter.Manager.import_module(module_name, file_dir)
