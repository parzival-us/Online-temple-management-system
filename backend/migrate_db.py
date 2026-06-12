from app import create_app
from flask_migrate import upgrade
import traceback
import sys

try:
    print("Initializing Flask App...")
    app = create_app()
    with app.app_context():
        print("Running database migrations...")
        upgrade()
        print("Database migrations applied successfully!")
        
        # Seed Admin User
        from app import db
        from app.models.user import User
        from werkzeug.security import generate_password_hash
        
        admin = User.query.filter_by(email='admin@temple.com').first()
        if not admin:
            admin = User(
                name='Admin',
                email='admin@temple.com',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user seeded successfully!")
except Exception as e:
    print("FATAL ERROR DURING MIGRATION:", file=sys.stderr)
    traceback.print_exc()
    sys.exit(1)
