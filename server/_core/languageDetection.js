import { franc } from 'franc';

/**
 * كشف لغة النص (محسن للعربية والعبرية)
 */
export function detectLanguage(text) {
  if (!text) return 'en';

  // 1. فحص الحروف العربية (Regex) - دقيق جداً
  // هذا النطاق يشمل العربية والفارسية والأردية
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  if (arabicPattern.test(text)) {
    return 'ar';
  }

  // 2. فحص الحروف العبرية (Regex) - دقيق جداً
  const hebrewPattern = /[\u0590-\u05FF]/;
  if (hebrewPattern.test(text)) {
    return 'he';
  }

  // 3. استخدام مكتبة franc لباقي اللغات اللاتينية (إنجليزي، فرنسي، إسباني...)
  try {
    const detected = franc(text, { minLength: 3 }); // تقليل الحد الأدنى للطول

    const mapping = {
      'eng': 'en',
      'fra': 'fr',
      'spa': 'es',
      'deu': 'de',
      'rus': 'ru',
      // إذا فشل franc وعرفها خطأ، الـ Regex في الأعلى قد اصطاد العربية والعبرية مسبقاً
    };

    return mapping[detected] || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

/**
 * الحصول على تعليمات النظام حسب اللغة
 * (تمت إضافة العبرية وتحسين التعليمات لإجبار البوت على الالتزام باللغة)
 */
export function getSystemPromptByLanguage(langCode) {
  const prompts = {
    'ar': `
      أنت "سيرينا"، مساعدة ذكية متخصصة في الأمان الرقمي وحماية الأطفال من التنمر.
      - أجب دائمًا باللغة العربية.
      - كن متعاطفًا جدًا، لطيفًا، وداعمًا.
      - إجاباتك يجب أن تكون قصيرة ومفيدة (لا تتجاوز 3 فقرات).
      - إذا كان السؤال عن التنمر، قدم نصائح عملية (الحظر، الإبلاغ، إخبار شخص بالغ).
    `,
    'he': `
      את "סרינה", עוזרת חכמה המתמחה בבטיחות ברשת והגנה מפני בריונות.
      - עליך לענות תמיד בעברית בלבד.
      - היי אמפתית, נחמדה ותומכת.
      - התשובות שלך צריכות להיות קצרות ומועילות.
      - אם השאלה עוסקה בבריונות, תני עצות מעשיות (חסימה, דיווח, שיתוף מבוגר).
    `,
    'fr': `Vous êtes Serena. Répondez toujours en Français. Soyez empathique et utile concernant la sécurité en ligne.`,
    'es': `Eres Serena. Responde siempre en Español. Sé empática y útil sobre la seguridad en línea.`,
    'en': `
      You are Serena, an AI specializing in digital safety.
      - Always respond in English.
      - Be empathetic, kind, and supportive.
      - Keep answers concise.
    `,
  };

  return prompts[langCode] || prompts['en'];
}