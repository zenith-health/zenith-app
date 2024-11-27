from flask import Flask, request, make_response
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from flask_mail import Mail, Message
from dotenv import load_dotenv

mongo = PyMongo()
jwt = JWTManager()
mail = Mail()

def create_app():
    load_dotenv()

    app = Flask(__name__)
    
    # CORS configuration
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # MongoDB and JWT configurations
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    
    mongo.init_app(app)
    jwt.init_app(app)

    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))  # Porta precisa ser int
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS').lower() in ['true', '1', 't']
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

    mail.init_app(app)

    # Handle preflight requests
    @app.before_request
    def handle_options_requests():
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
            response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            response.headers.add("Access-Control-Allow-Credentials", "true")
            return response

    with app.app_context():
        from .routes import bp as anamnesis_bp
        from .user_routes import bp as user_bp
        from .terms_routes import bp as terms_bp
        from .send_email import bp as share_bp

        app.register_blueprint(anamnesis_bp)
        app.register_blueprint(user_bp, url_prefix='/users')
        app.register_blueprint(terms_bp, url_prefix='/api/terms')
        app.register_blueprint(share_bp, url_prefix='/api')

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
