FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files
COPY package.json package*.json ./

# Install dependencies
RUN npm install

# Copy test files and configuration
COPY . .

# Install browsers if needed
RUN npx playwright install

# Default command
CMD ["npm", "run", "pageObjects-chrome"]
