@echo off
echo Setting up E2E testing environment...

if not exist "angular-app" (
    echo Cloning Angular application...
    git clone https://github.com/Abhijit5815/demoAppAngular.git angular-app
) else (
    echo Angular app already exists, pulling latest changes...
    cd angular-app && git pull && cd ..
)

if not exist "playwright-report" mkdir playwright-report
if not exist "test-results" mkdir test-results

echo Setup complete!
