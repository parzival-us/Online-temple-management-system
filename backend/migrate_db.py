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
except Exception as e:
    print("FATAL ERROR DURING MIGRATION:", file=sys.stderr)
    traceback.print_exc()
    sys.exit(1)
