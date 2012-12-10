### RESIZE IMAGE
find 'public/images/sample' -type f \( -name "*.JPG" -o -name "*.jpg" -o -name "*.PNG" -o -name "*.png" \) -exec convert {} -resize 64x64\! {} \;/