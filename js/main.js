document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  
  // Check for saved theme or preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // Form Logic
  const form = document.getElementById('qrForm');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const spinner = document.querySelector('.spinner');
  
  const tspInput = document.getElementById('tsp');
  const passInput = document.getElementById('pass');
  const tspError = document.getElementById('tsp-error');
  
  const qrModal = new bootstrap.Modal(document.getElementById('qrModal'));
  const qrImage = document.getElementById('qrImage');
  const qrError = document.getElementById('qr-error');

  // Utility to show toasts
  function showToast(title, message, isError = true) {
    const toastEl = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    
    toastTitle.textContent = title;
    toastBody.textContent = message;
    
    toastEl.classList.remove('bg-success', 'bg-danger', 'text-white');
    toastEl.classList.add(isError ? 'bg-danger' : 'bg-success', 'text-white');
    
    const bsToast = new bootstrap.Toast(toastEl, { delay: 4000 });
    bsToast.show();
  }

  // Handle Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let u = document.getElementById("user").value.trim();
    let p = passInput.value.trim();
    let tsp = tspInput.value.trim();
    let dm = document.getElementById("dm").value.trim();
    let transp = document.getElementById("transp").value;

    // Reset UI state
    spinner.style.display = 'inline-block';
    submitBtn.disabled = true;
    if (tspError) tspError.style.display = 'none';
    if (qrError) qrError.style.display = 'none';
    if (qrImage) qrImage.style.display = 'none';

    let hasError = false;

    // Validation
    if (!/^\d+$/.test(tsp)) {
      if (tspError) tspError.style.display = 'block';
      showToast('Lỗi', 'Port phải là số!');
      hasError = true;
    }

    if (hasError) {
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      return;
    }

    // Encoding and Generating URL
    u = encodeURIComponent(u);
    p = encodeURIComponent(p);
    tsp = encodeURIComponent(tsp);
    dm = encodeURIComponent(dm);
    transp = encodeURIComponent(transp);
    
    const ts = Date.now();
    const url = `https://oem.zoiper.com/qr.php?provider_id=ae45d54c7179618d6e529a6219c0aa80&u=${u}&h=${dm}:${tsp}&p=${p}&tr=${transp}&ts=${ts}`;

    qrImage.onload = () => {
      qrImage.style.display = 'block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      showToast('Thành công', 'Tạo mã QR thành công, quét bằng Zoiper!', false);
      qrModal.show();
      
      // Increment counter
      const visitCountEl = document.getElementById('visit-count');
      if (visitCountEl) {
        fetch('https://api.counterapi.dev/v1/adtek93-zoiper-qr/qr-generated/up')
          .then(res => res.json())
          .then(data => {
            if (data && data.count !== undefined) visitCountEl.textContent = data.count.toLocaleString();
          }).catch(console.error);
      }
    };

    qrImage.onerror = () => {
      console.error('Failed to load QR code from URL:', url);
      if (qrError) qrError.style.display = 'block';
      spinner.style.display = 'none';
      submitBtn.disabled = false;
      showToast('Lỗi', 'Không thể tải mã QR. Vui lòng kiểm tra thông tin!');
    };

    // Trigger image load
    qrImage.src = url;
  });

  // Handle Form Reset
  form.addEventListener('reset', () => {
    if (tspError) tspError.style.display = 'none';
    if (qrError) qrError.style.display = 'none';
    if (qrImage) qrImage.style.display = 'none';
    spinner.style.display = 'none';
    submitBtn.disabled = false;
  });

  // Fetch Visit Count
  const visitCountEl = document.getElementById('visit-count');
  if (visitCountEl) {
    // using counterapi.dev to store generated QR count without incrementing on load
    // Need trailing slash to prevent 301 redirect which causes CORS error
    fetch('https://api.counterapi.dev/v1/adtek93-zoiper-qr/qr-generated/', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => {
        // Handle {"code":400,"message":"record not found"} by showing 0
        if (data && data.count !== undefined) {
          visitCountEl.textContent = data.count.toLocaleString();
        } else {
          visitCountEl.textContent = '0';
        }
      })
      .catch(err => {
        console.error('Counter API Error:', err);
        visitCountEl.textContent = '0';
      });
  }
});
