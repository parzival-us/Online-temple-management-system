from flask import Blueprint, request, jsonify
from app import db
from app.models import Event, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

events_bp = Blueprint('events', __name__)

@events_bp.route('/', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.date.asc()).all()
    return jsonify([{
        "id": e.id,
        "title": e.title,
        "description": e.description,
        "date": e.date.isoformat()
    } for e in events]), 200

@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    date_str = data.get('date')

    if not title or not description or not date_str:
        return jsonify({"msg": "Missing fields"}), 400

    try:
        event_date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use ISO format"}), 400

    new_event = Event(title=title, description=description, date=event_date)
    db.session.add(new_event)
    db.session.commit()

    return jsonify({"msg": "Event created successfully", "id": new_event.id}), 201

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"msg": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()

    return jsonify({"msg": "Event deleted successfully"}), 200
