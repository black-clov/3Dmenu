import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import (
    RoundedModuleDrawer,
    GappedSquareModuleDrawer,
    CircleModuleDrawer
)
from qrcode.image.styles.colormasks import (
    RadialGradiantColorMask,
    SolidFillColorMask,
    HorizontalGradiantColorMask
)
from PIL import Image, ImageDraw, ImageFont
import os

# ---------------------------
# CONFIGURATION
# ---------------------------
OUTPUT_DIR = "qrcodes"
os.makedirs(OUTPUT_DIR, exist_ok=True)

BACKGROUND_PATH = "menu_bg.jpg"  # replace with your background file, or leave None
LOGO_PATH = None  # e.g., "logo.png"

# Example dish menu links
dish_links = {
    "Y_Table 1": "https://threedmenu-server.onrender.com/redirect/Y/table1",

}

# ---------------------------
# QR STYLE VARIATIONS
# ---------------------------
module_styles = [RoundedModuleDrawer(), GappedSquareModuleDrawer(), CircleModuleDrawer()]
color_masks = [
    RadialGradiantColorMask(back_color=(255, 255, 255), center_color=(255, 100, 100), edge_color=(50, 0, 0)),
    HorizontalGradiantColorMask(back_color=(255, 255, 255), left_color=(0, 150, 255), right_color=(0, 0, 100)),
    SolidFillColorMask(back_color=(255, 255, 255), front_color=(0, 120, 80)),
]

# Try loading a font for text below QR
try:
    FONT = ImageFont.truetype("arial.ttf", 40)
except:
    FONT = ImageFont.load_default()

# ---------------------------
# MAIN GENERATION LOOP
# ---------------------------
for i, (dish_name, url) in enumerate(dish_links.items()):
    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Style selection
    module_drawer = module_styles[i % len(module_styles)]
    color_mask = color_masks[i % len(color_masks)]

    qr_img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=module_drawer,
        color_mask=color_mask
    ).convert("RGBA")

    # Add logo (optional)
    if LOGO_PATH and os.path.exists(LOGO_PATH):
        logo = Image.open(LOGO_PATH).convert("RGBA")
        qr_width, qr_height = qr_img.size
        logo_size = qr_width // 5
        logo = logo.resize((logo_size, logo_size), Image.LANCZOS)
        pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)
        qr_img.alpha_composite(logo, dest=pos)

    # Background setup
    bg_size = (800, 1000)
    if BACKGROUND_PATH and os.path.exists(BACKGROUND_PATH):
        bg = Image.open(BACKGROUND_PATH).convert("RGBA").resize(bg_size, Image.LANCZOS)
    else:
        # Generate a soft gradient background (restaurant card style)
        bg = Image.new("RGBA", bg_size, (30, 30, 30, 255))
        draw = ImageDraw.Draw(bg)
        for y in range(bg_size[1]):
            color = (int(30 + y * 0.1), int(30 + y * 0.1), int(30 + y * 0.1))
            draw.line([(0, y), (bg_size[0], y)], fill=color)

    # Paste QR centered on background
    qr_resized = qr_img.resize((600, 600), Image.LANCZOS)
    qr_x = (bg.width - qr_resized.width) // 2
    qr_y = 180
    bg.alpha_composite(qr_resized, (qr_x, qr_y))

    # Add table/dish name text
    draw = ImageDraw.Draw(bg)
    text = dish_name
    bbox = draw.textbbox((0, 0), text, font=FONT)
    text_w, text_h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    text_x = (bg.width - text_w) // 2
    text_y = qr_y + qr_resized.height + 40
    draw.text((text_x, text_y), text, font=FONT, fill=(255, 215, 0, 255))  # gold color

    # Save
    file_name = f"{dish_name.replace(' ', '_')}.png"
    output_path = os.path.join(OUTPUT_DIR, file_name)
    bg.save(output_path, format="PNG")

    print(f"✅ Saved QR code for {dish_name} → {output_path}")

print("\n🎉 All QR codes generated successfully!")
