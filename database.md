# ASERAİ Kategori Sistemi — Veritabanı Şeması

## Supabase / PostgreSQL

---

## Tablolar

### 1. `aserai_categories`

Ana Aserai kategori ağacı. Her satır bir kategori node'udur.

```sql
CREATE TABLE aserai_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  parent_id     UUID REFERENCES aserai_categories(id) ON DELETE CASCADE,
  sort_order    INTEGER DEFAULT 0,
  
  -- Kaynak bilgisi (hangi pazaryerinden sürüklendi)
  source_marketplace  TEXT,           -- 'trendyol' | 'n11' | 'hepsiburada' | null (manuel)
  
  -- Kategori ağacı JSON snapshot (tüm alt ağaç dahil)
  -- Bu alan sadece root kategorilerde dolu olur, hızlı okuma için
  tree_snapshot  JSONB,
  
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Hiyerarşi index
CREATE INDEX idx_aserai_categories_parent ON aserai_categories(parent_id);
CREATE INDEX idx_aserai_categories_source ON aserai_categories(source_marketplace);
```

### 2. `aserai_attributes`

Her kategoriye ait attribute (özellik) değerleri.

```sql
CREATE TABLE aserai_attributes (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id       UUID NOT NULL REFERENCES aserai_categories(id) ON DELETE CASCADE,
  
  name              TEXT NOT NULL,
  type              TEXT NOT NULL DEFAULT 'string',   -- 'string' | 'number' | 'boolean' | 'select' | 'multi-select'
  required          BOOLEAN DEFAULT FALSE,
  options           JSONB,                            -- select/multi-select seçenekleri: ["S", "M", "L"]
  
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aserai_attributes_category ON aserai_attributes(category_id);
```

### 3. `aserai_category_mappings`

Hangi Aserai kategorisi hangi pazaryeri kategorisine eşleştirildi.

```sql
CREATE TABLE aserai_category_mappings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aserai_category_id    UUID NOT NULL REFERENCES aserai_categories(id) ON DELETE CASCADE,
  
  marketplace           TEXT NOT NULL,                -- 'trendyol' | 'n11' | 'hepsiburada'
  marketplace_category_path TEXT[],                   -- ['Elektronik', 'Bilgisayar', 'Dizüstü']
  
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(aserai_category_id, marketplace)
);

CREATE INDEX idx_mappings_aserai ON aserai_category_mappings(aserai_category_id);
CREATE INDEX idx_mappings_marketplace ON aserai_category_mappings(marketplace);
```

### 4. `aserai_tree_snapshots`

Tüm kategori ağacının JSON snapshot'ı. Kaydet butonuna her basıldığında yeni bir versiyon oluşturulur.

```sql
CREATE TABLE aserai_tree_snapshots (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_data     JSONB NOT NULL,         -- Tüm ağaç: [{id, name, children: [...], attributes: [...]}]
  category_count INTEGER DEFAULT 0,
  version       INTEGER DEFAULT 1,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Veri Akışı

### Kaydet Butonu Tıklandığında:

```
1. Frontend: aseraiCategories state'i JSON olarak alınır
2. POST /api/aserai/save → body: { tree: [...] }
3. Backend:
   a. aserai_tree_snapshots tablosuna tüm ağaç JSON olarak yazılır (yeni versiyon)
   b. aserai_categories tablosu sıfırlanıp yeniden yazılır (upsert)
   c. Her kategori için attributes varsa aserai_attributes tablosuna eklenir
   d. source_marketplace bilgisi varsa aserai_category_mappings'e eklenir
4. Response: { success: true, version: N, categoryCount: M }
```

### Sayfa Yüklendiğinde:

```
1. GET /api/aserai/load
2. Backend: aserai_tree_snapshots tablosundan en son versiyonu çeker
3. Response: { success: true, tree: [...], version: N }
4. Frontend: aseraiCategories state'ini tree ile doldurur
```

---

## JSON Yapısı (tree_data)

```json
[
  {
    "id": "aserai-1234-abc",
    "name": "Elektronik",
    "parentId": null,
    "source_marketplace": "trendyol",
    "children": [
      {
        "id": "aserai-1235-def",
        "name": "Bilgisayar",
        "parentId": "aserai-1234-abc",
        "source_marketplace": "trendyol",
        "children": [
          {
            "id": "aserai-1236-ghi",
            "name": "Dizüstü Bilgisayar",
            "parentId": "aserai-1235-def",
            "source_marketplace": "trendyol",
            "attributes": [
              {
                "id": "attr-001",
                "name": "İşlemci",
                "type": "select",
                "required": true,
                "options": ["Intel i5", "Intel i7", "AMD Ryzen 5"]
              }
            ]
          }
        ]
      }
    ]
  }
]
```

---

## Supabase Bağlantı Bilgileri

```env
# .env.local'a eklenecek
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJI...
```

---

## Kurulum Adımları

1. Supabase Dashboard'da yeni proje oluştur
2. SQL Editor'den yukarıdaki CREATE TABLE sorgularını çalıştır
3. `.env.local`'a URL ve Key'leri ekle
4. `npm install @supabase/supabase-js`
5. Projeyi yeniden başlat
