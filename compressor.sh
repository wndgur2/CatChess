#!/bin/bash

# Check if the user provided the compressed file name as an argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <compressed_file_name>"
    exit 1
fi

# Get the compressed file name from the user input
compressed_file_name="$1"

# Create the zip file excluding the __MACOSX folder
zip -r "../CatChessBackup/$compressed_file_name.zip" . -x@exclude_list.txt

# Display a message indicating the compression is complete
echo "Compression complete!"

