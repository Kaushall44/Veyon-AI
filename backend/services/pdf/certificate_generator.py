import io
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether
)
from reportlab.pdfgen import canvas

def draw_watermark_and_background(canvas_obj: canvas.Canvas, doc):
    """Draws background watermark matching the official SOA ITER physical certificate."""
    canvas_obj.saveState()
    
    # Page dimensions
    page_w, page_h = A4
    
    # Draw faint circular watermark in center
    canvas_obj.setFont("Helvetica-Bold", 20)
    canvas_obj.setFillColor(colors.HexColor("#991B1B"), alpha=0.06)
    
    canvas_obj.translate(page_w / 2.0, page_h / 2.0)
    canvas_obj.rotate(-15)
    
    # Watermark circles
    canvas_obj.setStrokeColor(colors.HexColor("#991B1B"), alpha=0.06)
    canvas_obj.setLineWidth(5)
    canvas_obj.circle(0, 0, 140)
    canvas_obj.setLineWidth(1.5)
    canvas_obj.circle(0, 0, 125)
    
    # Watermark text
    canvas_obj.drawCentredString(0, 20, "SIKSHA 'O' ANUSANDHAN")
    canvas_obj.setFont("Helvetica-Bold", 12)
    canvas_obj.drawCentredString(0, -10, "(DEEMED TO BE UNIVERSITY)")
    canvas_obj.setFont("Helvetica-Bold", 10)
    canvas_obj.drawCentredString(0, -30, "BHUBANESWAR, ODISHA")
    
    canvas_obj.restoreState()

def generate_bonafide_pdf(cert_data: Dict[str, Any]) -> bytes:
    """
    Generates a pixel-perfect, official binary PDF for the SOA ITER Fee Structure
    & Bonafide Certificate using ReportLab.
    """
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=28,
        bottomMargin=28
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    body_style = ParagraphStyle(
        'CertBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=13.5,
        alignment=4,  # Justified
        textColor=colors.HexColor("#111827")
    )
    
    header_univ_style = ParagraphStyle(
        'UnivHeader',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=18,
        leading=20,
        alignment=1,  # Centered
        textColor=colors.HexColor("#111827")
    )
    
    header_sub_style = ParagraphStyle(
        'UnivSub',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.5,
        leading=11,
        alignment=1,
        textColor=colors.HexColor("#1F2937")
    )
    
    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=12,
        leading=14,
        alignment=1,
        textColor=colors.black
    )
    
    title_sub_style = ParagraphStyle(
        'CertTitleSub',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=9,
        leading=11,
        alignment=1,
        textColor=colors.black
    )
    
    table_text_style = ParagraphStyle(
        'TableText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#111827")
    )
    
    table_bold_style = ParagraphStyle(
        'TableBold',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#111827")
    )

    story = []
    
    cert_id = cert_data.get("cert_id", "ITER/SOA/219")
    student_name = cert_data.get("student_name", "Kaushal Raj Gupta")
    father_name = cert_data.get("father_name", "Rajesh Sharma")
    student_reg_no = cert_data.get("student_reg_no", "24E042")
    branch = cert_data.get("branch", "Computer Science and Engineering")
    academic_year = cert_data.get("academic_year", "2nd")
    academic_session = cert_data.get("academic_session", "2025-2026")
    batch = cert_data.get("batch", "2024 - 2025")
    purpose = cert_data.get("purpose", "Jharkhand state e Kalyan Scholarship")
    issued_date = cert_data.get("issued_date", "27.01.2026")
    annual_fee = cert_data.get("annual_fee", "Rs. 2, 75,000/-")

    # 1. Header Table (Logo + University Title + Ref/Date)
    # Emblem representation text
    logo_para = Paragraph(
        '<font color="#E11D48" size="14"><b>●</b></font><br/>'
        '<font size="6" color="#991B1B"><b>SIKSHA &apos;O&apos;<br/>ANUSANDHAN</b></font>',
        ParagraphStyle('LogoP', alignment=1, leading=7)
    )
    
    univ_para = Paragraph(
        '<b>SIKSHA <font color="#E11D48">&apos;O&apos;</font> ANUSANDHAN</b><br/>'
        '<font size="8">(A Deemed to be University declared u/s 3 of UGC Act, 1956)</font><br/>'
        '<font size="8"><b>Accredited (3rd Cycle) by NAAC with A++ Grade</b></font>',
        header_univ_style
    )
    
    ref_date_para = Paragraph(
        f'<b>Ref: <u>{cert_id}</u></b><br/>'
        f'<b>Date: <u>{issued_date}</u></b>',
        ParagraphStyle('RefDateP', fontName='Times-Bold', fontSize=8.5, leading=12, alignment=2)
    )
    
    header_table = Table(
        [[logo_para, univ_para, ref_date_para]],
        colWidths=[65, 360, 95]
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, 0), 'CENTER'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 6))

    # 2. Title Block with Top & Bottom Rules
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=2, spaceAfter=4))
    story.append(Paragraph("FEE STRUCTURE CERTIFICATE", title_style))
    story.append(Paragraph(f"FOR B. TECH. PROGRAMME {batch} BATCH", title_sub_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=4, spaceAfter=8))

    # 3. Body Text
    body_html = (
        f"This is to certify that Mr./Ms. <b>{student_name}</b> S/D/o <b>{father_name}</b> bearing "
        f"Registration No <b>{student_reg_no}</b> is a bonafide student of Faculty of Engineering "
        f"and Technology (Institute of Technical Education &amp; Research), Siksha &apos;O&apos; Anusandhan "
        f"Deemed to be University and studying in <b>{academic_year}</b> year in <b>B. Tech. – {branch}</b> "
        f"branch during the academic session <b>{academic_session}</b>. This certificate is issued for "
        f"applying <b>{purpose}</b>.<br/><br/>"
        f"Year-wise expenditure for his/her studies in four year(2024-2028) B. Tech. Programme is given below."
    )
    story.append(Paragraph(body_html, body_style))
    story.append(Spacer(1, 6))

    # 4. Expenditure Breakdown Table
    fee_rows = [
        [
            Paragraph(f"<b>{academic_year} Year Annual course fee</b>", table_bold_style),
            Paragraph(":", table_bold_style),
            Paragraph(f"<b>{annual_fee}</b>", ParagraphStyle('R', parent=table_bold_style, alignment=2))
        ],
        [
            Paragraph("<u><b>Transportation Fees (Optional)</b></u>", table_bold_style),
            "",
            ""
        ],
        [
            Paragraph("&nbsp;&nbsp;For day scholars (per Annum) – For Bhubaneswar", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 25,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;For day scholars (per Annum) – For Khordha", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 30,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;For day scholars (per Annum) – For Cuttack", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 35,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("<u><b>Hostel Fees (Optional) Per Year</b></u>", table_bold_style),
            "",
            ""
        ],
        [
            Paragraph("&nbsp;&nbsp;Boarding Charges (A.C. Room – 2 Occupancy)", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 1,25,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;Boarding Charges (A.C. Room – 3 Occupancy)", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 95,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;Boarding Charges (A.C. Room – 4 Occupancy)", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 85,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;Boarding Charges (Non A.C. Room)", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 55,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;Caution Money (One Time and refundable)", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 5,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;Messing Charge – Extra (per year) Approx", table_text_style),
            Paragraph(":", table_text_style),
            Paragraph("Rs. 45,000/-", ParagraphStyle('R', parent=table_text_style, alignment=2))
        ],
        [
            Paragraph("<u><b>Fees for:</b></u>", table_bold_style),
            "",
            ""
        ],
        [
            Paragraph("&nbsp;&nbsp;3<sup>rd</sup> Year Annual course fee", table_bold_style),
            Paragraph("–", table_bold_style),
            Paragraph("Rs. 2, 75,000/-", ParagraphStyle('R', parent=table_bold_style, alignment=2))
        ],
        [
            Paragraph("&nbsp;&nbsp;4<sup>th</sup> Year Annual course fee", table_bold_style),
            Paragraph("–", table_bold_style),
            Paragraph("Rs. 2, 75,000/-", ParagraphStyle('R', parent=table_bold_style, alignment=2))
        ],
    ]

    fee_table = Table(fee_rows, colWidths=[380, 20, 120])
    fee_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(fee_table)
    story.append(Spacer(1, 10))

    # 5. Seals & Signature Section
    seal_para = Paragraph(
        '<font color="#1E40AF" size="7"><b>★ FACULTY OF ENGG. &amp; TECH. ★<br/>'
        '<font size="9"><b>ITER</b></font><br/>BHUBANESWAR</b></font>',
        ParagraphStyle('SealP', alignment=1, leading=8)
    )
    
    # Verification QR badge
    qr_code = cert_data.get("qr_verification_code", f"SOA-VERIFY-{cert_id}")
    qr_para = Paragraph(
        f'<font size="6" color="#475569"><b>VERIFICATION QR</b><br/>{qr_code}<br/>soa.ac.in/verify</font>',
        ParagraphStyle('QRP', alignment=1, leading=7)
    )
    
    dean_para = Paragraph(
        '<font color="#1E3A8A" size="14"><i>P. K. Nanda</i></font><br/>'
        '<font size="7" color="#475569">27.01.2026</font><br/>'
        '<b><font size="10" color="#1E3A8A">DEAN</font></b><br/>'
        '<font size="7.5" color="#1E40AF"><b>Faculty of Engg. &amp; Tech., ITER<br/>'
        'SIKSHA &apos;O&apos; ANUSANDHAN<br/>'
        '<font color="#4B5563">(Deemed to be University)</font></b></font>',
        ParagraphStyle('DeanP', alignment=1, leading=8)
    )
    
    sig_table = Table(
        [[seal_para, qr_para, dean_para]],
        colWidths=[160, 160, 200]
    )
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'BOTTOM'),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
    ]))
    story.append(KeepTogether(sig_table))
    story.append(Spacer(1, 6))

    # 6. Payment Note
    story.append(Paragraph(
        "<b><i>NB: All payment should be made in shape of DD in favour of SIKSHA &apos;O&apos; ANUSANDHAN</i></b>",
        ParagraphStyle('NBNote', fontName='Times-BoldItalic', fontSize=8, leading=10, textColor=colors.black)
    ))
    story.append(Spacer(1, 4))

    # 7. Address Footer
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.black, spaceBefore=2, spaceAfter=3))
    footer_text = (
        "<b>FACULTY OF ENGINEERING &amp; TECHNOLOGY</b><br/>"
        "<b>Institute of Technical Education &amp; Research</b><br/>"
        "Jagamohan Nagar, Khandagiri, Bhubaneswar-751030, Odisha, India<br/>"
        "Tel: 0674-2350181, 2351539, 2351777, Fax: 0674-2351880, 2351217 | <b>www.soa.ac.in</b>"
    )
    story.append(Paragraph(footer_text, ParagraphStyle('FooterP', fontName='Helvetica', fontSize=7, leading=8.5, alignment=1, textColor=colors.HexColor("#1F2937"))))

    # Build PDF
    doc.build(story, onFirstPage=draw_watermark_and_background)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes

def generate_bonafide_certificate_html(cert_data: Dict[str, Any]) -> str:
    """HTML Visual Preview Generator."""
    cert_id = cert_data.get("cert_id", "ITER/SOA/219")
    student_name = cert_data.get("student_name", "Kaushal Raj Gupta")
    father_name = cert_data.get("father_name", "Rajesh Sharma")
    student_reg_no = cert_data.get("student_reg_no", "24E042")
    branch = cert_data.get("branch", "Computer Science and Engineering")
    academic_year = cert_data.get("academic_year", "2nd")
    purpose = cert_data.get("purpose", "Jharkhand state e Kalyan Scholarship")
    qr_code = cert_data.get("qr_verification_code", "QR-SOA-ITER-2026-219")
    issued_date = cert_data.get("issued_date", "27.01.2026")
    annual_fee = cert_data.get("annual_fee", "Rs. 2, 75,000/-")

    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SOA ITER Fee Structure Certificate - {cert_id}</title>
    <style>
        body {{ font-family: 'Times New Roman', serif; background: #f8fafc; padding: 20px; color: #111827; }}
        .sheet {{ background: #fffdf9; max-width: 800px; margin: 0 auto; border: 1px solid #cbd5e1; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }}
        h1 {{ color: #111827; text-align: center; text-transform: uppercase; font-size: 24px; margin: 0; }}
        .crimson {{ color: #E11D48; }}
        .header-sub {{ text-align: center; font-size: 11px; font-weight: bold; margin: 2px 0; }}
        .title-box {{ border-top: 2px solid #000; border-bottom: 2px solid #000; text-align: center; padding: 8px 0; margin: 15px 0; }}
        .title-box h2 {{ margin: 0; font-size: 18px; }}
        .body-p {{ font-size: 13px; line-height: 1.6; text-align: justify; }}
        .fee-table {{ width: 100%; border-collapse: collapse; font-size: 12px; margin: 10px 0; }}
        .fee-table td {{ padding: 2px 0; }}
        .footer-banner {{ border-top: 2px solid #000; padding-top: 8px; text-align: center; font-size: 9px; font-family: sans-serif; }}
    </style>
</head>
<body>
    <div class="sheet">
        <h1>SIKSHA <span class="crimson">'O'</span> ANUSANDHAN</h1>
        <div class="header-sub">(A Deemed to be University declared u/s 3 of UGC Act, 1956)</div>
        <div class="header-sub">Accredited (3rd Cycle) by NAAC with A++ Grade</div>
        <div style="text-align:right; font-weight:bold; font-size:12px; margin-top:5px;">
            Ref: {cert_id} &nbsp;|&nbsp; Date: {issued_date}
        </div>
        <div class="title-box">
            <h2>FEE STRUCTURE CERTIFICATE</h2>
            <div style="font-size:11px; font-weight:bold;">FOR B. TECH. PROGRAMME 2024 - 2025 BATCH</div>
        </div>
        <p class="body-p">
            This is to certify that Mr./Ms. <b>{student_name}</b> S/D/o <b>{father_name}</b> bearing Registration No <b>{student_reg_no}</b> is a bonafide student of Faculty of Engineering and Technology (Institute of Technical Education & Research), Siksha 'O' Anusandhan Deemed to be University and studying in <b>{academic_year}</b> year in <b>B. Tech. – {branch}</b> branch during academic session 2025-2026. This certificate is issued for applying <b>{purpose}</b>.
        </p>
        <table class="fee-table">
            <tr><td><b>2nd Year Annual course fee</b></td><td>:</td><td align="right"><b>{annual_fee}</b></td></tr>
            <tr><td colspan="3"><u><b>Transportation Fees (Optional)</b></u></td></tr>
            <tr><td>&nbsp;&nbsp;For day scholars (per Annum) – For Bhubaneswar</td><td>:</td><td align="right">Rs. 25,000/-</td></tr>
            <tr><td>&nbsp;&nbsp;For day scholars (per Annum) – For Khordha</td><td>:</td><td align="right">Rs. 30,000/-</td></tr>
            <tr><td>&nbsp;&nbsp;For day scholars (per Annum) – For Cuttack</td><td>:</td><td align="right">Rs. 35,000/-</td></tr>
            <tr><td colspan="3"><u><b>Hostel Fees (Optional) Per Year</b></u></td></tr>
            <tr><td>&nbsp;&nbsp;Boarding Charges (A.C. Room – 2 Occupancy)</td><td>:</td><td align="right">Rs. 1,25,000/-</td></tr>
            <tr><td>&nbsp;&nbsp;Boarding Charges (A.C. Room – 3 Occupancy)</td><td>:</td><td align="right">Rs. 95,000/-</td></tr>
            <tr><td>&nbsp;&nbsp;Boarding Charges (Non A.C. Room)</td><td>:</td><td align="right">Rs. 55,000/-</td></tr>
            <tr><td colspan="3"><u><b>Fees for:</b></u></td></tr>
            <tr><td>&nbsp;&nbsp;3rd Year Annual course fee</td><td>–</td><td align="right"><b>Rs. 2, 75,000/-</b></td></tr>
            <tr><td>&nbsp;&nbsp;4th Year Annual course fee</td><td>–</td><td align="right"><b>Rs. 2, 75,000/-</b></td></tr>
        </table>
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:20px;">
            <div style="color:#1e40af; font-size:10px; font-weight:bold; border:1.5px dashed #1e40af; padding:8px; border-radius:50%; width:70px; height:70px; display:flex; align-items:center; justify-content:center; text-align:center;">
                ITER<br/>BHUBANESWAR
            </div>
            <div style="text-align:right;">
                <div style="font-size:16px; color:#1e3a8a; font-style:italic;">P. K. Nanda</div>
                <div style="font-weight:bold; font-size:11px; color:#1e3a8a;">DEAN, Faculty of Engg. & Tech., ITER</div>
                <div style="font-size:9px; color:#6b7280;">SIKSHA 'O' ANUSANDHAN</div>
            </div>
        </div>
        <div style="font-weight:bold; font-size:10px; margin-top:15px;">
            NB: All payment should be made in shape of DD in favour of SIKSHA 'O' ANUSANDHAN
        </div>
        <div class="footer-banner" style="margin-top:10px;">
            <b>FACULTY OF ENGINEERING & TECHNOLOGY</b> - Institute of Technical Education & Research<br/>
            Jagamohan Nagar, Khandagiri, Bhubaneswar-751030 | www.soa.ac.in
        </div>
    </div>
</body>
</html>
"""
