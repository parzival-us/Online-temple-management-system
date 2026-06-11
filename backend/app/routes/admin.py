from flask import Blueprint, jsonify
from app import db
from app.models import User, Donation, Event
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
import datetime
import calendar

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403

    total_users = User.query.count()
    total_donations_amount = db.session.query(func.sum(Donation.amount)).scalar() or 0
    total_events = Event.query.count()

    # Aggregate donations by month for the real-time chart
    monthly_donations = db.session.query(
        func.strftime('%Y-%m', Donation.date).label('month'),
        func.sum(Donation.amount).label('total')
    ).group_by('month').all()

    donation_dict = {row.month: row.total for row in monthly_donations}

    today = datetime.date.today()
    chart_data = []
    
    # Build array for the last 6 months
    for i in range(5, -1, -1):
        m = today.month - i
        y = today.year
        if m <= 0:
            m += 12
            y -= 1
        month_key = f"{y}-{m:02d}"
        chart_data.append({
            "name": calendar.month_abbr[m],
            "donations": donation_dict.get(month_key, 0)
        })

    return jsonify({
        "total_users": total_users,
        "total_donations_amount": total_donations_amount,
        "total_events": total_events,
        "chart_data": chart_data
    }), 200
