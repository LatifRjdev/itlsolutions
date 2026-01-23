# SEO-оптимизация ITL Solutions для рынка Таджикистана

## Анализ текущего состояния

### Что уже реализовано:
- Базовые meta-теги (title, description)
- Open Graph и Twitter Cards
- Sitemap.xml с динамическими страницами
- Robots.txt
- Поддержка i18n (EN/RU)

### Критические пробелы:
1. **Нет hreflang тегов** - критично для мультиязычного SEO
2. **Нет JSON-LD структурированных данных** (Schema.org)
3. **Отсутствует og-image.png**
4. **Ключевые слова не локализованы** для Таджикистана
5. **Нет LocalBusiness схемы** с адресом в Душанбе

---

## Анализ конкурентов в Таджикистане

### Основные конкуренты:
| Компания | Сайт | Опыт |
|----------|------|------|
| WebArt | webart.tj | 15 лет |
| Nova Vision | novavision.site | - |
| Livo | livo.tj | с 2017 |
| iTservice | itservice.tj | Нац. премия |
| SkyNtix | skyntix.com | - |
| Admin.tj | admin.tj | - |
| Rebus | rebus.tj | - |

---

## Целевые ключевые слова

### Высокочастотные (основные):

**Русский язык:**
- IT компания Таджикистан
- IT компания Душанбе
- разработка сайтов Душанбе
- создание сайтов Таджикистан
- веб-разработка Таджикистан
- разработка мобильных приложений Душанбе
- IT услуги Таджикистан

**Английский язык:**
- IT company Tajikistan
- web development Dushanbe
- software development Tajikistan
- mobile app development Tajikistan

### Среднечастотные (услуги):

**Русский:**
- разработка интернет-магазина Душанбе
- SEO продвижение Таджикистан
- автоматизация бизнеса Таджикистан
- разработка CRM Душанбе
- создание корпоративного сайта Таджикистан
- UI/UX дизайн Душанбе
- облачные решения Таджикистан
- кибербезопасность Таджикистан
- IT консалтинг Душанбе

**Английский:**
- e-commerce development Tajikistan
- cloud solutions Dushanbe
- cybersecurity services Tajikistan
- IT consulting Central Asia

### Низкочастотные (специфичные):

- разработка сайта под ключ Душанбе
- заказать мобильное приложение Таджикистан
- веб-студия Душанбе цены
- программист на заказ Таджикистан
- интеграция платежных систем Таджикистан
- разработка GovTech решений
- цифровизация бизнеса Таджикистан

### Long-tail ключевые слова:

- сколько стоит создание сайта в Душанбе
- лучшая IT компания в Таджикистане
- разработка мобильного приложения для iOS и Android Душанбе
- создание интернет-магазина с интеграцией Корти Милли
- веб-разработка React Next.js Таджикистан

---

## План реализации

### Этап 1: Технический SEO

#### 1.1 Hreflang теги
Добавить в каждую страницу:
```html
<link rel="alternate" hreflang="en" href="https://itlsolutions.net/en/..." />
<link rel="alternate" hreflang="ru" href="https://itlsolutions.net/ru/..." />
<link rel="alternate" hreflang="x-default" href="https://itlsolutions.net/..." />
```

#### 1.2 JSON-LD Schema.org
Добавить структурированные данные:

**Organization Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ITL Solutions",
  "url": "https://itlsolutions.net",
  "logo": "https://itlsolutions.net/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dushanbe",
    "addressCountry": "TJ"
  },
  "sameAs": ["linkedin", "github"]
}
```

**LocalBusiness Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "ITL Solutions",
  "address": {
    "addressLocality": "Душанбе",
    "addressRegion": "Таджикистан"
  },
  "areaServed": ["Tajikistan", "Central Asia"],
  "serviceType": ["Web Development", "Mobile App Development", "IT Consulting"]
}
```

**Service Schema** для каждой услуги
**Article Schema** для блога
**BreadcrumbList Schema** для навигации

#### 1.3 Создать OG-изображение
- Размер: 1200x630px
- Логотип + слоган компании

### Этап 2: Контентная оптимизация

#### 2.1 Главная страница
**Title (RU):** ITL Solutions - IT компания в Таджикистане | Разработка сайтов и приложений Душанбе
**Title (EN):** ITL Solutions - IT Company in Tajikistan | Web & App Development Dushanbe

**Description (RU):** Ведущая IT компания в Таджикистане. Разработка сайтов, мобильных приложений, облачные решения и IT консалтинг в Душанбе. 50+ успешных проектов.
**Description (EN):** Leading IT company in Tajikistan. Web development, mobile apps, cloud solutions, and IT consulting in Dushanbe. 50+ successful projects.

**Keywords:** IT компания Таджикистан, разработка сайтов Душанбе, мобильные приложения, веб-разработка, IT услуги

#### 2.2 Страница услуг
Для каждой услуги создать уникальные meta с локальными ключевыми словами:

| Услуга | Title (RU) |
|--------|------------|
| Web Development | Разработка сайтов в Душанбе - Веб-разработка Таджикистан |
| Mobile Apps | Разработка мобильных приложений Душанбе - iOS и Android |
| UI/UX Design | UI/UX дизайн Душанбе - Дизайн интерфейсов Таджикистан |
| Cloud Solutions | Облачные решения Таджикистан - AWS, Azure Душанбе |
| Cybersecurity | Кибербезопасность Таджикистан - Защита данных Душанбе |
| IT Consulting | IT консалтинг Душанбе - Цифровая трансформация |

#### 2.3 Страница "О компании"
Добавить:
- История компании в Таджикистане
- Адрес офиса в Душанбе
- Упоминание локальных проектов (GovTech, банки)

#### 2.4 Страница контактов
- Полный адрес в Душанбе
- Местный телефон
- Google Maps с офисом
- Часы работы

### Этап 3: Локализация контента

#### 3.1 Русская версия (приоритет)
- Полностью перевести все страницы
- Адаптировать тексты под русскоязычную аудиторию
- Использовать локальные ключевые слова

#### 3.2 Добавить страницы для SEO
Создать отдельные landing pages:
- /ru/services/razrabotka-saytov-dushanbe
- /ru/services/mobilnye-prilozheniya-tadzhikistan
- /ru/services/internet-magazin-dushanbe

### Этап 4: Sitemap и индексация

#### 4.1 Обновить sitemap.xml
- Добавить все локализованные страницы
- Добавить hreflang в sitemap
- Приоритеты: главная (1.0), услуги (0.9), портфолио (0.8)

#### 4.2 Google Search Console
- Подтвердить владение сайтом
- Отправить sitemap
- Настроить международный таргетинг

#### 4.3 Yandex Webmaster
- Зарегистрировать сайт в Яндекс
- Важно для русскоязычной аудитории
- Настроить региональность (Таджикистан)

### Этап 5: Внешнее SEO

#### 5.1 Локальные каталоги
Зарегистрироваться:
- Somon.tj (доска объявлений)
- vdushanbe.ru (справочник)
- 2gis.tj (карты)
- Google Business Profile

#### 5.2 Backlinks
- Партнерские ссылки с клиентов
- Публикации в местных СМИ
- Профили на GitHub, LinkedIn

---

## Файлы для изменения

### Обязательные изменения:

1. **src/app/layout.tsx** - обновить keywords, добавить JSON-LD Organization
2. **src/app/[locale]/layout.tsx** - добавить hreflang теги
3. **src/app/[locale]/page.tsx** - локализованные meta для главной
4. **src/app/[locale]/services/page.tsx** - SEO для услуг
5. **src/app/[locale]/about/page.tsx** - добавить локальный контент
6. **src/app/[locale]/contact/page.tsx** - LocalBusiness schema
7. **src/app/sitemap.ts** - добавить hreflang, все локали
8. **public/og-image.png** - создать изображение
9. **messages/ru.json** - обновить meta-тексты

### Новые файлы:

1. **src/components/seo/JsonLd.tsx** - компонент для структурированных данных
2. **src/lib/seo.ts** - утилиты для генерации meta
3. **public/robots.txt** - статический файл (опционально)

---

## Ожидаемые результаты

### Через 1-3 месяца:
- Индексация всех страниц в Google и Yandex
- Появление в результатах по брендовым запросам

### Через 3-6 месяцев:
- Топ-10 по запросам "IT компания Душанбе", "разработка сайтов Таджикистан"
- Рост органического трафика на 50-100%

### Через 6-12 месяцев:
- Топ-3 по основным ключевым словам
- Узнаваемость бренда в регионе

---

## Метрики для отслеживания

1. Позиции по ключевым словам (Google, Yandex)
2. Органический трафик (Google Analytics)
3. CTR в поисковой выдаче (Search Console)
4. Количество индексированных страниц
5. Core Web Vitals (скорость загрузки)
6. Количество обратных ссылок

---

## Источники исследования

- [WebArt.tj](https://webart.tj/) - конкурент с 15-летним опытом
- [Nova Vision](https://novavision.site/) - веб-студия в Душанбе
- [Livo](https://livo.tj/) - IT-компания с 2017 года
- [iTservice](https://itservice.tj/) - автоматизация бизнеса
- [Somon.tj](https://somon.tj/) - доска объявлений для регистрации
- [THE TECH](https://the-tech.kz/krupnejshie-it-kompanii-tadzhikistana-kotorye-menyayut-industriyu/) - обзор IT-компаний Таджикистана
