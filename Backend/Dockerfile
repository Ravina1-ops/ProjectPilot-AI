# Step 1: Python environment setup
FROM python:3.10-slim

# Step 2: Set directory inside container
WORKDIR /app

# Step 3: Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install httpx python-dotenv pydantic uvicorn fastapi

# Step 4: Copy all files
COPY . .

# Step 5: Run the application on Port 8000
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]