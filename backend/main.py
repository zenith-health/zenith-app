from app import create_app

app = create_app()

if __name__ == "__main__":
    app.config['ENV'] = 'development'
    app.config['DEBUG'] = True
    app.run()