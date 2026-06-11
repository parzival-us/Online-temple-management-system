from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    donations = db.relationship('Donation', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Donation(db.Model):
    __tablename__ = 'donations'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False) # e.g., 'General', 'Annadanam', 'Building Fund'
    date = db.Column(db.DateTime, default=datetime.utcnow)
    receipt_url = db.Column(db.String(255), nullable=True) # Path to generated PDF

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Temple(db.Model):
    __tablename__ = 'temples'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)

class PrasadOrder(db.Model):
    __tablename__ = 'prasad_orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    temple_id = db.Column(db.Integer, db.ForeignKey('temples.id'), nullable=True)
    status = db.Column(db.String(20), default='Pending') # Pending, Confirmed, Shipped
    address = db.Column(db.Text, nullable=False)
    tracking_details = db.Column(db.String(100), nullable=True)
    order_date = db.Column(db.DateTime, default=datetime.utcnow)

class GalleryImage(db.Model):
    __tablename__ = 'gallery'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=True)
    image_url = db.Column(db.String(255), nullable=False)
    temple_id = db.Column(db.Integer, db.ForeignKey('temples.id'), nullable=True)
