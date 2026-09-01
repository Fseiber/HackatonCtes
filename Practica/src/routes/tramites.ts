import { Router } from 'express';
import {
  getTramites,
  getTramite,
  createTramite,
  updateTramite,
  deleteTramite,
} from '../controllers/tramite.controller';

const router = Router();

router.get('/', getTramites);
router.get('/:id', getTramite);
router.post('/', createTramite);
router.patch('/:id', updateTramite);
router.delete('/:id', deleteTramite);

export default router;