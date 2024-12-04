import os
import sys
from base64 import urlsafe_b64decode
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

def derive_key(email, salt, iterations=100_000):
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
    from cryptography.hazmat.primitives import hashes
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=iterations,
        backend=default_backend()
    )
    return kdf.derive(email.encode())

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python decrypt.py <path_to_encrypted_file>")
        sys.exit(1)

    file_path = sys.argv[1]
    email = input("Digite seu email: ")
    salt_b64 = input("Digite a chave salt (enviada juntamente ao email): ")
    iv_b64 = input("Digite a chave IV (enviada juntamente ao email): ")

    print("Descriptografando arquivo...")

    try:
        salt = urlsafe_b64decode(salt_b64)
        iv = urlsafe_b64decode(iv_b64)
        key = derive_key(email, salt)

        print(f"Derived key: {key.hex()}")
        print(f"IV: {iv.hex()}")

        with open(file_path, "rb") as f:
            encrypted_data = f.read()

        print(f"Encrypted data: {encrypted_data.hex()}")

        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_data = decryptor.update(encrypted_data) + decryptor.finalize()

        # Remove padding
        padding_length = decrypted_data[-1]
        decrypted_data = decrypted_data[:-padding_length]

        print("Decrypted data:")
        print(decrypted_data.decode())

    except Exception as e:
        print(f"Decryption failed: {e}")
