@echo off

REM Navegar al directorio frontend, ejecutar npm y volver
cd frontend
call npm install
call npm run build
cd ..

REM Navegar al directorio backend, inicializar y aplicar Terraform
cd backend
call terraform init
call terraform apply -auto-approve
cd ..
