const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Simple placeholder upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // NOTE: In production you should save the file to object storage (e.g., Supabase storage or S3)
    // For now, return a placeholder URL so the app can proceed
    const fakeUrl = `/uploads/${Date.now()}_${req.file.originalname}`;
    res.status(200).json({ url: fakeUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    // No-op placeholder
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
