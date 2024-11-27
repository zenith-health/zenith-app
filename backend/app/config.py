import os
from dotenv import load_dotenv

load_dotenv() 

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    MONGO_URI = os.getenv('MONGO_URI')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

def configure_app(app):
    app.config.from_object(Config)
