from flask import Blueprint, jsonify
from app.models import GalleryImage

gallery_bp = Blueprint('gallery', __name__)

@gallery_bp.route('/', methods=['GET'])
def get_gallery():
    images = GalleryImage.query.all()
    
    # Return some mock data if DB is empty, just for testing
    if not images:
        return jsonify([
            {"id": 1, "title": "Majestic Temple Architecture", "image_url": "/gallery/temple_exterior_1781212786781.png"},
            {"id": 2, "title": "Sacred Puja & Offerings", "image_url": "/gallery/temple_puja_1781212798138.png"},
            {"id": 3, "title": "Evening Festival Illumination", "image_url": "/gallery/temple_festival_1781212810535.png"},
            {"id": 4, "title": "Peaceful Stone Corridor", "image_url": "/gallery/temple_corridor_1781212822447.png"}
        ]), 200

    return jsonify([{
        "id": img.id,
        "title": img.title,
        "image_url": img.image_url
    } for img in images]), 200
