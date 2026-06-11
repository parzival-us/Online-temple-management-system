from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.donations import donations_bp
    from app.routes.events import events_bp
    from app.routes.admin import admin_bp
    from app.routes.prasad import prasad_bp
    from app.routes.gallery import gallery_bp
    from app.routes.chat import chat_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(donations_bp, url_prefix='/api/donations')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(prasad_bp, url_prefix='/api/prasad')
    app.register_blueprint(gallery_bp, url_prefix='/api/gallery')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')

    return app
