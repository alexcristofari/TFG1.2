# backend/database.py
"""
Módulo de conexão com SQL Server
Gerencia a conexão com o banco de dados de forma centralizada
"""

import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações do banco (você pode ajustar conforme seu ambiente)
DB_SERVER = os.getenv('DB_SERVER', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'recomendador')
DB_DRIVER = os.getenv('DB_DRIVER', '{SQL Server}')

# Se você usar autenticação do Windows (Trusted_Connection)
# Se precisar de usuário e senha, adicione DB_USER e DB_PASSWORD no .env
USE_WINDOWS_AUTH = os.getenv('USE_WINDOWS_AUTH', 'true').lower() == 'true'

def get_db_connection():
    """
    Cria e retorna uma conexão com o SQL Server
    
    Returns:
        pyodbc.Connection: Objeto de conexão
    
    Raises:
        Exception: Se não conseguir conectar ao banco
    """
    try:
        if USE_WINDOWS_AUTH:
            # Autenticação do Windows (mais comum em ambientes locais)
            connection_string = (
                f'DRIVER={DB_DRIVER};'
                f'SERVER={DB_SERVER};'
                f'DATABASE={DB_NAME};'
                'Trusted_Connection=yes;'
            )
        else:
            # Autenticação SQL Server (usuário e senha)
            DB_USER = os.getenv('DB_USER', 'sa')
            DB_PASSWORD = os.getenv('DB_PASSWORD', '')
            connection_string = (
                f'DRIVER={DB_DRIVER};'
                f'SERVER={DB_SERVER};'
                f'DATABASE={DB_NAME};'
                f'UID={DB_USER};'
                f'PWD={DB_PASSWORD};'
            )
        
        conn = pyodbc.connect(connection_string, timeout=10)
        return conn
    
    except pyodbc.Error as e:
        print(f"❌ ERRO ao conectar ao SQL Server: {e}")
        raise Exception(f"Não foi possível conectar ao banco de dados: {str(e)}")

def test_connection():
    """
    Testa a conexão com o banco de dados
    
    Returns:
        bool: True se conectou com sucesso, False caso contrário
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        conn.close()
        
        if result:
            print("✅ Conexão com SQL Server OK!")
            return True
        return False
    
    except Exception as e:
        print(f"❌ Falha no teste de conexão: {e}")
        return False

if __name__ == '__main__':
    # Testa a conexão quando executar este arquivo diretamente
    print("Testando conexão com SQL Server...")
    test_connection()


