import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const profileId = req.headers['x-demo-profile'] || 'anonymous';
  res.json({
    status: 'ok',
    app: 'Biogas Trust & Adoption Platform API',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    activeProfileHeader: profileId,
    mode: 'illustrative-prototype',
  });
});

export default router;
