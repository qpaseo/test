import fitz  # PyMuPDF
import json
import os
import pandas as pd
from concurrent.futures import ProcessPoolExecutor


# ---------------------------------------------------
# 1. (병렬 처리용) 개별 페이지 분석 함수
# ---------------------------------------------------
def process_page(args):
    pdf_path, page_index = args

    doc = fitz.open(pdf_path)
    page = doc[page_index]

    # -----------------------------
    # A. 텍스트 추출
    # -----------------------------
    text = page.get_text("text")

    # -----------------------------
    # B. 표 구조 추출 (blocks 기반)
    # -----------------------------
    blocks = page.get_text("blocks")

    rows = []
    for b in blocks:
        x0, y0, x1, y1, text_block = b[:5]

        if not text_block.strip():
            continue

        for line in text_block.split("\n"):
            if line.strip():
                rows.append((line.strip(), x0, y1))

    if len(rows) < 3:
        return {
            "page": page_index + 1,
            "text": text,
            "tables": []
        }

    # 열 후보 계산
    rows_sorted = sorted(rows, key=lambda x: (x[2], x[1]))

    col_threshold = 50
    columns = []
    for text, x0, y in rows_sorted:
        placed = False
        for col in columns:
            if abs(col - x0) < col_threshold:
                placed = True
                break
        if not placed:
            columns.append(x0)

    columns = sorted(columns)

    # 표 DataFrame 구성
    df_rows = []
    for text, x0, y in rows_sorted:
        row = [""] * len(columns)
        nearest_col = min(columns, key=lambda c: abs(c - x0))
        col_index = columns.index(nearest_col)
        row[col_index] = text
        df_rows.append(row)

    df = pd.DataFrame(df_rows)

    table_info = []
    if df.shape[0] >= 3:
        accuracy = round(100 - max(0, (len(columns) - 3) * 8), 2)
        table_info.append({
            "table_id": 1,
            "page": page_index + 1,
            "accuracy": accuracy,
            "data": df.to_dict('records'),
            "markdown": df.to_markdown(index=False)
        })

    return {
        "page": page_index + 1,
        "text": text,
        "tables": table_info
    }


# ---------------------------------------------------
# 2. 전체 PDF 병렬 분석 (여기가 메인)
# ---------------------------------------------------
def extract_insurance_pdf_parallel(pdf_path):

    # CPU 코어 자동 감지
    cpu_total = os.cpu_count()
    workers = max(1, cpu_total - 1)

    print(f"🖥️ CPU 총 코어 수: {cpu_total}개")
    print(f"⚙️ 사용 예정 코어 수(병렬 처리): {workers}개\n")

    doc = fitz.open(pdf_path)
    total_pages = len(doc)

    print(f"📄 총 {total_pages} 페이지 PDF 병렬 분석 시작!\n")

    # 병렬 페이지 처리 준비
    page_tasks = [(pdf_path, i) for i in range(total_pages)]

    results = []
    with ProcessPoolExecutor(max_workers=workers) as executor:
        for res in executor.map(process_page, page_tasks):
            results.append(res)

    # 결과 합치기
    results_sorted = sorted(results, key=lambda x: x["page"])

    full_text = "\n\n".join(
        [f"=== 페이지 {r['page']} ===\n{r['text']}" for r in results_sorted]
    )

    all_tables = []
    table_id = 1
    for r in results_sorted:
        for t in r["tables"]:
            t["table_id"] = table_id  # 전역 번호 부여
            table_id += 1
            all_tables.append(t)

    final_result = {
        "metadata": {
            "total_pages": total_pages,
            "cores_total": cpu_total,
            "cores_used": workers
        },
        "text": full_text,
        "tables": all_tables
    }

    return final_result


# ---------------------------------------------------
# 3. 파일 저장 & 프리뷰
# ---------------------------------------------------
def save_results(result, output_path="PyMuPDF_parallel.json"):
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"💾 결과 저장 완료: {output_path}")


def print_preview(result):
    print("\n" + "=" * 60)
    print("📋 병렬 추출 결과 미리보기")
    print("=" * 60)

    print("\n📝 텍스트:")
    print("-" * 60)
    preview = result["text"][:800]
    print(preview + "..." if len(result["text"]) > 800 else preview)

    if result["tables"]:
        print("\n\n📊 표 예시:")
        print("-" * 60)
        print(result["tables"][0]["markdown"])
    else:
        print("⚠️ 표 없음")

    print("=" * 60)


# ---------------------------------------------------
# 4. 실행 구간
# ---------------------------------------------------
if __name__ == "__main__":
    PDF_PATH = "./(무) ABL THE드림종신보험II(해약환급금 일부지급형)2409 1종(간편심사형) 1형 평준형.pdf"

    result = extract_insurance_pdf_parallel(PDF_PATH)
    save_results(result)
    print_preview(result)

    print("\n✨ 병렬 PDF 분석 완료!")