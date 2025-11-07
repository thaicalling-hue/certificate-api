import { createCanvas, registerFont, loadImage } from 'canvas';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, date } = req.body;

    if (!fullName || !date) {
      return res.status(400).json({ 
        error: 'Missing required fields: fullName and date' 
      });
    }

    // URL шаблона
    const templateUrl = 'https://aiaut.store/123/123.jpg';

    // Загружаем изображение
    const image = await loadImage(templateUrl);
    
    // Создаём canvas
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Рисуем изображение
    ctx.drawImage(image, 0, 0);
    
    // Настройки текста
    ctx.font = '36px Arial';
    ctx.fillStyle = '#000000';
    
    // Добавляем ФИО
    ctx.fillText(fullName, 127, 359);
    
    // Добавляем дату
    ctx.fillText(date, 130, 762);
    
    // Конвертируем в buffer
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    
    // Возвращаем изображение
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${Date.now()}.jpg"`);
    return res.send(buffer);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
