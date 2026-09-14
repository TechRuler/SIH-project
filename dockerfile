# ----- Build stage (Node) -------------------------------------------------
FROM node:20-alpine AS react-build

# Install pnpm (optional) or use npm – works out‑of‑the‑box
WORKDIR /app

# Copy only the files needed to install the frontend deps
COPY package*.json ./
RUN npm ci                     # install exact versions from package-lock.json

# Copy the React source
COPY src/ ./src/
COPY public/ ./public/

# Build the production bundle into `dist/`
RUN npm run build

# ----- Runtime stage (Python) --------------------------------------------
FROM python:3.11-slim

# Set a non‑root user (good practice on Render)
RUN adduser --uid 1000 --disabled-password --gecos "" appuser
WORKDIR /app
USER appuser

# Copy Python requirements (add a `requirements.txt` if you don't have one)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built React assets from the previous stage
COPY --from=react-build /app/dist ./dist

# Copy the rest of the backend code
COPY *.py ./
COPY scripts/ ./scripts/
COPY data/ ./data/

# Expose the port Render will use (default 10000, but we keep 8000)
EXPOSE 8000

# Start the server (Render will set $PORT at runtime)
ENV PORT=8000
CMD ["python", "main.py"]
