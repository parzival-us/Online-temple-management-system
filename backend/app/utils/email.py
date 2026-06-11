from flask_mail import Message
from app import mail

def send_email(to, subject, body):
    try:
        msg = Message(subject=subject, recipients=[to], body=body)
        mail.send(msg)
        print(f"Sent email to {to}")
    except Exception as e:
        print(f"Failed to send email: {e}")
