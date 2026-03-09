$src = "C:\Users\Admin\.gemini\antigravity\brain\0cbce415-c090-4fef-9ec7-c4db015b64f7"
$dst = "d:\MY WEB\ArtesaniaDigital\assets\images"

Copy-Item "$src\product_woodspoons_1772729731714.png" "$dst\product-woodspoons.png" -Force
Copy-Item "$src\product_leatherbag_1772729748170.png" "$dst\product-leatherbag.png" -Force
Copy-Item "$src\product_glassware_1772729765538.png" "$dst\product-glassware.png" -Force
Copy-Item "$src\product_metalknife_1772729781861.png" "$dst\product-metalknife.png" -Force
Copy-Item "$src\product_woodbox_1772729797209.png" "$dst\product-woodbox.png" -Force
Copy-Item "$src\product_wovenblanket_1772729812740.png" "$dst\product-wovenblanket.png" -Force

Write-Output "All 6 images copied successfully!"
