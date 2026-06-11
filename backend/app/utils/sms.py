import os
from twilio.rest import Client

def send_sms(to_number, message_body):
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_number = os.getenv('TWILIO_PHONE_NUMBER')

    if not all([account_sid, auth_token, from_number]):
        print("Twilio credentials not fully set. Mocking SMS send.")
        print(f"To: {to_number} | Message: {message_body}")
        return

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=message_body,
            from_=from_number,
            to=to_number
        )
        return message.sid
    except Exception as e:
        print(f"Failed to send SMS: {e}")
