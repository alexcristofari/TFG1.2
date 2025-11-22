# backend/blueprints/auth.py
"""
Blueprint de Autenticação
Gerencia registro, login e validação de usuários
"""

from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Importar a função de conexão com o banco
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db_connection

# Criar o blueprint
auth_bp = Blueprint('auth', __name__)

# Chave secreta para JWT (IMPORTANTE: Mude isso em produção!)
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'sua-chave-secreta-super-segura-mude-isso')
TOKEN_EXPIRATION_HOURS = 24 * 7  # Token válido por 7 dias

# ========================================
# FUNÇÕES AUXILIARES
# ========================================

def hash_password(password):
    """Gera hash bcrypt da senha"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password, hashed):
    """Verifica se a senha corresponde ao hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, email, name):
    """Gera token JWT"""
    payload = {
        'user_id': user_id,
        'email': email,
        'name': name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS),
        'iat': datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    """Verifica e decodifica token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# ========================================
# ROTAS
# ========================================

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Rota para registrar um novo usuário
    
    Esperado no body:
    {
        "email": "usuario@email.com",
        "password": "senha123",
        "name": "Nome do Usuário"
    }
    """
    try:
        data = request.get_json()
        
        # Validação básica
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        name = data.get('name', '').strip()
        
        # Validações
        if not email or not password or not name:
            return jsonify({'error': 'Email, senha e nome são obrigatórios'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Senha deve ter no mínimo 6 caracteres'}), 400
        
        if '@' not in email:
            return jsonify({'error': 'Email inválido'}), 400
        
        # Conectar ao banco
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar se email já existe
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            conn.close()
            return jsonify({'error': 'Este email já está cadastrado'}), 409
        
        # Hash da senha
        hashed_password = hash_password(password)
        
        # Inserir usuário no banco
        cursor.execute(
            "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
            (email, hashed_password, name)
        )
        conn.commit()
        
        # Buscar o ID do usuário recém-criado
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()
        user_id = user_row[0]
        
        conn.close()
        
        print(f"✅ [AUTH] Usuário cadastrado: {email} (ID: {user_id})")
        
        # Gerar token
        token = generate_token(user_id, email, name)
        
        return jsonify({
            'success': True,
            'message': 'Cadastro realizado com sucesso!',
            'token': token,
            'user': {
                'id': user_id,
                'email': email,
                'name': name
            }
        }), 201
    
    except Exception as e:
        print(f"❌ [AUTH] Erro no registro: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Erro ao criar conta. Tente novamente.'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Rota para fazer login
    
    Esperado no body:
    {
        "email": "usuario@email.com",
        "password": "senha123"
    }
    """
    try:
        data = request.get_json()
        
        # Validação básica
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()
        
        if not email or not password:
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        # Conectar ao banco
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscar usuário
        cursor.execute(
            "SELECT id, email, password, name FROM users WHERE email = ?",
            (email,)
        )
        user_row = cursor.fetchone()
        conn.close()
        
        # Verificar se usuário existe
        if not user_row:
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        user_id, user_email, hashed_password, user_name = user_row
        
        # Verificar senha
        if not verify_password(password, hashed_password):
            return jsonify({'error': 'Email ou senha incorretos'}), 401
        
        print(f"✅ [AUTH] Login bem-sucedido: {email}")
        
        # Gerar token
        token = generate_token(user_id, user_email, user_name)
        
        return jsonify({
            'success': True,
            'message': 'Login realizado com sucesso!',
            'token': token,
            'user': {
                'id': user_id,
                'email': user_email,
                'name': user_name
            }
        }), 200
    
    except Exception as e:
        print(f"❌ [AUTH] Erro no login: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Erro ao fazer login. Tente novamente.'}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify():
    """
    Rota para verificar se o token é válido
    
    Esperado no header:
    Authorization: Bearer <token>
    """
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Token não fornecido'}), 401
        
        # Extrair token do header
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Formato de token inválido'}), 401
        
        token = parts[1]
        
        # Verificar token
        payload = verify_token(token)
        
        if not payload:
            return jsonify({'error': 'Token inválido ou expirado'}), 401
        
        return jsonify({
            'success': True,
            'user': {
                'id': payload['user_id'],
                'email': payload['email'],
                'name': payload['name']
            }
        }), 200
    
    except Exception as e:
        print(f"❌ [AUTH] Erro na verificação: {str(e)}")
        return jsonify({'error': 'Erro ao verificar token'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Rota de logout (apenas retorna sucesso, o frontend deve limpar o token)
    """
    return jsonify({
        'success': True,
        'message': 'Logout realizado com sucesso!'
    }), 200

if __name__ == '__main__':
    print("Este é um blueprint e deve ser importado pelo app principal.")


