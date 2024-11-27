from flask import Blueprint, request, jsonify
from . import mongo
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request, get_jwt

bp = Blueprint('routes', __name__, url_prefix='/api')  # Adiciona o prefixo '/api'

@bp.route('/anamnesis', methods=['POST'])
@jwt_required()
def create_anamnesis():
    try:
        jwt_data = get_jwt()  # Decodifica o token JWT
        print("Token JWT recebido:", jwt_data)  # Log para depuração
        
        user_role = jwt_data.get("sub", {}).get("role")  # Extraindo a role do sub
        
        # Verifique se a role foi corretamente extraída
        if not user_role:
            return jsonify({"error": "Role não encontrada no token"}), 403

        # Se o usuário for admin, não deve permitir o acesso
        if user_role == "admin":
            return jsonify({"error": "Acesso negado. Admins não podem cadastrar anamneses."}), 403

        # Continuar com a lógica de usuário
        user_email = get_jwt_identity()
        print(user_email['email'])
        user = mongo.db.users.find_one({"email": user_email['email']})
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404

        data = request.json
        data["user_id"] = user["_id"]  # Vincular anamnese ao usuário
        anamnesis_id = mongo.db.anamnesis.insert_one(data).inserted_id
        return jsonify({"id": str(anamnesis_id)}), 201
    except Exception as e:
        print(f"Erro ao criar anamnese: {str(e)}")
        return jsonify({"error": "Erro interno ao criar anamnese"}), 500


@bp.route('/anamnesis/<id>', methods=['GET'])
@jwt_required()
def get_anamnesis(id):
    user_email = get_jwt_identity()
    try:
        print(user_email)
        user = mongo.db.users.find_one({"email": user_email['email']})
        print("user" +  user)
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        anamnesis = mongo.db.anamnesis.find_one_or_404({"_id": ObjectId(id), "user_id": user["_id"]})
        return jsonify({
            "historico_medico": anamnesis.get("historico_medico"),
            "alergias": anamnesis.get("alergias"),
            "medicamentos": anamnesis.get("medicamentos")
        })
    except Exception as e:
        print(f"Erro ao buscar anamnese: {str(e)}")  
        return jsonify({"error": "Anamnese não encontrada"}), 404
    

@bp.route('/anamnesis/<id>', methods=['PUT'])
@jwt_required()
def update_anamnesis(id):
    user_email = get_jwt_identity()
    data = request.json
    try:
        user = mongo.db.users.find_one({"email": user_email['email']})
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        result = mongo.db.anamnesis.update_one({"_id": ObjectId(id), "user_id": user["_id"]}, {"$set": data})
        if result.matched_count:
            return jsonify({"message": "Anamnese atualizada com sucesso"})
        else:
            return jsonify({"error": "Anamnese não encontrada"}), 404
    except Exception as e:
        print(f"Erro ao atualizar anamnese: {str(e)}") 
        return jsonify({"error": "Erro interno ao atualizar anamnese"}), 500
    

@bp.route('/anamnesis/<id>', methods=['DELETE'])
@jwt_required()
def delete_anamnese(id):
    user_email = get_jwt_identity()
    try:
        user = mongo.db.users.find_one({"email": user_email['email']})
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        result = mongo.db.anamnesis.delete_one({"_id": ObjectId(id), "user_id": user["_id"]})
        if result.deleted_count:
            return jsonify({"message": "Anamnese excluída com sucesso"})
        else:
            return jsonify({"error": "Anamnese não encontrada"}), 404
    except Exception as e:
        print(f"Erro ao excluir anamnese: {str(e)}") 
        return jsonify({"error": "Erro interno ao excluir anamnese"}), 500
    


@bp.route('/anamnesis/', methods=['GET'])
@jwt_required()
def get_all_anamnesis():
    user_email = get_jwt_identity()
    try:
        user = mongo.db.users.find_one({"email": user_email['email']})
        if not user:
            return jsonify({"error": "Usuário não encontrado"}), 404
        
        all_anamnesis = mongo.db.anamnesis.find({"user_id": user["_id"]})
        anamnese_list = []
        for anamnese in all_anamnesis:
            anamnese_list.append({
                'id': str(anamnese['_id']),
                'historico_medico': anamnese.get('historico_medico', ''),
                'alergias': anamnese.get('alergias', ''),
                'medicamentos': anamnese.get('medicamentos', '')
            })
        return jsonify(anamnese_list), 200
    except Exception as e:
        print(f"Erro ao buscar anamneses: {str(e)}") 
        return jsonify({"error": "Erro interno ao buscar anamneses"}), 500


@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'Servidor funcionando corretamente!'}), 200
