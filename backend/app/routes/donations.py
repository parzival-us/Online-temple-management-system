from flask import Blueprint, request, jsonify
from app import db
from app.models import Donation, User
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from app.utils.sms import send_sms
from app.utils.email import send_email

donations_bp = Blueprint('donations', __name__)

@donations_bp.route('/', methods=['POST'])
@jwt_required()
def create_donation():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    amount = data.get('amount')
    category = data.get('category')

    if not amount or not category:
        return jsonify({"msg": "Amount and category are required"}), 400

    new_donation = Donation(user_id=current_user_id, amount=amount, category=category)
    db.session.add(new_donation)
    db.session.commit()

    # Generate PDF Receipt (basic placeholder implementation)
    receipt_dir = os.path.join(os.getcwd(), 'receipts')
    os.makedirs(receipt_dir, exist_ok=True)
    filename = f"receipt_{new_donation.id}.pdf"
    filepath = os.path.join(receipt_dir, filename)
    
    c = canvas.Canvas(filepath, pagesize=letter)
    c.drawString(100, 750, f"Temple Donation Receipt")
    c.drawString(100, 730, f"Donation ID: {new_donation.id}")
    c.drawString(100, 710, f"Amount: Rs. {amount}")
    c.drawString(100, 690, f"Category: {category}")
    c.save()

    new_donation.receipt_url = f"/receipts/{filename}"
    db.session.commit()

    # Active Triggers
    user = User.query.get(current_user_id)
    send_email(user.email, "Donation Confirmation", f"Hari Om {user.name},\nThank you for your generous donation of Rs. {amount} towards {category}.")
    # Assume user phone is available or hardcode a test number. In a real app we fetch user.phone
    send_sms("+1234567890", f"Thank you for your donation of Rs. {amount} to Sri Temple Trust.")

    return jsonify({"msg": "Donation created successfully", "receipt_url": new_donation.receipt_url}), 201

@donations_bp.route('/', methods=['GET'])
@jwt_required()
def get_donations():
    current_user_id = get_jwt_identity()
    donations = Donation.query.filter_by(user_id=current_user_id).order_by(Donation.date.desc()).all()
    
    return jsonify([{
        "id": d.id,
        "amount": d.amount,
        "category": d.category,
        "date": d.date.isoformat(),
        "receipt_url": d.receipt_url
    } for d in donations]), 200
