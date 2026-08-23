from typing import Dict, Any

def generate_bonafide_certificate_html(cert_data: Dict[str, Any]) -> str:
    """
    Generates an HTML/CSS document payload matching the EXACT official SOA ITER
    Fee Structure & Bonafide Certificate template (Institute of Technical Education & Research).
    """
    cert_id = cert_data.get("cert_id", "ITER/SOA/219")
    student_name = cert_data.get("student_name", "Kaushal Raj Gupta")
    father_name = cert_data.get("father_name", "Rajesh Sharma")
    student_reg_no = cert_data.get("student_reg_no", "23CSE042")
    department = cert_data.get("department", "Computer Science and Engineering")
    academic_year = cert_data.get("academic_year", "2nd year")
    purpose = cert_data.get("purpose", "Jharkhand State e-Kalyan Scholarship / Passport Application")
    qr_code = cert_data.get("qr_verification_code", "QR-SOA-ITER-2026-219")
    issued_date = cert_data.get("issued_date", "27.01.2026")

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>SOA ITER Certificate - {cert_id}</title>
    <style>
        @page {{
            size: A4;
            margin: 0;
        }}
        body {{
            font-family: 'Times New Roman', Times, serif;
            background-color: #f1f5f9;
            padding: 20px;
            margin: 0;
            color: #000000;
        }}
        .certificate-sheet {{
            background: #fffdf9;
            width: 780px;
            margin: 0 auto;
            border: 1px solid #cbd5e1;
            padding: 35px 45px 25px 45px;
            position: relative;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            box-sizing: border-box;
        }}

        /* Central Red Seal Watermark */
        .watermark-seal {{
            position: absolute;
            top: 48%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            height: 320px;
            border: 8px double rgba(153, 0, 0, 0.08);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-family: 'Times New Roman', serif;
            font-size: 20px;
            font-weight: bold;
            color: rgba(153, 0, 0, 0.08);
            pointer-events: none;
            user-select: none;
            z-index: 1;
        }}
        .watermark-inner {{
            border: 2px dashed rgba(153, 0, 0, 0.08);
            border-radius: 50%;
            width: 280px;
            height: 280px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10px;
        }}

        /* Header Layout */
        .header-table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
            position: relative;
            z-index: 2;
        }}
        .logo-cell {{
            width: 75px;
            vertical-align: top;
        }}
        .logo-circle {{
            width: 65px;
            height: 65px;
            border-radius: 50%;
            border: 2px solid #990000;
            background: #990000;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            font-weight: bold;
            text-align: center;
            line-height: 1.1;
        }}
        .header-center {{
            text-align: center;
            vertical-align: top;
        }}
        .univ-name {{
            font-size: 26px;
            font-weight: 900;
            color: #990000;
            margin: 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }}
        .univ-sub {{
            font-size: 11.5px;
            font-weight: bold;
            color: #1e293b;
            margin-top: 3px;
        }}
        .ref-date-cell {{
            width: 180px;
            vertical-align: top;
            text-align: right;
            font-size: 13px;
            font-weight: bold;
            line-height: 1.6;
        }}

        /* Title Block */
        .title-block {{
            border-top: 2px solid #000000;
            border-bottom: 2px solid #000000;
            text-align: center;
            padding: 6px 0;
            margin: 15px 0 20px 0;
            position: relative;
            z-index: 2;
        }}
        .cert-title {{
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 1px;
            margin: 0;
            text-transform: uppercase;
        }}
        .cert-subtitle {{
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-top: 2px;
            text-transform: uppercase;
        }}

        /* Body Wording */
        .body-text {{
            font-size: 13.5px;
            line-height: 1.8;
            text-align: justify;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
        }}
        .fill-text {{
            font-weight: bold;
            font-size: 14px;
        }}

        /* Fee Breakdown Section */
        .expenditure-intro {{
            font-size: 13px;
            margin-bottom: 12px;
            position: relative;
            z-index: 2;
        }}
        .fee-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
            line-height: 1.5;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
        }}
        .fee-table td {{
            padding: 2px 0;
        }}
        .fee-label {{
            font-weight: bold;
        }}
        .fee-dots {{
            text-align: center;
            width: 30px;
        }}
        .fee-val {{
            text-align: right;
            font-weight: bold;
            width: 120px;
        }}
        .fee-sub-table {{
            width: 100%;
            margin-left: 0;
            font-size: 12px;
        }}
        .fee-sub-table td {{
            padding: 1px 0;
        }}

        /* Footer Section */
        .nb-note {{
            font-size: 11.5px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 15px;
            position: relative;
            z-index: 2;
        }}
        .footer-signatures {{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 15px;
            position: relative;
            z-index: 2;
        }}
        .round-stamp {{
            width: 100px;
            height: 100px;
            border: 2px solid #1e3a8a;
            border-radius: 50%;
            color: #1e3a8a;
            font-size: 8px;
            font-weight: bold;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            line-height: 1.1;
            padding: 4px;
            box-sizing: border-box;
            transform: rotate(-10deg);
        }}
        .dean-signature {{
            text-align: center;
            color: #1e1b4b;
        }}
        .sig-image {{
            font-family: 'Brush Script MT', cursive;
            font-size: 24px;
            color: #1e3a8a;
            font-weight: bold;
            line-height: 1;
        }}
        .dean-title {{
            font-size: 13px;
            font-weight: 900;
            margin: 2px 0 0 0;
            text-transform: uppercase;
        }}
        .dean-dept {{
            font-size: 10px;
            font-weight: bold;
            margin: 0;
            line-height: 1.2;
        }}

        /* Page Footer Address Banner */
        .bottom-banner {{
            border-top: 2px solid #000000;
            padding-top: 8px;
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            line-height: 1.3;
            position: relative;
            z-index: 2;
        }}
        .banner-heading {{
            font-size: 13px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0;
        }}
        .banner-subheading {{
            font-size: 11px;
            font-weight: bold;
            margin: 1px 0;
        }}
    </style>
</head>
<body>
    <div class="certificate-sheet">
        <!-- Central Red Watermark Seal -->
        <div class="watermark-seal">
            <div class="watermark-inner">
                <div>SIKSHA 'O' ANUSANDHAN</div>
                <div style="font-size:12px; margin:4px 0;">(DEEMED TO BE UNIVERSITY)</div>
                <div style="font-size:10px;">BHUBANESWAR, ODISHA</div>
            </div>
        </div>

        <!-- Header Table -->
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    <div class="logo-circle">
                        <span>SIKSHA 'O'</span>
                        <span>ANUSANDHAN</span>
                    </div>
                </td>
                <td class="header-center">
                    <h1 class="univ-name">SIKSHA 'O' ANUSANDHAN</h1>
                    <div class="univ-sub">(A Deemed to be University declared u/s 3 of UGC Act, 1956)</div>
                    <div class="univ-sub">Accredited (3rd Cycle) by NAAC with A++ Grade</div>
                </td>
                <td class="ref-date-cell">
                    <div>Ref: <strong>{cert_id}</strong></div>
                    <div>Date: <strong>{issued_date}</strong></div>
                </td>
            </tr>
        </table>

        <!-- Title Block -->
        <div class="title-block">
            <h2 class="cert-title">FEE STRUCTURE CERTIFICATE</h2>
            <div class="cert-subtitle">FOR B. TECH. PROGRAMME 2024 - 2028 BATCH</div>
        </div>

        <!-- Body Text -->
        <div class="body-text">
            This is to certify that Mr./Ms. <span class="fill-text">{student_name}</span> S/D/o <span class="fill-text">{father_name}</span> bearing Registration No <span class="fill-text">{student_reg_no}</span> is a bonafide student of Faculty of Engineering and Technology (Institute of Technical Education & Research), Siksha 'O' Anusandhan Deemed to be University and studying in <span class="fill-text">{academic_year}</span> in <span class="fill-text">B. Tech. – {department}</span> branch during the academic session 2025-2026. This certificate is issued for applying <span class="fill-text">{purpose}</span>.
        </div>

        <!-- Fee Expenditure Breakdown -->
        <div class="expenditure-intro">
            Year-wise expenditure for his/her studies in four year (2024-2028) B. Tech. Programme is given below:
        </div>

        <table class="fee-table">
            <tr>
                <td class="fee-label">2nd Year Annual course fee</td>
                <td class="fee-dots">:</td>
                <td class="fee-val">Rs. 2,75,000/-</td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top:6px;">
                    <div class="fee-label" style="text-decoration:underline;">Transportation Fees (Optional)</div>
                    <table class="fee-sub-table">
                        <tr>
                            <td>For day scholars (per Annum) – For Bhubaneswar</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 25,000/-</td>
                        </tr>
                        <tr>
                            <td>For day scholars (per Annum) – For Khordha</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 30,000/-</td>
                        </tr>
                        <tr>
                            <td>For day scholars (per Annum) – For Cuttack</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 35,000/-</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top:6px;">
                    <div class="fee-label" style="text-decoration:underline;">Hostel Fees (Optional) Per Year</div>
                    <table class="fee-sub-table">
                        <tr>
                            <td>Boarding Charges (A.C. Room – 2 Occupancy)</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 1,25,000/-</td>
                        </tr>
                        <tr>
                            <td>Boarding Charges (A.C. Room – 3 Occupancy)</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 95,000/-</td>
                        </tr>
                        <tr>
                            <td>Boarding Charges (A.C. Room – 4 Occupancy)</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 85,000/-</td>
                        </tr>
                        <tr>
                            <td>Boarding Charges (Non A.C. Room)</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 55,000/-</td>
                        </tr>
                        <tr>
                            <td>Caution Money (One Time and Refundable)</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 5,000/-</td>
                        </tr>
                        <tr>
                            <td>Messing Charge – Extra (per year) Approx</td>
                            <td class="fee-dots">:</td>
                            <td class="fee-val">Rs. 45,000/-</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top:6px;">
                    <div class="fee-label">Fees for:</div>
                    <div style="font-weight:bold; padding-left:10px;">
                        3<sup>rd</sup> Year Annual course fee – Rs. 2,75,000/-<br>
                        4<sup>th</sup> Year Annual course fee – Rs. 2,75,000/-
                    </div>
                </td>
            </tr>
        </table>

        <!-- Signatures & Seals -->
        <div class="footer-signatures">
            <div style="display:flex; align-items:flex-end; gap:15px;">
                <div class="round-stamp">
                    <div>FACULTY OF ENGG. & TECH.</div>
                    <div style="font-size:7px; font-weight:normal; margin:2px 0;">(ITER)</div>
                    <div>SIKSHA 'O' ANUSANDHAN</div>
                    <div style="font-size:6.5px; font-weight:normal;">Bhubaneswar</div>
                </div>

                <!-- Embedded Verification QR Stamp -->
                <div style="border:1px solid #cbd5e1; padding:6px; background:#fff; text-align:center; border-radius:6px;">
                    <div style="font-size:24px; line-height:1;">📱 [QR]</div>
                    <div style="font-family:monospace; font-size:8px; font-weight:bold; color:#475569;">{qr_code}</div>
                    <div style="font-size:7.5px; color:#64748b;">Verify at soa.ac.in/verify</div>
                </div>
            </div>

            <div class="dean-signature">
                <div class="sig-image">Pas</div>
                <div style="font-size:9px; color:#475569;">27.01.2026</div>
                <h4 class="dean-title">DEAN</h4>
                <div class="dean-dept">Faculty of Engg. & Tech., ITER</div>
                <div class="dean-dept">SIKSHA 'O' ANUSANDHAN</div>
                <div class="dean-dept">(Deemed to be University)</div>
            </div>
        </div>

        <div class="nb-note">
            NB: All payment should be made in shape of DD in favour of SIKSHA 'O' ANUSANDHAN
        </div>

        <!-- Bottom Page Banner -->
        <div class="bottom-banner">
            <h3 class="banner-heading">FACULTY OF ENGINEERING & TECHNOLOGY</h3>
            <div class="banner-subheading">Institute of Technical Education & Research</div>
            <div>Jagamohan Nagar, Khandagiri, Bhubaneswar-751030, Odisha, India</div>
            <div>Tel: 0674-2350181, 2351539, 2351777, Fax: 0674-2351880, 2351217 | www.soa.ac.in</div>
        </div>
    </div>
</body>
</html>
    """
    return html_content
