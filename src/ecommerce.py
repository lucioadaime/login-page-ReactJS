from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt 
import datetime

SECRET_KEY = "your_secret_key"

app = Flask(__name__)
CORS(app)

def generate_jwt_token(username):
    """Generate a JWT token."""
    expiration_time = datetime.datetime.now() + datetime.timedelta(hours=1)  # Token valid for 1 hour
    payload = {
        "username": username,
        "exp": expiration_time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()   
    username = data.get('username')
    password = data.get('password')
    # Implement login logic here
    if username == "admin" and password == "password":  # Replace with real validation
        token = generate_jwt_token(username)
        return jsonify({'success': True, 'token': token})
    else:
        return jsonify({'success': False}), 401
    

@app.route('/products', methods=['GET'])
def get_products():
    print(request.headers.get('Authorization'))

    token = request.headers.get('Authorization')
    if token and token.startswith("Bearer "):
        try:
            # Decode the JWT token
            decoded_token = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            print("Decoded token:", decoded_token)
            current_time = int(datetime.datetime.now().timestamp())
            print("Current time:", current_time)            
            print("Token expiration:", decoded_token.get("exp"))
            # If decoding is successful, return the products
            products = [
                {'id': 1, 'name': 'Specialty Coffee'},
                {'id': 2, 'name': 'Italian Coffeemaker'},
            ]
            return jsonify(products)
        
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
    else:
        return jsonify({'error': 'Authorization required'}), 401

if __name__ == '__main__':
    app.run(debug=True)
