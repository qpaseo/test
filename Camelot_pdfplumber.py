import camelot
import pdfplumber
import json

def extract_insurance_pdf(pdf_path):
    """
    보험 약관 PDF에서 텍스트와 표 추출 테스트
    """
    print(f"📄 PDF 파일 처리 중: {pdf_path}\n")
    
    result = {
        "text": "",
        "tables": [],
        "metadata": {}
    }
    
    # 1. 전체 텍스트 추출
    print("1️⃣ 텍스트 추출 중...")
    try:
        with pdfplumber.open(pdf_path) as pdf:
            full_text = []
            for i, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                full_text.append(f"=== 페이지 {i+1} ===\n{page_text}")
            
            result["text"] = "\n\n".join(full_text)
            result["metadata"]["total_pages"] = len(pdf.pages)
            print(f"✅ 총 {len(pdf.pages)}페이지 텍스트 추출 완료\n")
    except Exception as e:
        print(f"❌ 텍스트 추출 실패: {e}\n")
    
    # 2. 표 추출 (lattice 방식 - 선이 있는 표)
    print("2️⃣ 표 추출 중 (lattice 방식)...")
    try:
        tables = camelot.read_pdf(pdf_path, pages='all', flavor='lattice')
        print(f"   찾은 표 개수: {len(tables)}")
        
        # lattice로 못 찾으면 stream 방식 시도
        if len(tables) == 0:
            print("   → lattice 실패, stream 방식 재시도...")
            tables = camelot.read_pdf(pdf_path, pages='all', flavor='stream')
            print(f"   찾은 표 개수: {len(tables)}")
        
        for i, table in enumerate(tables):
            table_data = {
                "table_id": i + 1,
                "page": table.page,
                "accuracy": round(table.accuracy, 2),
                "data": table.df.to_dict('records'),
                "markdown": table.df.to_markdown(index=False)
            }
            result["tables"].append(table_data)
            
            print(f"\n   📊 표 {i+1} (페이지 {table.page}, 정확도 {table.accuracy:.1f}%)")
            print(f"   크기: {table.df.shape[0]}행 x {table.df.shape[1]}열")
        
        print(f"\n✅ 총 {len(tables)}개 표 추출 완료\n")
    except Exception as e:
        print(f"❌ 표 추출 실패: {e}\n")
    
    return result

def save_results(result, output_path="output.json"):
    """결과를 JSON 파일로 저장"""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"💾 결과 저장 완료: {output_path}")

def print_preview(result):
    """결과 미리보기"""
    print("\n" + "="*60)
    print("📋 추출 결과 미리보기")
    print("="*60)
    
    # 텍스트 미리보기 (처음 500자)
    print("\n📝 텍스트 미리보기:")
    print("-" * 60)
    print(result["text"][:500] + "..." if len(result["text"]) > 500 else result["text"])
    
    # 표 미리보기
    if result["tables"]:
        print("\n\n📊 표 미리보기:")
        print("-" * 60)
        for table in result["tables"][:2]:  # 처음 2개 표만
            print(f"\n표 {table['table_id']} (페이지 {table['page']}):")
            print(table["markdown"][:500])
    else:
        print("\n⚠️ 추출된 표가 없습니다.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    # ⬇️ 여기에 PDF 파일 경로 입력
    PDF_PATH = "./1.pdf"  # 본인의 PDF 파일명으로 변경
    
    # PDF 처리
    result = extract_insurance_pdf(PDF_PATH)
    
    # 결과 저장
    save_results(result, "camelot_pdfplumber.json")
    
    # 미리보기 출력
    print_preview(result)
    
    print("\n✨ 완료! camelot_pdfplumber.json 파일을 확인하세요.")