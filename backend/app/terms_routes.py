from flask import Blueprint, request, jsonify
from . import mongo
from bson import ObjectId

bp = Blueprint('terms_routes', __name__) 

# Criar novos termos
@bp.route('/', methods=['POST'])
def create_terms():
    try:
        data = request.json
        terms_id = mongo.db.terms_and_conditions.insert_one(data).inserted_id
        return jsonify({"id": str(terms_id)}), 201
    except Exception as e:
        return jsonify({"error": f"Erro ao criar os termos: {str(e)}"}), 500

# Obter termos por ID
@bp.route('/<id>', methods=['GET'])
def get_terms(id):
    try:
        terms = mongo.db.terms_and_conditions.find_one_or_404({"_id": ObjectId(id)})
        return jsonify({
            "terms": terms.get("terms"),
            "accepted_on": terms.get("accepted_on")
        }), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao buscar os termos: {str(e)}"}), 404

# Atualizar termos por ID
@bp.route('/<id>', methods=['PUT'])
def update_terms(id):
    try:
        data = request.json
        result = mongo.db.terms_and_conditions.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count:
            return jsonify({"message": "Termos atualizados com sucesso"}), 200
        return jsonify({"error": "Termos não encontrados"}), 404
    except Exception as e:
        return jsonify({"error": f"Erro ao atualizar os termos: {str(e)}"}), 500

# Excluir termos por ID
@bp.route('/<id>', methods=['DELETE'])
def delete_terms(id):
    try:
        result = mongo.db.terms_and_conditions.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            return jsonify({"message": "Termos excluídos com sucesso"}), 200
        return jsonify({"error": "Termos não encontrados"}), 404
    except Exception as e:
        return jsonify({"error": f"Erro ao excluir os termos: {str(e)}"}), 500

# Obter todos os termos
@bp.route('/', methods=['GET'])
def get_all_terms():
    try:
        all_terms = mongo.db.terms_and_conditions.find()
        terms_list = []
        for term in all_terms:
            terms_list.append({
                'id': str(term['_id']),
                'terms': term.get('terms', ''),
                'accepted_on': term.get('accepted_on', '')
            })
        return jsonify(terms_list), 200
    except Exception as e:
        return jsonify({"error": f"Erro ao buscar todos os termos: {str(e)}"}), 500
