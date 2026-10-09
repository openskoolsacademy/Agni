import { Router } from 'express';
import multer from 'multer';
import {
  uploadDocument,
  addTextKnowledge,
  getDocuments,
  deleteDocument,
  testSearch,
} from '../controllers/knowledge.controller.js';
import { authGuard } from '../middleware/auth.middleware.js';
import { config } from '../config/index.js';

const router = Router();

// Multer memory storage setup
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.knowledge.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'docx' || ext === 'txt' || ext === 'md' || ext === 'csv') {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload PDF, DOCX, TXT, or MD files.'));
    }
  },
});

router.use(authGuard);

router.post('/upload', upload.single('file'), uploadDocument);
router.post('/text', addTextKnowledge);
router.get('/:botId', getDocuments);
router.delete('/documents/:docId', deleteDocument);
router.post('/search', testSearch);

export default router;
