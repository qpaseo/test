파이썬 가상환경 설정

# 1. 가상환경 생성

python3.11 -m venv pdf_env

# 2. 가상환경 활성화 [O]

source pdf_env/bin/activate

# 3. 라이브러리 설치

pip install camelot-py pdfplumber opencv-python pandas
pip install PyMuPDF

# 4. Python 스크립트 실행 

python test_pdf.py

# 5. 작업 끝나면 비활성화 [O]

deactivate
