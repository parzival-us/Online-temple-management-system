from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import jwt
from datetime import datetime, timedelta
from config import Config
from app.utils.email import send_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    
    # Optionally set the first user as admin
    if User.query.count() == 0:
        new_user.role = 'admin'

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '').strip()

    print(f"Login attempt for: '{email}'", flush=True)

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        print("Login failed: Bad email or password", flush=True)
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token, 
        "user": {
            "id": user.id, 
            "name": user.name, 
            "email": user.email, 
            "role": user.role
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"msg": "If an account exists, a reset link will be sent."}), 200

    token = jwt.encode(
        {'reset_password': user.email, 'exp': datetime.utcnow() + timedelta(minutes=15)},
        Config.SECRET_KEY, algorithm='HS256'
    )
    
    import os
    frontend_url = request.headers.get('Origin') or os.getenv('FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    send_email(user.email, "Password Reset Request", f"Click here to reset your password: {reset_link}")

    return jsonify({"msg": "If an account exists, a reset link will be sent."}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        email = payload['reset_password']
    except jwt.ExpiredSignatureError:
        return jsonify({"msg": "Token has expired"}), 400
    except jwt.InvalidTokenError:
        return jsonify({"msg": "Invalid token"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Password reset successfully"}), 200
