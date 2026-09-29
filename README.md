# QuickShare 🚀
> A modern, lightning-fast file-sharing web application built with **React (Vite)** and **Node.js (Express)**.

---

## ⚡ Quick Setup & Running Both Servers

### 1. Install Dependencies (First-Time Only)

```bash
# In the project root directory
npm run install:all
```

Or run individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Start the App

From the project root, run both the Express backend and React + Vite frontend together:

```bash
npm run dev
```

The backend runs on **`http://localhost:5001`** and the frontend runs on **`http://localhost:5174`**. The frontend proxies `/api` requests to the backend. Stop both servers together with **Ctrl+C**.

Open **[http://localhost:5174](http://localhost:5174)** in your browser!

---

## 🔁 Testing the Complete Transfer Flow

1. **Choose a File**:
   - Open **[http://localhost:5174](http://localhost:5174)**.
   - Click **"Choose File"** or drag-and-drop a file (up to 25 MB) into the dropzone.
   - Notice the staged file name and formatted file size (e.g., `presentation.pdf • 12.4 MB`).

2. **Upload**:
   - Click the glowing **"Upload File"** button.
   - Watch the real-time animated upload progress bar and byte counter.

3. **Copy the Shareable Link**:
   - Upon upload completion, a **Success Card** appears with your unique **Transfer ID** (e.g. `qs-16ecb401`) and a 24-hour expiration notice.
   - Click **"Copy Link"** (or click **"View Download Page"**).

4. **Scan or Share with QR Code (Mobile Transfer)**:
   - Click the **"QR Code"** button or toggle **"Scan with Phone Camera"** on the upload success card.
   - Point any smartphone camera at the high-contrast QR code to open the transfer directly on mobile!
   - Click **"Save QR as PNG"** to export a clean image to print or attach to messages.

5. **Download in Another Tab or Mobile**:
   - Paste the link (`http://localhost:5174/transfer/qs-xxxxxx`) in a new browser tab or scan the QR code.
   - The recipient sees the file name, size, remaining time (`23h 59m left`), and a **"Download File"** button.
   - Click **"Download File"** to receive the original file byte-for-byte.

6. **Test Invalid/Expired Transfer**:
   - Navigate to `http://localhost:5174/transfer/qs-expired-test`.
   - Instead of a blank page, a clear **"Transfer Not Found or Expired"** card appears with a button to return home.

---

## ⚙️ Key Specifications & Architecture

| Feature | Details |
|---|---|
| **Max File Size** | **25 MB** limit enforced on both client and server |
| **Auto-Expiry** | **24-Hour retention** with automated background cleanup |
| **QR Code Sharing** | Instant high-contrast QR code generation (`qrcode.react`), inline preview, and PNG export |
| **Storage Engine** | Temporary local disk storage in `backend/uploads/` (zero database needed) |
| **Frontend** | React 18 + Vite + Vanilla CSS design system (responsive on mobile & desktop) |
| **Backend** | Express + Multer + CORS |
| **Unique IDs** | Clean cryptographic transfer IDs (e.g. `qs-a1b2c3d4`) |
