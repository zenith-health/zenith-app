from flask import Blueprint, request, jsonify
from . import mongo
from bson import ObjectId
from bson.errors import InvalidId

import logging
logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('routes', __name__, url_prefix='/api')  

@bp.route('/anamnesis', methods=['POST'])
def create_anamnese():
    print("Starting to create anamnese...")
    logging.debug("Starting to create anamnese...")

    try:
        # Extract data from the request body
        data = request.json
        if not data or not data.get('historico_medico') or not data.get('alergias') or not data.get('medicamentos'):
            print("Missing required fields in the request body.")
            return jsonify({"error": "Missing required fields"}), 422

        print(f"Received data: {data}")

        # Insert the anamnese into the database
        anamnesis_id = mongo.db.anamnesis.insert_one(data).inserted_id
        print(f"Anamnese created with ID: {anamnesis_id}")
        
        return jsonify({"id": str(anamnesis_id)}), 201
    except Exception as e:
        print(f"Error creating anamnese: {str(e)}")
        logging.error(f"Error creating anamnese: {str(e)}")
        return jsonify({"error": "Internal server error creating anamnese"}), 500


@bp.route('/anamnesis/<id>', methods=['GET'])
def get_anamnesis(id):
    try:
        # Convert id to ObjectId and find anamnese
        try:
            object_id = ObjectId(id)
        except InvalidId:
            print("Invalid ID format.")
            return jsonify({"error": "Invalid ID format"}), 400

        anamnesis = mongo.db.anamnesis.find_one_or_404({"_id": object_id})
        return jsonify({
            "historico_medico": anamnesis.get("historico_medico"),
            "alergias": anamnesis.get("alergias"),
            "medicamentos": anamnesis.get("medicamentos")
        })
    except Exception as e:
        print(f"Error fetching anamnese: {str(e)}")
        return jsonify({"error": "Anamnese not found"}), 404


@bp.route('/anamnesis/<id>', methods=['PUT'])
def update_anamnesis(id):
    data = request.json
    try:
        # Convert id to ObjectId and update the anamnese
        try:
            object_id = ObjectId(id)
        except InvalidId:
            print("Invalid ID format.")
            return jsonify({"error": "Invalid ID format"}), 400

        result = mongo.db.anamnesis.update_one({"_id": object_id}, {"$set": data})
        print(f"Update result: {result.matched_count} matched, {result.modified_count} modified")

        if result.matched_count:
            return jsonify({"message": "Anamnese updated successfully"})
        else:
            return jsonify({"error": "Anamnese not found"}), 404
    except Exception as e:
        print(f"Error updating anamnese: {str(e)}")
        return jsonify({"error": "Internal server error updating anamnese"}), 500


@bp.route('/anamnesis/<id>', methods=['DELETE'])
def delete_anamnesis(id):
    try:
        # Convert id to ObjectId and delete the anamnese
        try:
            object_id = ObjectId(id)
        except InvalidId:
            print("Invalid ID format.")
            return jsonify({"error": "Invalid ID format"}), 400

        result = mongo.db.anamnesis.delete_one({"_id": object_id})
        print(f"Delete result: {result.deleted_count} deleted")

        if result.deleted_count:
            return jsonify({"message": "Anamnese deleted successfully"})
        else:
            return jsonify({"error": "Anamnese not found"}), 404
    except Exception as e:
        print(f"Error deleting anamnese: {str(e)}")
        return jsonify({"error": "Internal server error deleting anamnese"}), 500


@bp.route('/anamnesis/', methods=['GET'])
def get_all_anamnesis():
    try:
        # Find all anamnesis in the database
        all_anamnesis = mongo.db.anamnesis.find()
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
        print(f"Error fetching anamneses: {str(e)}")
        return jsonify({"error": "Internal server error fetching anamneses"}), 500


@bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({'message': 'Server is running correctly!'}), 200
