from flask import Blueprint, request, jsonify
from app import db
from app.models import PrasadOrder, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.sms import send_sms
from app.utils.email import send_email

prasad_bp = Blueprint('prasad', __name__)

@prasad_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    address = data.get('address')
    if not address:
        return jsonify({"msg": "Address is required"}), 400

    new_order = PrasadOrder(user_id=current_user_id, address=address)
    db.session.add(new_order)
    db.session.commit()

    # Active Triggers
    user = User.query.get(current_user_id)
    send_email(user.email, "Prasad Booking Confirmed", f"Hari Om {user.name},\nYour prasad booking has been confirmed and will be delivered to: {address}.")
    send_sms("+1234567890", f"Your Prasad order #{new_order.id} is confirmed.")

    return jsonify({"msg": "Prasad order placed successfully", "order_id": new_order.id}), 201

@prasad_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    current_user_id = get_jwt_identity()
    orders = PrasadOrder.query.filter_by(user_id=current_user_id).order_by(PrasadOrder.order_date.desc()).all()
    
    return jsonify([{
        "id": o.id,
        "status": o.status,
        "address": o.address,
        "tracking_details": o.tracking_details,
        "order_date": o.order_date.isoformat()
    } for o in orders]), 200
