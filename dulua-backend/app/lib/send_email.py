import smtplib
from email.mime.text import MIMEText


def send_email(recipient, code):
    subject = "Dulua | Your Verification Code"
    sender = "gk7125690@gmail.com"
    password = ""

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; margin: auto;">
          <h1 style="color: #1F4037; text-align: center; margin-bottom: 5px;">Dulua</h1>
          <p style="text-align: center; font-style: italic; color: #1F4037; margin-top: 0;">
            "Wander without a destination, find stories along the way."
          </p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
          <p>Hello Adventurer,</p>
          <p>Thank you for choosing <strong>Dulua</strong>. Your verification code is:</p>
          <p style="font-size: 26px; font-weight: bold; color: #1F4037; text-align: center; letter-spacing: 2px;">
            {code}
          </p>
          <p>If you didn’t request this, please disregard this email.</p>
          <p style="font-size: 12px; color: #888; text-align: center;">— Dulua Team</p>
        </div>
      </body>
    </html>
    """

    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp_server:
        smtp_server.login(sender, password)
        smtp_server.sendmail(sender, recipient, msg.as_string())

    print("Message sent!")
