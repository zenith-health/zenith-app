import os
import json
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from flask import Blueprint, request, jsonify
from app import mongo, mail
from flask_mail import Message
from dotenv import load_dotenv
from base64 import urlsafe_b64encode

# Load environment variables from .env file
load_dotenv()

bp = Blueprint('share', __name__)

# Derive an encryption key from the user's email using PBKDF2
def derive_key(email, salt, iterations=100_000):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,  # AES-256 requires a 32-byte key
        salt=salt,
        iterations=iterations,
        backend=default_backend(),
    )
    return kdf.derive(email.encode())

# Encrypt data using AES
def encrypt_data(data, key, iv):
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Ensure the data is padded to a multiple of 16 bytes (AES block size)
    padding_length = 16 - (len(data) % 16)
    data += chr(padding_length) * padding_length  # Padding
    encrypted_data = encryptor.update(data.encode()) + encryptor.finalize()

    return encrypted_data

# Function to send an email notification with an encrypted file
def send_notification(user_email, encrypted_data, iv, salt):
    msg = Message('Your Encrypted Data',
                  recipients=[user_email])
    msg.body = 'Seus dados foram criptografados e enviados como anexo. Use seu email para descriptografar.'

    # Ensure the directory exists before saving the encrypted file
    export_dir = os.path.join(os.path.dirname(__file__), '..', 'exports')
    if not os.path.exists(export_dir):
        os.makedirs(export_dir)  # Create the directory if it doesn't exist

    # Save encrypted data to a file
    encrypted_file = os.path.join(export_dir, 'encrypted_anamnesis.enc')
    with open(encrypted_file, 'wb') as f:
        f.write(encrypted_data)

    # Attach the encrypted file
    with open(encrypted_file, 'rb') as fp:
        msg.attach("encrypted_anamnesis.enc", "application/octet-stream", fp.read())

    # Include IV and salt in the email for decryption
    msg.body += f'\n\nIV: {urlsafe_b64encode(iv).decode()}\nSalt: {urlsafe_b64encode(salt).decode()}'

    try:
        with mail.connect() as conn:
            conn.send(msg)
        print(f"Email sent to {user_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Endpoint to get anamnesis data by user email and send notification email
@bp.route('/anamnesis/', methods=['GET'])
def get_user_anamnesis():
    try:
        # Get the email from the query parameters
        email = request.args.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Step 1: Fetch the user by email to get their user ID
        user = mongo.db.users.find_one({'email': email})
        
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id = str(user['_id'])  # Ensure user_id is a string

        # Debug log: Print user ID
        print(f"User ID: {user_id}")

        # Step 2: Fetch anamnesis records that are linked to the user's ID
        user_anamnesis = mongo.db.anamnesis.find({'user_id': user_id})
        
        # Debug log: Print query results
        print(f"Anamnesis Query Results: {list(user_anamnesis)}")

        # Re-query because cursor is exhausted after list()
        user_anamnesis = mongo.db.anamnesis.find({'user_id': user_id})
        anamnese_list = []
        
        for anamnese in user_anamnesis:
            anamnese_list.append({
                'id': str(anamnese['_id']),
                'historico_medico': anamnese.get('historico_medico', ''),
                'alergias': anamnese.get('alergias', ''),
                'medicamentos': anamnese.get('medicamentos', ''),
                'created_at': anamnese.get('created_at', '')
            })

        # Debug log: Print resulting data
        print(f"Anamnese Data: {anamnese_list}")

        if not anamnese_list:
            return jsonify({"error": "No anamnesis data found for this user"}), 404

        # Convert data to JSON string
        data_str = json.dumps(anamnese_list)

        print(f"Serialized Anamnesis Data: {data_str}")

        # Derive encryption key using email
        salt = os.urandom(16)  # Generate a random salt
        key = derive_key(email, salt)
        iv = os.urandom(16)  # Generate a random IV

        # Encrypt the data
        encrypted_data = encrypt_data(data_str, key, iv)

        # Send the notification email with the encrypted data
        send_notification(email, encrypted_data, iv, salt)

        return jsonify({"message": "Encrypted data sent successfully."}), 200

    except Exception as e:
        print(f"Error fetching anamnesis: {str(e)}")
        return jsonify({"error": "Internal server error fetching anamnesis"}), 500

