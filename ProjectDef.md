# ASERAİ Kategori İnşa Sistemi
## Next.js Projesi – Master Kategori Altyapısı

---

## 1. Projenin Amacı

Bu proje, Aserai platformunun kendi **merkezi kategori ağacını (Master Category System)** oluşturmak için geliştirilmektedir.

Bu aşamada amaç:

- Pazaryerlerini birbirine bağlamak değildir.
- Ürün entegrasyonu yapmak değildir.
- Otomatik kategori eşleştirme yapmak değildir.

Amaç yalnızca:

- Pazaryerlerini veri kaynağı olarak kullanmak
- Admin panel üzerinden kategori seçmek
- Seçilen kategorileri Aserai kategori ağacına eklemek
- Kategoriye ait attribute (özellik) yapılarını otomatik almak
- Gelecekte kurulacak e-ticaret altyapısının veri omurgasını oluşturmak

Aserai kategorileri sistemin tek gerçek kategori yapısıdır.

---

## 2. Temel Mantık

Pazaryerleri → Kaynak Veri
ASERAİ → Ana (Master) Sistem


Pazaryerleri birbirine bağlanmaz.

Tüm işlemler sadece Aserai kategori ağacını oluşturmak ve büyütmek içindir.

---

## 3. Sistem Genel Akışı

### Admin Kullanım Senaryosu

1. Admin panelde pazaryeri kategori ağaçlarını görür.
2. İstediği kategoriyi sürükler.
3. Aserai kategori ağacında istediği yere bırakır.
4. Sistem otomatik olarak:
   - Aserai kategorisini oluşturur (yoksa)
   - Kaynak kategorinin attribute listesini çeker
   - Attribute’ları Aserai veritabanına ekler.

Hiçbir otomatik eşleştirme yapılmaz.  
Kategori kararları tamamen manuel verilir.

---

## 4. Ana Özellikler

### ✅ Master Kategori Ağacı
- Hiyerarşik yapı
- Sınırsız alt kategori
- Pazaryerlerinden bağımsız

### ✅ Drag & Drop Kategori Aktarma
- Görsel yönetim paneli
- Sürükle & bırak ile kategori ekleme
- Tek işlemle kategori oluşturma

### ✅ Otomatik Attribute Aktarımı
Kategori eklenirken:
- Tüm attribute’lar otomatik alınır
- Aserai kategorisine kopyalanır
- Sistem zamanla zenginleşir

---

## 5. Sistem Kuralları

- Aserai kategorisi varsa tekrar import edilmez.
- Aynı kategori ikinci kez oluşturulmaz.
- Attribute’lar silinmez, sadece eklenir.
- Pazaryerleri yalnızca veri kaynağıdır.
- Aserai her zaman merkezdir.

---

## 6. Teknoloji Stack

- Next.js (App Router)
- React
- TypeScript
- PostgreSQL
- Prisma ORM
- dnd-kit veya React DnD (drag & drop)
- Server Actions / API Routes

---

## 7. Veritabanı Modeli

### aserai_categories
id
name
parent_id
created_by (manual/import)
source_marketplace (nullable)
source_category_id (nullable)
created_at


---

### aserai_attributes
id
aserai_category_id
name
type
required
options_json
created_from
source_attribute_id (nullable)
created_at


---

### marketplace_categories (ham veri)
id
marketplace
external_id
name
parent_id
raw_json


---

## 8. Attribute Import Mantığı

Kategori sürüklendiğinde sistem:

1. Pazaryeri API’den attribute listesini çeker.
2. Aynı isimde attribute var mı kontrol eder.
3. Yoksa ekler.
4. Varsa tekrar oluşturmaz.

Pseudo akış:

onCategoryDrop():

createCategoryIfNotExists()

attributes = fetchMarketplaceAttributes()

for attribute in attributes:
if not existsInAserai(attribute):
insertAttribute()


---

## 9. Admin Panel Tasarımı

### Panel Yerleşimi

[ Trendyol Tree ] [ ASERAI Tree ] [ N11 Tree ]


Davranış:

- Sol veya sağ panelden kategori tutulur.
- Orta panelde Aserai ağacına bırakılır.
- Sistem kategori ve attribute verisini kopyalar.

---

## 10. Uzun Vadeli Amaç

Bu sistem tamamlandığında:

- Aserai kendi e-ticaret kategori standardına sahip olur.
- Ürün verileri tek modele oturur.
- Gelecekte entegrasyon eklemek kolaylaşır.
- Kullanıcılar Aserai altyapısına doğrudan geçebilir.

---

## 11. Özet

Bu proje bir entegrasyon sistemi değildir.

Bu proje:

> Yeni bir e-ticaret platformunun kategori ve veri modelini inşa eden yönetim aracıdır.

Önce doğru kategori yapısı kurulur.  
Entegrasyon daha sonra eklenir.














You are a senior full-stack engineer.

We are building a Next.js (App Router) project called **Aserai Category Builder**.

PROJECT PURPOSE
This system will create a central category structure called "Aserai Categories".
Marketplace categories from Trendyol, N11 and other marketplaces will be mapped into these Aserai categories.

The system must allow:
1. Creating internal (Aserai) categories.
2. Fetching marketplace categories via API.
3. Matching marketplace categories to Aserai categories.
4. Fetching and storing marketplace attributes automatically if provided by API.
5. Saving mappings and attributes into database.

TECH STACK
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Server Actions preferred
- Clean modular architecture
- API integrations separated as services
- Database layer abstracted (prepare for Firebase later)

PROJECT STRUCTURE REQUIREMENTS

Create folders:

src/
 ├─ app/
 │   ├─ dashboard/
 │   │   ├─ categories/
 │   │   └─ mappings/
 │   └─ api/
 ├─ components/
 ├─ features/
 │   ├─ categories/
 │   ├─ marketplaces/
 │   └─ attribute-mapping/
 ├─ services/
 │   ├─ trendyol/
 │   ├─ n11/
 │   └─ marketplaces/
 ├─ lib/
 ├─ types/
 └─ hooks/

CORE DOMAIN MODELS

AseraiCategory:
- id
- name
- parentId
- level
- createdAt

MarketplaceCategory:
- id
- name
- marketplace (trendyol | n11)
- parentId

CategoryMapping:
- id
- aseraiCategoryId
- marketplace
- marketplaceCategoryId

Attribute:
- id
- name
- marketplace
- required
- type
- possibleValues[]

AttributeMapping:
- aseraiCategoryId
- marketplaceAttributeId
- localAttributeName

INITIAL TASKS

1. Create dashboard layout.
2. Create category list page.
3. Add "Create Aserai Category" form.
4. Create mock marketplace service returning fake Trendyol & N11 categories.
5. Build category mapping UI skeleton:
   - left: Aserai categories
   - right: marketplace category tree
6. Prepare attribute fetching function (mock data for now).

IMPORTANT RULES
- Use strong typing everywhere.
- Separate UI and business logic.
- No hardcoded marketplace logic inside components.
- All integrations must live under /services.

Start by generating folder structure, base layouts, types and mock services.
Do NOT implement database yet.
