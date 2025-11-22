-- Script para criar a tabela de usuários no SQL Server
-- Execute este script no SQL Server Management Studio

-- 1. Criar o banco de dados (se não existir)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'recomendador')
BEGIN
    CREATE DATABASE recomendador;
    PRINT 'Database recomendador criado com sucesso!';
END
ELSE
    PRINT 'Database recomendador já existe.';
GO

-- 2. Usar o banco de dados
USE recomendador;
GO

-- 3. Criar a tabela de usuários
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1,1),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
    PRINT 'Tabela users criada com sucesso!';
END
ELSE
    PRINT 'Tabela users já existe.';
GO

-- 4. Criar índice no email para buscas rápidas
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_email' AND object_id = OBJECT_ID('users'))
BEGIN
    CREATE INDEX idx_users_email ON users(email);
    PRINT 'Índice no email criado com sucesso!';
END
GO

-- 5. Verificar estrutura
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'users'
ORDER BY ORDINAL_POSITION;
GO

PRINT 'Script executado com sucesso! Tabela users está pronta para uso.';


