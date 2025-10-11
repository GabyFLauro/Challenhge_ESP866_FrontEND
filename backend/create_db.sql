CREATE DATABASE IF NOT EXISTS sensores_db;
USE sensores_db;

CREATE TABLE IF NOT EXISTS sensores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pressao02_hx710b DOUBLE,
  temperatura_ds18b20 DOUBLE,
  chave_fim_de_curso BOOLEAN,
  vibracao_vib_x DOUBLE,
  vibracao_vib_y DOUBLE,
  vibracao_vib_z DOUBLE,
  velocidade_m_s DOUBLE,
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
