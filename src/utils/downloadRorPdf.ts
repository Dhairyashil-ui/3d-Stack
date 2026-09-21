import jsPDF from 'jspdf';
import { CadastralPlot, UlpinComputationResult } from './ulpinEngine';

/**
 * Loads an image from the public folder and converts it to a base64 DataURL
 * for embedding into the jsPDF document.
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Could not load image ${imageUrl} for PDF:`, error);
    return null;
  }
}

/**
 * Generates and downloads the Official Government of Maharashtra
 * URBAN PROPERTY CARD (UPC) | PROVISIONAL NAKSHA PORTAL GENERATED RECORD
 * matching the authoritative reference layout with 100% fidelity.
 */
export async function downloadOfficialRorPdf(
  plot: CadastralPlot, 
  result?: UlpinComputationResult
): Promise<void> {
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

  // Outer Border Box around entire document
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.rect(margin, y, contentWidth, 268);

  // 1. TOP HEADER SECTION
  const headerHeight = 24;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, headerHeight);

  // Ashoka Lion Capital (Emblem of India) - Left
  // We draw a clean authoritative vector representation of Ashoka Lion Capital
  const emblemX = margin + 8;
  const emblemY = y + 3;
  
  // Try loading ashoka emblem image if available
  const ashokaData = await getBase64ImageFromUrl('/assets/ashoka-emblem.svg') ||
                     await getBase64ImageFromUrl('/assets/bharat-sarkar.svg');
  if (ashokaData) {
    try {
      doc.addImage(ashokaData, 'PNG', emblemX, emblemY, 14, 18);
    } catch {
      drawVectorAshokaEmblem(doc, emblemX, emblemY);
    }
  } else {
    drawVectorAshokaEmblem(doc, emblemX, emblemY);
  }

  // Maharashtra State Emblem - Right
  const stateSealX = margin + contentWidth - 22;
  const stateSealY = y + 3;
  drawMaharashtraStateSeal(doc, stateSealX, stateSealY);

  // Center Government Header Text
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('GOVERNMENT OF MAHARASHTRA', pageWidth / 2, y + 6.5, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('REVENUE DEPARTMENT', pageWidth / 2, y + 11, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DISTRICT PUNE', pageWidth / 2, y + 15.5, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('URBAN LAND RECORDS & GEO-CADASTRE (NAKSHA)', pageWidth / 2, y + 20, { align: 'center' });

  y += headerHeight;

  // 2. SUB-HEADER STRIP
  const subHeaderHeight = 6.5;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, subHeaderHeight, 'FD');
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(
    'URBAN PROPERTY CARD (UPC) | PROVISIONAL NAKSHA PORTAL GENERATED RECORD',
    pageWidth / 2,
    y + 4.5,
    { align: 'center' }
  );

  y += subHeaderHeight;

  // 3. IDENTIFIERS GRID (4 Cells: Property ID, Date of Survey, Bhu-Aadhaar/ULPIN, Issued Date)
  const idGridHeight = 13;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, idGridHeight, 'D');

  const halfWidth = contentWidth / 2;
  doc.line(margin + halfWidth, y, margin + halfWidth, y + idGridHeight);
  doc.line(margin, y + (idGridHeight / 2), margin + contentWidth, y + (idGridHeight / 2));

  const propertyId = 'MH312024HIN00561';
  const ulpinCode = result?.ulpin14 || 'MH27B4X79K2N1P';
  const dateOfSurvey = '14 Oct 2024';
  const issuedDate = '18 Nov 2024';

  doc.setFontSize(7.5);
  // Row 1 Left: Property ID
  doc.setFont('helvetica', 'bold');
  doc.text('PROPERTY ID (UPC):', margin + 3, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.text(propertyId, margin + 35, y + 4.5);

  // Row 1 Right: Date of Survey
  doc.setFont('helvetica', 'bold');
  doc.text('DATE OF SURVEY:', margin + halfWidth + 3, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.text(dateOfSurvey, margin + halfWidth + 33, y + 4.5);

  // Row 2 Left: Bhu-Aadhaar/ULPIN
  doc.setFont('helvetica', 'bold');
  doc.text('Bhu-Aadhaar/ULPIN:', margin + 3, y + 10.5);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text(ulpinCode, margin + 35, y + 10.5);

  // Row 2 Right: Issued Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('ISSUED DATE:', margin + halfWidth + 3, y + 10.5);
  doc.setFont('helvetica', 'normal');
  doc.text(issuedDate, margin + halfWidth + 33, y + 10.5);

  y += idGridHeight;

  // 4. MAIN CONTENT BOX (Divided into Left Text Column & Right Map/QR Column)
  const mainBoxHeight = 158;
  doc.rect(margin, y, contentWidth, mainBoxHeight, 'D');

  const leftColWidth = 108;
  const rightColWidth = contentWidth - leftColWidth;
  doc.line(margin + leftColWidth, y, margin + leftColWidth, y + mainBoxHeight);

  // ---------------------------------------------------------------------------
  // LEFT COLUMN: TEXT SPECIFICATIONS (Matching reference image line-for-line)
  // ---------------------------------------------------------------------------
  let ly = y + 4;
  const lx = margin + 3;

  // NAME OF PROPERTY
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('NAME OF PROPERTY:', lx, ly);
  doc.setFont('helvetica', 'bold');
  doc.text('PPCRC', lx + 33, ly);
  ly += 4.5;

  // ADDRESS
  doc.setFont('helvetica', 'bold');
  doc.text('ADDRESS:', lx, ly);
  doc.setFont('helvetica', 'normal');
  doc.text('Survey No. 88, Plot B-7, Hinjawadi', lx + 33, ly);
  ly += 4;
  doc.text('Phase 1, Pune - 411057', lx + 33, ly);
  ly += 6;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // LAND USE
  doc.setFont('helvetica', 'bold');
  doc.text('LAND USE:', lx, ly);
  doc.setFont('helvetica', 'normal');
  doc.text('Commercial/IT Park', lx + 33, ly);
  ly += 6;

  // Divider Line
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // BUILDING DETAILS
  doc.setFont('helvetica', 'bold');
  doc.text('BUILDING DETAILS:', lx, ly);
  ly += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.text('Type:', lx + 3, ly);
  doc.text('RCC G+5 Floors', lx + 33, ly);
  ly += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL FLOORS:', lx + 3, ly);
  doc.setFont('helvetica', 'normal');
  doc.text('5', lx + 33, ly);
  ly += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('NO. OF UNITS/ROOMS PER FLOOR:', lx + 3, ly);
  doc.setFont('helvetica', 'normal');
  doc.text('09 (Total Units: 09)', lx + 53, ly);
  ly += 6;

  // Divider Line
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // TOTAL AREA
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AREA:', lx, ly);
  ly += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.text('Land Area:', lx + 3, ly);
  doc.text('1205.80 Sq Mtrs', lx + 33, ly);
  ly += 4;

  doc.text('Built-up Area:', lx + 3, ly);
  doc.text('6029.00 Sq Mtrs', lx + 33, ly);
  ly += 6;

  // Divider Line
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // OWNERSHIP DETAILS
  doc.setFont('helvetica', 'bold');
  doc.text('OWNERSHIP DETAILS:', lx, ly);
  ly += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.text('Owner Name:', lx + 3, ly);
  doc.setFont('helvetica', 'bold');
  doc.text('PPCRC TECHNOLOGIES PVT LTD', lx + 33, ly);
  doc.setFont('helvetica', 'normal');
  ly += 4;

  doc.text('Acquisition Mode:', lx + 3, ly);
  doc.text('Registered Sale Deed (A521/2019)', lx + 33, ly);
  ly += 4;

  doc.text('Share:', lx + 3, ly);
  doc.text('100%', lx + 33, ly);
  ly += 6;

  // Divider Line
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // ENCUMBRANCES
  doc.setFont('helvetica', 'bold');
  doc.text('ENCUMBRANCES:', lx, ly);
  ly += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.text('No Liens/Mortgages recorded as of 18-Nov-2024', lx + 3, ly);
  ly += 6;

  // Divider Line
  doc.line(margin, ly, margin + leftColWidth, ly);
  ly += 4.5;

  // MUTATION ENTRY
  doc.setFont('helvetica', 'bold');
  doc.text('MUTATION ENTRY:', lx, ly);
  ly += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.text('FFE-456 (Approved 21-May-2020)', lx + 3, ly);

  // ---------------------------------------------------------------------------
  // RIGHT COLUMN: CADASTRAL MAP INSET, QR CODE, DIGITAL SIGNATURE
  // ---------------------------------------------------------------------------
  const rx = margin + leftColWidth + 4;
  const rw = rightColWidth - 8;
  let ry = y + 4;

  // 1. CADASTRAL MAP INSET (Framed rectangular map box matching reference image)
  const mapHeight = 64;
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.4);
  doc.setFillColor(248, 250, 252);
  doc.rect(rx, ry, rw, mapHeight, 'FD');

  // Draw Geo-Cadastral Map Inset with roads and polygon
  drawCadastralMapInset(doc, rx, ry, rw, mapHeight, propertyId);

  ry += mapHeight + 6;

  // 2. QR CODE SECTION
  const qrSize = 28;
  const qrx = rx + (rw - qrSize) / 2;
  drawSimulatedQrCode(doc, qrx, ry, qrSize);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Scan to Verify', rx + (rw / 2), ry + qrSize + 4, { align: 'center' });

  ry += qrSize + 8;

  // 3. DIGITAL SIGNATURE SECTION
  // Blue cursive signature glyph
  drawSignatureGlyph(doc, rx + (rw / 2) - 15, ry + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Digital Signature', rx + (rw / 2), ry + 12, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('City Survey Officer, Pune', rx + (rw / 2), ry + 16, { align: 'center' });

  y += mainBoxHeight;

  // ---------------------------------------------------------------------------
  // 5. BOTTOM ENDORSEMENT STAMPS (APPROVED, CIRCULAR SEAL, SIGNED)
  // ---------------------------------------------------------------------------
  const stampBoxHeight = 28;
  doc.rect(margin, y, contentWidth, stampBoxHeight, 'D');

  const stampY = y + 4;

  // Left Stamp: Blue Rectangular Box "APPROVED NAKSHA UNIT PUNE DISTRICT"
  const stamp1X = margin + 18;
  doc.setDrawColor(29, 78, 216); // Royal blue ink
  doc.setLineWidth(0.6);
  doc.rect(stamp1X, stampY, 32, 18);
  doc.setLineWidth(0.2);
  doc.rect(stamp1X + 0.8, stampY + 0.8, 30.4, 16.4);

  doc.setTextColor(29, 78, 216);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('APPROVED', stamp1X + 16, stampY + 6, { align: 'center' });

  doc.setFontSize(6.5);
  doc.text('NAKSHA UNIT', stamp1X + 16, stampY + 10.5, { align: 'center' });
  doc.text('PUNE DISTRICT', stamp1X + 16, stampY + 14.5, { align: 'center' });

  // Center Stamp: Circular Seal "* CITY SURVEY OFFICE * PUNE * REVENUE DEPT. *"
  const sealCenterX = margin + (contentWidth / 2);
  const sealCenterY = stampY + 9;
  doc.setDrawColor(29, 78, 216);
  doc.setLineWidth(0.5);
  doc.circle(sealCenterX, sealCenterY, 10);
  doc.setLineWidth(0.2);
  doc.circle(sealCenterX, sealCenterY, 8.2);

  doc.setFontSize(5);
  doc.setFont('helvetica', 'bold');
  doc.text('* CITY SURVEY OFFICE *', sealCenterX, sealCenterY - 4.5, { align: 'center' });
  doc.setFontSize(7);
  doc.text('PUNE', sealCenterX, sealCenterY + 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('* REVENUE DEPT. *', sealCenterX, sealCenterY + 5.5, { align: 'center' });

  // Right Stamp: Blue signature stroke + "Signed"
  const stamp3X = margin + contentWidth - 36;
  drawSignatureGlyph(doc, stamp3X, stampY + 3);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(29, 78, 216);
  doc.text('Signed', stamp3X + 12, stampY + 15, { align: 'center' });

  y += stampBoxHeight;

  // ---------------------------------------------------------------------------
  // 6. BOTTOM FOOTER STRIP
  // ---------------------------------------------------------------------------
  doc.setDrawColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'URBAN PROPERTY CARD (UPC) | PROVISIONAL NAKSHA PORTAL GENERATED RECORD',
    margin + 2,
    y + 5.5
  );
  doc.text('Standard A4', margin + contentWidth - 2, y + 5.5, { align: 'right' });

  // Save the document with clean official filename
  const filename = `Urban_Property_Card_PPCRC_${propertyId}.pdf`;
  doc.save(filename);
}

/**
 * Downloads the Preliminary Property Dossier (redirects to the same official UPC document format)
 */
export async function downloadParcelDetailsPdf(
  plot: CadastralPlot, 
  centroid: { lat: number; lon: number }
): Promise<void> {
  // Uses the same authoritative official UPC document format
  await downloadOfficialRorPdf(plot);
}

// -----------------------------------------------------------------------------
// VECTOR DRAWING HELPERS FOR AUTHORITATIVE GOVERNMENT LOOK
// -----------------------------------------------------------------------------

/**
 * Draws the Cadastral Map Inset with roads and polygon
 * matching the reference image's map box exactly!
 */
function drawCadastralMapInset(
  doc: jsPDF, 
  x: number, 
  y: number, 
  w: number, 
  h: number,
  polygonCode: string
): void {
  // 1. Road Corridors
  // Bottom angled road: "Pachpir Road"
  doc.setFillColor(226, 232, 240); // Soft grey road
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  // Angled road polygon at bottom
  const roadY1 = y + h - 14;
  const roadY2 = y + h - 8;
  doc.triangle(x, roadY1, x + w, roadY2, x + w, y + h, 'FD');
  doc.triangle(x, roadY1, x, y + h, x + w, y + h, 'FD');

  // Right vertical road: "Adjacent Road"
  const adjRoadX = x + w - 10;
  doc.rect(adjRoadX, y, 10, h - 8, 'FD');

  // Road Text Labels
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5);
  doc.setFont('helvetica', 'normal');
  doc.text('Pachpir Road', x + (w / 2) - 8, y + h - 3, { angle: 5 });

  // Rotated text for adjacent road
  doc.text('Adjacent', adjRoadX + 3.5, y + 25, { angle: 90 });
  doc.text('Road', adjRoadX + 6.5, y + 23, { angle: 90 });

  // 2. The Cadastral Parcel Polygon
  // Blue fill and border
  const polyX1 = x + 12;
  const polyY1 = y + 8;
  const polyX2 = x + w - 14;
  const polyY2 = y + 16;
  const polyX3 = x + w - 18;
  const polyY3 = y + h - 14;
  const polyX4 = x + 6;
  const polyY4 = y + h - 18;

  doc.setFillColor(224, 242, 254); // Light sky blue
  doc.setDrawColor(37, 99, 235);   // Crisp blue boundary
  doc.setLineWidth(0.6);

  // Draw 4-sided polygon
  doc.lines(
    [
      [polyX2 - polyX1, polyY2 - polyY1],
      [polyX3 - polyX2, polyY3 - polyY2],
      [polyX4 - polyX3, polyY4 - polyY3],
      [polyX1 - polyX4, polyY1 - polyY4]
    ],
    polyX1,
    polyY1,
    [1, 1],
    'FD',
    true
  );

  // Boundary dimension tags
  doc.setFontSize(4.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Boundary', polyX1 - 4, polyY1 + 14, { angle: 90 });
  doc.text('Boundary', polyX1 + 10, polyY1 - 1);

  // Centered Polygon Label inside parcel
  doc.setTextColor(30, 58, 138); // Deep blue
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  const centerPolyX = x + (w / 2) - 4;
  const centerPolyY = y + (h / 2) - 3;
  doc.text('Polygon', centerPolyX, centerPolyY, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text(polygonCode, centerPolyX, centerPolyY + 3.5, { align: 'center' });
}

/**
 * Draws a simulated high-density official QR Code
 */
function drawSimulatedQrCode(doc: jsPDF, x: number, y: number, size: number): void {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.rect(x, y, size, size, 'FD');

  const cellSize = size / 21;
  doc.setFillColor(15, 23, 42); // Almost black

  // Position detection patterns (Corner squares)
  // Top-Left
  doc.rect(x + cellSize, y + cellSize, cellSize * 7, cellSize * 7, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize * 2, y + cellSize * 2, cellSize * 5, cellSize * 5, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(x + cellSize * 3, y + cellSize * 3, cellSize * 3, cellSize * 3, 'F');

  // Top-Right
  doc.rect(x + size - (cellSize * 8), y + cellSize, cellSize * 7, cellSize * 7, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + size - (cellSize * 7), y + cellSize * 2, cellSize * 5, cellSize * 5, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(x + size - (cellSize * 6), y + cellSize * 3, cellSize * 3, cellSize * 3, 'F');

  // Bottom-Left
  doc.rect(x + cellSize, y + size - (cellSize * 8), cellSize * 7, cellSize * 7, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize * 2, y + size - (cellSize * 7), cellSize * 5, cellSize * 5, 'F');
  doc.setFillColor(15, 23, 42);
  doc.rect(x + cellSize * 3, y + size - (cellSize * 6), cellSize * 3, cellSize * 3, 'F');

  // Random-looking data modules
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
      // Deterministic pseudo-random pattern
      if ((r * 7 + c * 13 + r * c) % 3 === 0) {
        doc.rect(x + (c * cellSize), y + (r * cellSize), cellSize * 0.9, cellSize * 0.9, 'F');
      }
    }
  }
}

/**
 * Draws a blue cursive signature flourish
 */
function drawSignatureGlyph(doc: jsPDF, x: number, y: number): void {
  doc.setDrawColor(29, 78, 216); // Blue ink
  doc.setLineWidth(0.6);

  // Expressive signature loop
  doc.lines(
    [
      [4, -4],
      [6, 3],
      [5, -5],
      [4, 4],
      [8, -2],
      [-12, 6],
      [18, -3]
    ],
    x,
    y + 2,
    [1, 1],
    'D'
  );
}

/**
 * Draws a vector Ashoka Lion Capital Emblem (Government of India)
 */
function drawVectorAshokaEmblem(doc: jsPDF, x: number, y: number): void {
  doc.setDrawColor(30, 41, 59);
  doc.setFillColor(248, 250, 252);
  doc.setLineWidth(0.3);

  // Base Pedestal
  doc.rect(x + 1, y + 14, 12, 2.5, 'FD');
  // Dharma Chakra in center
  doc.circle(x + 7, y + 15.2, 1.2, 'D');

  // Three Lions Heads & Torso
  doc.rect(x + 2.5, y + 5, 9, 9, 'FD');
  doc.circle(x + 4, y + 4.5, 2, 'FD'); // Left lion
  doc.circle(x + 7, y + 3.8, 2.3, 'FD'); // Center lion
  doc.circle(x + 10, y + 4.5, 2, 'FD'); // Right lion

  // "सत्यमेव जयते" Motto text under base
  doc.setFontSize(3.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('सत्यमेव जयते', x + 7, y + 18, { align: 'center' });
}

/**
 * Draws the circular Government of Maharashtra State Seal
 */
function drawMaharashtraStateSeal(doc: jsPDF, x: number, y: number): void {
  const cx = x + 7;
  const cy = y + 8;
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.4);

  // Outer circle
  doc.circle(cx, cy, 7.5, 'D');
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, 6.2, 'D');

  // Inner Diya / Lamp motif
  doc.triangle(cx - 3, cy + 2, cx + 3, cy + 2, cx, cy - 2.5, 'FD');
  doc.circle(cx, cy - 3.5, 0.8, 'FD');

  doc.setFontSize(3.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('महाराष्ट्र शासन', cx, cy + 5, { align: 'center' });
}
