Trendyol kategori ağacını çekmek için kullanılan resmî endpoint:

✅ Trendyol Category Tree API

Endpoint

GET https://api.trendyol.com/sapigw/product-categories


veya dokümanda geçen servis adı:

getCategoryTree


Bu servis Trendyol’daki tüm kategori ağacını (parent → child yapısı) döner.
Ürün yüklerken kullanılan categoryId değerleri buradan alınır.

🔐 Authentication (zorunlu)

Trendyol Marketplace API basic auth kullanır.

Header:

Authorization: Basic base64(API_KEY:API_SECRET)
User-Agent: <supplierId> - SelfIntegration

✅ Örnek Request (Next.js / Node fetch)
const response = await fetch(
  "https://api.trendyol.com/sapigw/product-categories",
  {
    method: "GET",
    headers: {
      "Authorization": "Basic BASE64_APIKEY_SECRET",
      "User-Agent": "123456 - SelfIntegration"
    }
  }
);

const data = await response.json();
console.log(data);

📦 Dönen veri yapısı (özet)
[
  {
    "id": 1,
    "name": "Elektronik",
    "subCategories": [
      {
        "id": 100,
        "name": "Bilgisayar",
        "subCategories": [
          {
            "id": 1010,
            "name": "Dizüstü Bilgisayar"
          }
        ]
      }
    ]
  }
]


Yani:

Ana kategori
 └── Alt kategori
      └── Leaf kategori (ürün yüklenen yer)

⚠️ Önemli gerçekler

Ürün sadece en alt kategoriye (leaf) gönderilebilir.

Trendyol kategori ağacı zamanla değişir → düzenli çekmek gerekir.

Attribute (özellikler) bu endpointten gelmez; ayrı endpoint vardır.

🔥 Senin sistem için doğru kullanım

Senin senaryoda:

Admin panel açılır

Trendyol category tree çekilir

Tree UI’da gösterilir

Admin sürükle-bırak yapar

Seçilen kategori:

Aserai category tree içine eklenir

Attribute API çağrısı yapılır

Attribute’lar da otomatik eklenir

İstersen bir sonraki adımda kritik olan endpointi veririm:

👉 Kategori seçildiğinde o kategoriye ait attribute’ları çeken Trendyol API (asıl sistemi çalıştıran kısım).


Aşağıda Trendyol’da kategoriye ait attribute (özellik) bilgisini çeken resmî endpointler yer alır.

✅ 1️⃣ Kategoriye Ait Attribute Listesi

Endpoint

GET https://api.trendyol.com/sapigw/product-categories/{categoryId}/attributes


Bu servis, ilgili categoryId için:

Zorunlu attribute’ları

Opsiyonel attribute’ları

Attribute tiplerini (TEXT, NUMERIC, SELECT vs.)

Varsa predefined value listelerini

döner.

Kaynak: Trendyol Developer Docs

🔐 Authentication
Authorization: Basic BASE64(API_KEY:API_SECRET)
User-Agent: <supplierId> - SelfIntegration

✅ Örnek Request (Node / Next.js)
const categoryId = 1010;

const response = await fetch(
  `https://api.trendyol.com/sapigw/product-categories/${categoryId}/attributes`,
  {
    method: "GET",
    headers: {
      "Authorization": "Basic BASE64_APIKEY_SECRET",
      "User-Agent": "123456 - SelfIntegration"
    }
  }
);

const data = await response.json();
console.log(data);

📦 Örnek Response (Özet)
[
  {
    "attributeId": 47,
    "name": "Marka",
    "required": true,
    "type": "SELECT",
    "attributeValues": [
      {
        "id": 179,
        "name": "Apple"
      },
      {
        "id": 180,
        "name": "Lenovo"
      }
    ]
  }
]

2️⃣ Attribute Value Arama (Bazı kategorilerde gerekir)

Bazı attribute’lar çok büyük liste içerir (örneğin marka).
Bunları aramak için:

GET https://api.trendyol.com/sapigw/product-categories/{categoryId}/attributes/{attributeId}/attribute-values

⚠️ Kritik Notlar

Attribute yapısı kategoriye özeldir.

Leaf kategori için çağrılmalıdır.

Ürün yüklerken attributeId + attributeValueId gönderilir.

Eğer attribute TEXT tipindeyse valueId yerine doğrudan string gönderilir.

🔥 Senin Aserai sistemi için doğru akış

Admin Trendyol kategori seçer.

categoryId alınır.

Attributes endpoint çağrılır.

Dönen tüm attribute’lar:

Aserai kategori modeline eklenir

Zorunlu alan flag’i korunur

SELECT tipli attribute’ların value listesi kaydedilir

Böylece Aserai kategorisi artık Trendyol uyumlu olur.

İstersen sıradaki adımda N11 attribute endpointlerini de net şekilde çıkarabilirim.