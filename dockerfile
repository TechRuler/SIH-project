# ----- Build stage (Node) -------------------------------------------------
FROM node:20-alpine AS react-build

# Set working directory
WORKDIR /app

# Copy only the files needed to install the frontend deps
COPY package*.json ./
RUN npm ci                     # install exact versions from package-lock.json

# Copy the React source (Include vite.config.js/webpack.config.js if you use them)
COPY src/ ./src/
COPY public/ ./public/
# COPY vite.config.js ./     # Uncomment if using Vite

# Build the production bundle into `dist/`
RUN npm run build

# ----- Runtime stage (Python) --------------------------------------------
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy Python requirements and install them as root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set a non-root user (good practice on Render/Heroku)
RUN adduser --uid 1000 --disabled-password --gecos "" appuser
USER appuser

# Copy the built React assets from the previous stage
COPY --from=react-build --chown=appuser:appuser /app/dist ./dist

# Copy the rest of the backend code
# (Assuming your new Flask script is named app.py)
COPY --chown=appuser:appuser *.py ./
COPY --chown=appuser:appuser data/ ./data/

# Expose the port Render will use
EXPOSE 8000
ENV PORT=8000

# Start the server using Gunicorn (Best practice for Flask)
# Alternatively, use CMD ["python", "app.py"] for the built-in development server
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:8000"]