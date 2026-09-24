(() => {
  const sheet = document.querySelector('.cv-sheet');
  if (!sheet) return;

  const pageWidth = 1140;
  const pageHeight = 1588;

  function resizeCv() {
    const scale = Math.min(1.122807, sheet.clientWidth / pageWidth);
    sheet.style.setProperty('--cv-scale', String(scale));
    sheet.style.height = `${pageHeight * scale}px`;
  }

  addEventListener('resize', resizeCv);
  addEventListener('pageshow', resizeCv);
  resizeCv();
})();