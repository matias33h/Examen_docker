CREATE DATABASE IF NOT EXISTS perfiles;
USE perfiles;
CREATE TABLE perfiles (
  nomUsuario VARCHAR(255),
  perfil VARCHAR(255),
  activo BOOLEAN
);
