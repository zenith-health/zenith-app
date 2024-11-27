# models.py
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from bson import ObjectId
import datetime

mongo = PyMongo()

class User:
    def __init__(self, email, password=None, hashed_password=None):
        self.email = email
        self.password = generate_password_hash(password) if password else hashed_password

    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password
        }

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({"email": email})

    @staticmethod
    def check_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)

    @staticmethod
    def create_user(email, password, acceptedTerms):
        user = User(email, password, acceptedTerms)
        mongo.db.users.insert_one(user.to_dict())

class Term:
    @staticmethod
    def create_term(data):
        """Cria um novo termo e retorna o ID do termo inserido."""
        term_id = mongo.db.terms_and_conditions.insert_one(data).inserted_id
        return term_id

    @staticmethod
    def get_term_by_id(term_id):
        """Obtém um termo pelo seu ID."""
        return mongo.db.terms_and_conditions.find_one({"_id": ObjectId(term_id)})

    @staticmethod
    def delete_term(term_id):
        """Deleta um termo pelo seu ID e retorna o número de documentos excluídos."""
        result = mongo.db.terms_and_conditions.delete_one({"_id": ObjectId(term_id)})
        return result.deleted_count

    @staticmethod
    def get_all_terms():
        """Obtém todos os termos e condições."""
        all_terms = mongo.db.terms_and_conditions.find()
        terms_list = []
        for term in all_terms:
            terms_list.append({
                'id': str(term['_id']),
                'title': term.get('title', ''),
                'content': term.get('content', ''),
                'created_at': term.get('created_at', '')
            })
        return terms_list
