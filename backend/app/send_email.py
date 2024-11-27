from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from bson.objectid import ObjectId 
from . import mongo, mail

bp = Blueprint('anamnese_routes', __name__)

@bp.route('/send_anamnese_email/<user_id>', methods=['POST'])
@jwt_required()
def send_anamnese_email(user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"message": "ID de usuário inválido."}), 400

        anamnese = mongo.db.anamneses.find_one({"userId": ObjectId(user_id)})
        
        if not anamnese or 'conteudo' not in anamnese:
            return jsonify({"message": "Anamnese não encontrada ou incompleta."}), 404

        current_user = get_jwt_identity()
        
        if 'id' not in current_user:
            return jsonify({"message": "Informações do usuário estão incompletas."}), 400

        
        user = mongo.db.users.find_one({"_id": ObjectId(current_user['id'])})
        
        if not user or 'email' not in user or 'name' not in user:
            return jsonify({"message": "Informações do usuário estão incompletas."}), 400

        subject = f"Anamnese do paciente {user['name']}"
        body = f"""
        Olá {user['name']},

        Aqui está a anamnese que você solicitou:
        {anamnese['conteudo']}

        Atenciosamente,
        Sua Equipe Médica
        """

        msg = Message(subject,
                      sender='seu-email@gmail.com',
                      recipients=[user['email']])  
        msg.body = body

        mail.send(msg)

        return jsonify({"message": "Anamnese enviada com sucesso para o e-mail do paciente"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
