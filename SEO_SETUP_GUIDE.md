# SEO Setup Guide — ITL Solutions

## Шаг 1: Google Search Console

### 1.1 Регистрация
1. Откройте https://search.google.com/search-console
2. Войдите через Google аккаунт компании
3. Нажмите **"Add Property"** → **"URL prefix"**
4. Введите: `https://itlsolutions.net`

### 1.2 Верификация
1. Выберите метод **"HTML tag"**
2. Google покажет мета-тег вида:
   ```
   <meta name="google-site-verification" content="XXXXXXXXXXXXXX" />
   ```
3. Скопируйте значение `content` (только код, без кавычек)
4. Добавьте в файл `.env`:
   ```
   GOOGLE_SITE_VERIFICATION="ваш-код-верификации"
   ```
5. Задеплойте сайт и нажмите **"Verify"** в Google Search Console

### 1.3 Отправка Sitemap
1. В Google Search Console → **Sitemaps** (левое меню)
2. Введите: `sitemap.xml`
3. Нажмите **Submit**
4. Статус должен стать **"Success"**

### 1.4 Запрос индексации
1. В строке поиска GSC введите: `https://itlsolutions.net`
2. Нажмите **"Request Indexing"**
3. Повторите для ключевых страниц:
   - `https://itlsolutions.net/services`
   - `https://itlsolutions.net/ru`
   - `https://itlsolutions.net/ru/services`
   - `https://itlsolutions.net/portfolio`
   - `https://itlsolutions.net/contact`
   - `https://itlsolutions.net/blog`

---

## Шаг 2: Yandex.Webmaster

### 2.1 Регистрация
1. Откройте https://webmaster.yandex.com
2. Войдите через Яндекс аккаунт (создайте если нет)
3. Нажмите **"Добавить сайт"**
4. Введите: `https://itlsolutions.net`

### 2.2 Верификация
1. Выберите метод **"Мета-тег"**
2. Яндекс покажет мета-тег вида:
   ```
   <meta name="yandex-verification" content="XXXXXXXXXXXXXX" />
   ```
3. Скопируйте значение `content`
4. Добавьте в файл `.env`:
   ```
   YANDEX_VERIFICATION="ваш-код-верификации"
   ```
5. Задеплойте и нажмите **"Проверить"**

### 2.3 Настройка
1. **Sitemap** → Добавьте `https://itlsolutions.net/sitemap.xml`
2. **Региональность** → Установите регион **"Душанбе"**
3. **Зеркала** → Убедитесь что основное зеркало `https://itlsolutions.net`
4. **Переобход** → Запросите переобход главной страницы

---

## Шаг 3: Google Business Profile

### 3.1 Создание профиля
1. Откройте https://business.google.com
2. Нажмите **"Manage now"**
3. Заполните:
   - **Business name:** ITL Solutions
   - **Category:** Information Technology Company (основная), Web Design (дополнительная)
   - **Address:** Ayni 50/51, Dushanbe, Tajikistan
   - **Phone:** +992 557 777 509
   - **Website:** https://itlsolutions.net
   - **Hours:** Mon-Fri 9:00 AM - 6:00 PM

### 3.2 Оптимизация профиля
1. Добавьте **логотип** и **обложку** (используйте логотип с сайта)
2. Добавьте **фото офиса** (5-10 фото)
3. Заполните **описание** (на английском и русском):
   ```
   ITL Solutions is a leading IT company in Dushanbe, Tajikistan.
   We specialize in web development, mobile app development,
   cloud solutions, cybersecurity, and IT consulting.
   Founded in 2015, we serve businesses across Central Asia and beyond.
   ```
4. Добавьте **услуги** с ценовым диапазоном
5. Добавьте **часы работы** и **способы связи**

### 3.3 Сбор отзывов
1. Получите ссылку на отзывы: Google Business → Share review link
2. Отправьте ссылку **5-10 довольным клиентам**
3. Цель: минимум **10 отзывов с рейтингом 4.5+**

---

## Шаг 4: Google Analytics 4

### 4.1 Создание аккаунта
1. Откройте https://analytics.google.com
2. **Create Account** → Account name: "ITL Solutions"
3. **Create Property** → Property name: "itlsolutions.net"
4. Выберите часовой пояс и валюту
5. **Create Web Stream** → URL: `https://itlsolutions.net`

### 4.2 Подключение
1. Скопируйте **Measurement ID** (формат: `G-XXXXXXXXXX`)
2. Добавьте в `.env`:
   ```
   NEXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"
   ```

### 4.3 Настройка целей
1. **Events** → Create event:
   - `contact_form_submit` — отправка формы
   - `phone_click` — клик на телефон
   - `email_click` — клик на email
2. **Conversions** → отметьте эти события как конверсии

---

## Шаг 5: Yandex.Metrika

### 5.1 Создание счётчика
1. Откройте https://metrika.yandex.ru
2. **Добавить счётчик**
3. Имя: "ITL Solutions"
4. URL: `itlsolutions.net`
5. Включите: Вебвизор, Карта кликов, Карта скроллинга

### 5.2 Подключение
1. Скопируйте **ID счётчика** (число)
2. Добавьте в `.env`:
   ```
   NEXT_PUBLIC_YANDEX_METRIKA_ID="12345678"
   ```

### 5.3 Настройка целей
1. **Цели** → Добавить цель:
   - "Отправка формы" — JavaScript-событие
   - "Клик на телефон" — Клик по ссылке `tel:`
   - "Просмотр контактов" — Посещение `/contact`

---

## Шаг 6: Обновление .env для продакшена

После получения всех кодов, добавьте в `.env`:

```bash
# === PRODUCTION VALUES ===

# Site URL (ОБЯЗАТЕЛЬНО сменить с localhost!)
NEXT_PUBLIC_SITE_URL="https://itlsolutions.net"

# Analytics
NEXT_PUBLIC_GA4_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_YANDEX_METRIKA_ID="12345678"

# Search Engine Verification
GOOGLE_SITE_VERIFICATION="ваш-код-google"
YANDEX_VERIFICATION="ваш-код-yandex"
```

---

## Чеклист перед деплоем

- [ ] `NEXT_PUBLIC_SITE_URL` установлен на `https://itlsolutions.net`
- [ ] `NEXT_PUBLIC_GA4_ID` заполнен
- [ ] `NEXT_PUBLIC_YANDEX_METRIKA_ID` заполнен
- [ ] `GOOGLE_SITE_VERIFICATION` заполнен
- [ ] `YANDEX_VERIFICATION` заполнен
- [ ] Google Search Console — sitemap отправлен
- [ ] Yandex.Webmaster — sitemap отправлен
- [ ] Google Business Profile — создан и верифицирован
- [ ] Минимум 5 отзывов на Google
- [ ] Первая статья в блоге опубликована
