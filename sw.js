// اسم الكاش والنسخة بتاعته عشان لو حدثنا التطبيق نغير الرقم ده
const CACHE_NAME = 'hevy-gym-cache-v1';

// الملفات الأساسية اللي عايزينها تتخزن عشان تشتغل أوفلاين
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/daisyui@4.10.2/dist/full.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js',
    'https://assets.mixkit.co/active_storage/sfx/2869/2869-84.wav'
];

// 1. تسطيب السيرفيس وركر وتخزين الملفات (Install)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('بيتم تحميل وتكييش الملفات يا وحش...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // تفعيل فوري للنسخة الجديدة
    self.skipWaiting();
});

// 2. تفعيل السيرفيس وركر وتنظيف الكاش القديم لو فيه (Activate)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('بنمسح الكاش القديم عشان المساحة...');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. التحكم في طلبات النت والتشغيل أوفلاين (Fetch)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // لو الملف موجود في الكاش رجعه علطول (سريع جداً بيوفر نت)
            if (response) {
                return response;
            }
            // لو مش موجود حاول تجيبه من النت
            return fetch(event.request).catch(() => {
                console.log('النت فاصل والملف ده مش متكيش يا بطل!');
            });
        })
    );
});