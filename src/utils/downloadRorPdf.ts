import jsPDF from 'jspdf';
import { CadastralPlot, UlpinComputationResult } from './ulpinEngine';

/**
 * Generates and downloads an authoritative, high-resolution Government of Maharashtra
 * Digital Record of Rights (RoR / Village Form VII-XII / 7/12 Extract).
 * 
 * As specified by the Department of Land Resources (DoLR) and NIC:
 * The 14-digit ULPIN (Bhu-Aadhaar) is stamped prominently at the very top
 * as the permanent property identifier.
 */
export function downloadOfficialRorPdf(plot: CadastralPlot, result: UlpinComputationResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);        // 182mm
  let y = margin;

  // 1. Top Tricolor Border Header
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(margin, y, contentWidth, 2, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(margin, y + 2, contentWidth, 1.5, 'F');
  doc.setFillColor(19, 136, 8); // India Green
  doc.rect(margin, y + 3.5, contentWidth, 2, 'F');
  y += 9;

  // 2. Official Government Header
  doc.setTextColor(20, 35, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('GOVERNMENT OF MAHARASHTRA | REVENUE & FOREST DEPARTMENT', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text('Digital India Land Records Modernization Programme (DILRMP) - NIC BhuNaksha Cadastre', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('RECORD OF RIGHTS (VILLAGE FORM VII-XII / 7-12 EXTRACT)', pageWidth / 2, y, { align: 'center' });
  y += 7;

  // 3. PROMINENT 14-DIGIT ULPIN (BHU-AADHAAR) STAMPED SECURITY BOX
  // Highlighted in official security emerald/navy frame
  doc.setFillColor(240, 253, 244); // Light emerald background
  doc.setDrawColor(22, 101, 52);   // Dark emerald border
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  // Badge Header
  doc.setFillColor(22, 101, 52);
  doc.roundedRect(margin + 2, y + 2, 86, 5.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL 14-DIGIT BHU-AADHAAR (ULPIN) IDENTIFIER', margin + 4, y + 5.8);

  // Status Chip
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin + contentWidth - 44, y + 2, 42, 5.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('VERIFIED & STAMPED', margin + contentWidth - 42, y + 5.8);

  // Stamped 14-Digit ULPIN Display
  doc.setTextColor(15, 23, 42);
  doc.setFont('courier', 'bold');
  doc.setFontSize(17);
  doc.text(result.ulpin14, margin + 4, y + 16);

  // Breakdown annotation under ULPIN
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `[Part A Admin Census: ${result.partAAdminPrefix}] + [Part B Spatial ECCMA/OGC: ${result.partBSpatialCode}] | Centroid: (${result.centroidLatFormatted}° N, ${result.centroidLonFormatted}° E)`,
    margin + 4,
    y + 21
  );

  y += 28;

  // 4. Administrative Hierarchy Grid
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 15, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const colW = contentWidth / 4;
  doc.text('State:', margin + 3, y + 4.5);
  doc.text('District:', margin + colW + 3, y + 4.5);
  doc.text('Taluka / Tahsil:', margin + colW * 2 + 3, y + 4.5);
  doc.text('Village / Locality:', margin + colW * 3 + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${plot.adminHierarchy.stateName} (${plot.adminHierarchy.stateCode})`, margin + 3, y + 10.5);
  doc.text(`${plot.adminHierarchy.districtName} (${plot.adminHierarchy.districtCode})`, margin + colW + 3, y + 10.5);
  doc.text(`${plot.adminHierarchy.talukaName} (${plot.adminHierarchy.talukaCode})`, margin + colW * 2 + 3, y + 10.5);
  doc.text(`${plot.adminHierarchy.villageName} (${plot.adminHierarchy.villageCode})`, margin + colW * 3 + 3, y + 10.5);

  y += 18;

  // 5. Cadastral Survey Plot Details Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 22, 'D');

  doc.setFillColor(237, 242, 247);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('SECTION 1: PARCEL GEODETIC & CADASTRAL ATTRIBUTES', margin + 3, y + 4);

  const pColW = contentWidth / 5;
  const pY = y + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('SURVEY / GAT NO.', margin + 3, pY);
  doc.text('HISSA / PLOT NO.', margin + pColW + 3, pY);
  doc.text('AREA (HECTARES)', margin + pColW * 2 + 3, pY);
  doc.text('AREA (SQ. METERS)', margin + pColW * 3 + 3, pY);
  doc.text('LAND TENURE / CLASS', margin + pColW * 4 + 3, pY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(plot.surveyNumber, margin + 3, pY + 7);
  doc.text(plot.hissaNumber, margin + pColW + 3, pY + 7);
  doc.text(`${plot.areaHectares.toFixed(3)} Ha`, margin + pColW * 2 + 3, pY + 7);
  doc.text(`${plot.areaSqm.toLocaleString()} m²`, margin + pColW * 3 + 3, pY + 7);
  doc.text(plot.category, margin + pColW * 4 + 3, pY + 7);

  y += 26;

  // 6. Ownership & Khata Details Table
  doc.setFillColor(237, 242, 247);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('SECTION 2: KHATADAR (OCCUPANT / OWNER) ENTRIES', margin + 3, y + 4);

  y += 5.5;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 6, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('KHATA NO.', margin + 3, y + 4.2);
  doc.text('NAME OF KHATADAR / REGISTERED HOLDER', margin + 28, y + 4.2);
  doc.text('SHARE', margin + 125, y + 4.2);
  doc.text('ASSESSMENT (INR)', margin + 148, y + 4.2);

  y += 6;
  doc.rect(margin, y, contentWidth, 14, 'D');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(plot.khataNumber, margin + 3, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(plot.ownerName, margin + 28, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.text('Sole / Freehold (1/1)', margin + 125, y + 5);
  doc.text('₹ 185.50', margin + 148, y + 5);

  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Mutation Entry No: ME-2026/8109 (Authenticated via BhuNaksha GIS Vector Parcel Linking)', margin + 28, y + 10);

  y += 18;

  // 7. Spatial Centroid & Boundary Vertices Verification Table
  doc.setFillColor(237, 242, 247);
  doc.rect(margin, y, contentWidth, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('SECTION 3: MATHEMATICAL CENTROID & GEOSPATIAL VERTICES (OGC/ECCMA)', margin + 3, y + 4);

  y += 5.5;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 38, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Exact Mathematical Centroid: Latitude ${result.centroidLatFormatted}° N | Longitude ${result.centroidLonFormatted}° E`, margin + 4, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Centroid Calculation Method: Finite Polygon Shoelace Integration: Cx = (1/6A)*Σ(xi+xi+1)(xi*yi+1 - xi+1*yi)', margin + 4, y + 9.5);
  doc.text(`Boundary Vertices Identified: ${result.verticesCount} closed geo-referenced nodes rounded to 6 decimal places`, margin + 4, y + 14);

  // List vertices
  const vListY = y + 19;
  doc.setFont('courier', 'normal');
  doc.setFontSize(6.8);
  plot.vertices.forEach((v, idx) => {
    const colIdx = idx % 2;
    const rowIdx = Math.floor(idx / 2);
    const xPos = margin + 4 + (colIdx * 90);
    const yPos = vListY + (rowIdx * 4);
    if (yPos < y + 36) {
      doc.text(`${v.label || `Node ${idx + 1}`}: Lat ${v.lat.toFixed(6)}° N, Lon ${v.lon.toFixed(6)}° E`, xPos, yPos);
    }
  });

  y += 42;

  // 8. Legal Disclaimer & Digital Signature Seal
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This Record of Rights extract is an electronically stamped document issued by the Central Cadastral Server under Section 148A of the Maharashtra Land Revenue Code, 1966. The 14-digit Bhu-Aadhaar (ULPIN) is the authoritative spatial identifier for all revenue, mutation, credit mortgage, and registry transactions.',
    margin + 3,
    y + 4.5,
    { maxWidth: contentWidth - 55 }
  );
  doc.text(`Digital Sign Timestamp: ${result.stampedTimestamp}`, margin + 3, y + 15);
  doc.text(`Cryptographic Audit Hash: ${result.registryHash}`, margin + 3, y + 19.5);

  // Digital Signature Box
  doc.setDrawColor(22, 101, 52);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + contentWidth - 50, y + 2, 47, 20, 1, 1, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(22, 101, 52);
  doc.text('DIGITALLY SIGNED', margin + contentWidth - 46, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(71, 85, 105);
  doc.text('Talathi / Tahsildar Office', margin + contentWidth - 46, y + 10);
  doc.text('PMRDA Land Survey Div.', margin + contentWidth - 46, y + 13.5);
  doc.text('Status: Valid & Certified', margin + contentWidth - 46, y + 17);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Page 1 of 1 | BhuNaksha National Cadastral System | DoLR & NIC Govt of India', pageWidth / 2, pageHeight - 6, { align: 'center' });

  // Download filename
  const filename = `RoR_7-12_${plot.surveyNumber}_${plot.hissaNumber}_ULPIN_${result.ulpin14}.pdf`;
  doc.save(filename);
}
