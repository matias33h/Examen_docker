# Use the official MySQL image as the base image
FROM mysql:5.7

# Set environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=root
# When the container starts, this SQL script will run to create the 'perfiles' table
ADD create_table.sql /docker-entrypoint-initdb.d

# Expose the default MySQL port
EXPOSE 3306
