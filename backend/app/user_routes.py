from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from . import mongo
from bson import ObjectId
import datetime

bp = Blueprint('user_routes', __name__)

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if 'email' not in data or 'password' not in data:
            return jsonify({"message": "Dados insuficientes fornecidos"}), 400
        
        email = data['email']
        password = data['password']
        
        user = mongo.db.users.find_one({"email": email})
        if user and check_password_hash(user['password'], password):
            return jsonify({
                "message": "Login bem-sucedido",
                "user": {
                    "id": str(user["_id"]),
                    "email": email,
                    "role": user.get("role", "user")
                }
            }), 200
        else:
            return jsonify({"message": "Email ou senha inválidos"}), 401
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bp.route('/home', methods=['GET'])
def home():
    try:
        user_id = request.args.get('user_id')  # Insecure way to fetch user ID from request
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400
        
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return jsonify({
                "message": "Bem-vindo ao painel de controle",
                "user": {
                    "id": str(user["_id"]),
                    "name": user['name'],
                    "email": user['email'],
                    "role": user['role']
                }
            }), 200
        else:
            return jsonify({"message": "Usuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bp.route('/admin', methods=['GET'])
def admin_dashboard():
    try:
        user_id = request.args.get('user_id')  # Insecure way to fetch user ID from request
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400
        
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user and user.get('role') == 'admin':
            return jsonify({"message": "Bem-vindo ao painel administrativo"}), 200
        else:
            return jsonify({"message": "Acesso negado"}), 403
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bp.route('/user/delete', methods=['DELETE'])
def delete_user():
    try:
        user_id = request.args.get('user_id')  # Insecure way to fetch user ID from request
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400
        
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"message": "Usuário não encontrado"}), 404
        
        mongo.db.deleted_users.insert_one({
            "userId": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "deletedAt": datetime.datetime.now()
        })

        mongo.db.users.delete_one({"_id": user["_id"]})
        return jsonify({"message": "Usuário excluído com sucesso e registrado na coleção de excluídos"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bp.route('/user', methods=['GET'])
def get_user_details():
    try:
        user_id = request.args.get('user_id')  # Insecure way to fetch user ID from request
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            return jsonify({
                "name": user['name'],
                "email": user['email'],
                "role": user.get('role', 'user')
            }), 200
        else:
            return jsonify({"message": "Usuário não encontrado"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Payload recebido:", data)  # Verifica o que está chegando

        # Valida a presença dos campos obrigatórios
        required_fields = ['name', 'email', 'password', 'acceptedTerms']
        for field in required_fields:
            if field not in data:
                return jsonify({"message": f"Campo obrigatório '{field}' não fornecido"}), 400
        
        # Extrai os dados
        name = data['name']
        email = data['email']
        password = data['password']
        accepted_terms = data['acceptedTerms']
        
        # Valida se acceptedTerms é booleano
        if not isinstance(accepted_terms, bool):
            return jsonify({"message": "O campo 'acceptedTerms' deve ser do tipo booleano"}), 400
        
        # Verifica se o usuário aceitou os termos
        if not accepted_terms:
            return jsonify({"message": "Você deve aceitar os Termos e Condições para se registrar"}), 400
        
        # Define o papel padrão como 'user', se não fornecido
        role = data.get('role', 'user')
        
        # Gera o hash da senha
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256') 
        
        # Verifica se o email já existe
        if mongo.db.users.find_one({"email": email}):
            return jsonify({"message": "Email já cadastrado"}), 400
        
        # Insere o usuário no banco de dados
        mongo.db.users.insert_one({
            'name': name,
            'email': email,
            'password': hashed_password,
            'role': role,
            'acceptedTerms': accepted_terms,  # Salva o valor booleano
            'created_at': datetime.datetime.utcnow()  # Adiciona a data de criação
        })
        
        return jsonify({"message": "Usuário registrado com sucesso"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500