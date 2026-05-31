const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Bu ma\'lumot allaqachon mavjud' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Ma\'lumot topilmadi' });
  }

  const status  = err.status  || 500;
  const message = err.message || 'Server xatosi';

  res.status(status).json({ success: false, message });
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route topilmadi: ${req.originalUrl}` });
};

module.exports = { errorHandler, notFound };
