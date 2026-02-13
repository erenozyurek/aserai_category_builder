import { Category } from "@/types/category";

export const trendyolCategories: Category[] = [
  {
    id: "ty-1",
    name: "Elektronik",
    parentId: null,
    children: [
      {
        id: "ty-1-1",
        name: "Bilgisayar",
        parentId: "ty-1",
        children: [
          {
            id: "ty-1-1-1",
            name: "Dizüstü Bilgisayar",
            parentId: "ty-1-1",
            attributes: [
              { id: "ty-a1", name: "İşlemci", type: "select", required: true, options: ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M2", "Apple M3"] },
              { id: "ty-a2", name: "RAM", type: "select", required: true, options: ["8 GB", "16 GB", "32 GB", "64 GB"] },
              { id: "ty-a3", name: "Depolama", type: "select", required: true, options: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD"] },
              { id: "ty-a4", name: "Ekran Boyutu", type: "select", required: true, options: ["13.3 inç", "14 inç", "15.6 inç", "16 inç", "17.3 inç"] },
              { id: "ty-a5", name: "Garanti Süresi", type: "select", required: false, options: ["1 Yıl", "2 Yıl", "3 Yıl"] },
            ],
          },
          {
            id: "ty-1-1-2",
            name: "Masaüstü Bilgisayar",
            parentId: "ty-1-1",
            attributes: [
              { id: "ty-a6", name: "İşlemci", type: "select", required: true, options: ["Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 5", "AMD Ryzen 7"] },
              { id: "ty-a7", name: "RAM", type: "select", required: true, options: ["8 GB", "16 GB", "32 GB", "64 GB", "128 GB"] },
              { id: "ty-a8", name: "Ekran Kartı", type: "select", required: false, options: ["RTX 4060", "RTX 4070", "RTX 4080", "RTX 4090", "RX 7900"] },
            ],
          },
        ],
      },
      {
        id: "ty-1-2",
        name: "Telefon",
        parentId: "ty-1",
        children: [
          {
            id: "ty-1-2-1",
            name: "Akıllı Telefon",
            parentId: "ty-1-2",
            attributes: [
              { id: "ty-a9", name: "Dahili Hafıza", type: "select", required: true, options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"] },
              { id: "ty-a10", name: "Ekran Boyutu", type: "select", required: true, options: ["6.1 inç", "6.5 inç", "6.7 inç", "6.9 inç"] },
              { id: "ty-a11", name: "Kamera", type: "select", required: false, options: ["12 MP", "48 MP", "50 MP", "108 MP", "200 MP"] },
              { id: "ty-a12", name: "İşletim Sistemi", type: "select", required: true, options: ["Android", "iOS"] },
            ],
          },
          {
            id: "ty-1-2-2",
            name: "Tuşlu Telefon",
            parentId: "ty-1-2",
            attributes: [
              { id: "ty-a13", name: "Batarya", type: "select", required: true, options: ["1000 mAh", "1500 mAh", "2000 mAh"] },
              { id: "ty-a14", name: "Çift SIM", type: "boolean", required: false },
            ],
          },
        ],
      },
      {
        id: "ty-1-3",
        name: "Tablet",
        parentId: "ty-1",
        children: [
          {
            id: "ty-1-3-1",
            name: "Android Tablet",
            parentId: "ty-1-3",
            attributes: [
              { id: "ty-a15", name: "Ekran Boyutu", type: "select", required: true, options: ["8 inç", "10 inç", "11 inç", "12.4 inç"] },
              { id: "ty-a16", name: "RAM", type: "select", required: true, options: ["4 GB", "6 GB", "8 GB", "12 GB"] },
            ],
          },
          {
            id: "ty-1-3-2",
            name: "iPad",
            parentId: "ty-1-3",
            attributes: [
              { id: "ty-a17", name: "Model", type: "select", required: true, options: ["iPad", "iPad Air", "iPad Pro", "iPad Mini"] },
              { id: "ty-a18", name: "Depolama", type: "select", required: true, options: ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB", "2 TB"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ty-2",
    name: "Giyim & Moda",
    parentId: null,
    children: [
      {
        id: "ty-2-1",
        name: "Kadın Giyim",
        parentId: "ty-2",
        children: [
          {
            id: "ty-2-1-1",
            name: "Elbise",
            parentId: "ty-2-1",
            attributes: [
              { id: "ty-a19", name: "Beden", type: "select", required: true, options: ["XS", "S", "M", "L", "XL", "XXL"] },
              { id: "ty-a20", name: "Renk", type: "select", required: true, options: ["Siyah", "Beyaz", "Kırmızı", "Mavi", "Yeşil", "Pembe"] },
              { id: "ty-a21", name: "Kumaş", type: "select", required: false, options: ["Pamuk", "Polyester", "Viskon", "Keten", "İpek"] },
              { id: "ty-a22", name: "Boy", type: "select", required: false, options: ["Mini", "Midi", "Maxi"] },
            ],
          },
          {
            id: "ty-2-1-2",
            name: "Tişört",
            parentId: "ty-2-1",
            attributes: [
              { id: "ty-a23", name: "Beden", type: "select", required: true, options: ["XS", "S", "M", "L", "XL"] },
              { id: "ty-a24", name: "Renk", type: "select", required: true, options: ["Siyah", "Beyaz", "Gri", "Lacivert"] },
            ],
          },
        ],
      },
      {
        id: "ty-2-2",
        name: "Erkek Giyim",
        parentId: "ty-2",
        children: [
          {
            id: "ty-2-2-1",
            name: "Pantolon",
            parentId: "ty-2-2",
            attributes: [
              { id: "ty-a25", name: "Beden", type: "select", required: true, options: ["28", "30", "32", "34", "36", "38"] },
              { id: "ty-a26", name: "Renk", type: "select", required: true, options: ["Siyah", "Lacivert", "Gri", "Bej", "Haki"] },
              { id: "ty-a27", name: "Kumaş", type: "select", required: false, options: ["Denim", "Keten", "Pamuk", "Polyester"] },
            ],
          },
          {
            id: "ty-2-2-2",
            name: "Gömlek",
            parentId: "ty-2-2",
            attributes: [
              { id: "ty-a28", name: "Beden", type: "select", required: true, options: ["S", "M", "L", "XL", "XXL"] },
              { id: "ty-a29", name: "Yaka Tipi", type: "select", required: false, options: ["Klasik", "Düğmeli", "İtalyan"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "ty-3",
    name: "Ev & Yaşam",
    parentId: null,
    children: [
      {
        id: "ty-3-1",
        name: "Mobilya",
        parentId: "ty-3",
        children: [
          {
            id: "ty-3-1-1",
            name: "Koltuk",
            parentId: "ty-3-1",
            attributes: [
              { id: "ty-a30", name: "Kişilik", type: "select", required: true, options: ["2'li", "3'lü", "L Koltuk", "Köşe Takımı"] },
              { id: "ty-a31", name: "Renk", type: "select", required: true, options: ["Gri", "Bej", "Kahverengi", "Lacivert"] },
              { id: "ty-a32", name: "Malzeme", type: "select", required: false, options: ["Kumaş", "Deri", "Kadife"] },
            ],
          },
          {
            id: "ty-3-1-2",
            name: "Yatak",
            parentId: "ty-3-1",
            attributes: [
              { id: "ty-a33", name: "Boyut", type: "select", required: true, options: ["Tek Kişilik", "Çift Kişilik", "King Size"] },
              { id: "ty-a34", name: "Sertlik", type: "select", required: false, options: ["Yumuşak", "Orta", "Sert"] },
            ],
          },
        ],
      },
      {
        id: "ty-3-2",
        name: "Ev Tekstili",
        parentId: "ty-3",
        children: [
          {
            id: "ty-3-2-1",
            name: "Nevresim Takımı",
            parentId: "ty-3-2",
            attributes: [
              { id: "ty-a35", name: "Boyut", type: "select", required: true, options: ["Tek Kişilik", "Çift Kişilik"] },
              { id: "ty-a36", name: "Malzeme", type: "select", required: false, options: ["Pamuk", "Saten", "Ranforce"] },
            ],
          },
        ],
      },
    ],
  },
];

export const n11Categories: Category[] = [
  {
    id: "n11-1",
    name: "Elektronik & Teknoloji",
    parentId: null,
    children: [
      {
        id: "n11-1-1",
        name: "Bilgisayar & Notebook",
        parentId: "n11-1",
        children: [
          {
            id: "n11-1-1-1",
            name: "Notebook",
            parentId: "n11-1-1",
            attributes: [
              { id: "n11-a1", name: "Marka", type: "select", required: true, options: ["Asus", "Lenovo", "HP", "Dell", "Apple", "Monster", "MSI"] },
              { id: "n11-a2", name: "İşlemci Tipi", type: "select", required: true, options: ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M2"] },
              { id: "n11-a3", name: "Bellek", type: "select", required: true, options: ["8 GB", "16 GB", "32 GB"] },
              { id: "n11-a4", name: "Disk Kapasitesi", type: "select", required: true, options: ["256 GB", "512 GB", "1 TB"] },
            ],
          },
          {
            id: "n11-1-1-2",
            name: "Masaüstü PC",
            parentId: "n11-1-1",
            attributes: [
              { id: "n11-a5", name: "Kullanım Amacı", type: "select", required: false, options: ["Oyun", "Ofis", "Tasarım", "Genel"] },
              { id: "n11-a6", name: "İşlemci", type: "select", required: true, options: ["Intel i5", "Intel i7", "AMD Ryzen 5"] },
            ],
          },
        ],
      },
      {
        id: "n11-1-2",
        name: "Cep Telefonu",
        parentId: "n11-1",
        children: [
          {
            id: "n11-1-2-1",
            name: "Akıllı Telefon",
            parentId: "n11-1-2",
            attributes: [
              { id: "n11-a7", name: "Marka", type: "select", required: true, options: ["Apple", "Samsung", "Xiaomi", "Oppo", "Huawei"] },
              { id: "n11-a8", name: "Dahili Hafıza", type: "select", required: true, options: ["64 GB", "128 GB", "256 GB", "512 GB"] },
              { id: "n11-a9", name: "RAM", type: "select", required: true, options: ["4 GB", "6 GB", "8 GB", "12 GB"] },
            ],
          },
        ],
      },
      {
        id: "n11-1-3",
        name: "TV & Görüntü",
        parentId: "n11-1",
        children: [
          {
            id: "n11-1-3-1",
            name: "Televizyon",
            parentId: "n11-1-3",
            attributes: [
              { id: "n11-a10", name: "Ekran Boyutu", type: "select", required: true, options: ["32 inç", "43 inç", "50 inç", "55 inç", "65 inç", "75 inç"] },
              { id: "n11-a11", name: "Çözünürlük", type: "select", required: true, options: ["HD", "Full HD", "4K Ultra HD", "8K"] },
              { id: "n11-a12", name: "Panel Tipi", type: "select", required: false, options: ["LED", "OLED", "QLED", "Neo QLED"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "n11-2",
    name: "Giyim & Aksesuar",
    parentId: null,
    children: [
      {
        id: "n11-2-1",
        name: "Kadın",
        parentId: "n11-2",
        children: [
          {
            id: "n11-2-1-1",
            name: "Elbise",
            parentId: "n11-2-1",
            attributes: [
              { id: "n11-a13", name: "Beden", type: "select", required: true, options: ["XS", "S", "M", "L", "XL"] },
              { id: "n11-a14", name: "Renk", type: "select", required: true, options: ["Siyah", "Beyaz", "Kırmızı", "Mavi"] },
              { id: "n11-a15", name: "Desen", type: "select", required: false, options: ["Düz", "Çizgili", "Çiçekli", "Kareli"] },
            ],
          },
          {
            id: "n11-2-1-2",
            name: "Kazak",
            parentId: "n11-2-1",
            attributes: [
              { id: "n11-a16", name: "Beden", type: "select", required: true, options: ["S", "M", "L", "XL"] },
              { id: "n11-a17", name: "Yaka Tipi", type: "select", required: false, options: ["Bisiklet Yaka", "V Yaka", "Boğazlı"] },
            ],
          },
        ],
      },
      {
        id: "n11-2-2",
        name: "Erkek",
        parentId: "n11-2",
        children: [
          {
            id: "n11-2-2-1",
            name: "Kot Pantolon",
            parentId: "n11-2-2",
            attributes: [
              { id: "n11-a18", name: "Beden", type: "select", required: true, options: ["28", "30", "32", "34", "36"] },
              { id: "n11-a19", name: "Kalıp", type: "select", required: false, options: ["Slim Fit", "Regular Fit", "Loose Fit"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "n11-3",
    name: "Ev & Dekorasyon",
    parentId: null,
    children: [
      {
        id: "n11-3-1",
        name: "Aydınlatma",
        parentId: "n11-3",
        children: [
          {
            id: "n11-3-1-1",
            name: "Avize",
            parentId: "n11-3-1",
            attributes: [
              { id: "n11-a20", name: "Stil", type: "select", required: false, options: ["Modern", "Klasik", "Rustik", "Minimalist"] },
              { id: "n11-a21", name: "Ampul Sayısı", type: "select", required: true, options: ["1", "3", "5", "6", "8"] },
            ],
          },
        ],
      },
    ],
  },
];

export const hepsiburadaCategories: Category[] = [
  {
    id: "hb-1",
    name: "Bilgisayar",
    parentId: null,
    children: [
      {
        id: "hb-1-1",
        name: "Dizüstü Bilgisayar",
        parentId: "hb-1",
        children: [
          {
            id: "hb-1-1-1",
            name: "Gaming Laptop",
            parentId: "hb-1-1",
            attributes: [
              { id: "hb-a1", name: "Marka", type: "select", required: true, options: ["Monster", "MSI", "Asus ROG", "Lenovo Legion", "HP Omen"] },
              { id: "hb-a2", name: "İşlemci Nesli", type: "select", required: true, options: ["12. Nesil", "13. Nesil", "14. Nesil"] },
              { id: "hb-a3", name: "Ekran Kartı", type: "select", required: true, options: ["RTX 4050", "RTX 4060", "RTX 4070", "RTX 4080"] },
              { id: "hb-a4", name: "Ekran Yenileme Hızı", type: "select", required: false, options: ["60 Hz", "120 Hz", "144 Hz", "165 Hz", "240 Hz"] },
            ],
          },
          {
            id: "hb-1-1-2",
            name: "Ultrabook",
            parentId: "hb-1-1",
            attributes: [
              { id: "hb-a5", name: "Ağırlık", type: "select", required: false, options: ["1 kg altı", "1-1.5 kg", "1.5-2 kg"] },
              { id: "hb-a6", name: "Pil Ömrü", type: "select", required: false, options: ["8 saat", "10 saat", "12 saat", "15+ saat"] },
            ],
          },
        ],
      },
      {
        id: "hb-1-2",
        name: "Bilgisayar Bileşenleri",
        parentId: "hb-1",
        children: [
          {
            id: "hb-1-2-1",
            name: "Ekran Kartı",
            parentId: "hb-1-2",
            attributes: [
              { id: "hb-a7", name: "Bellek", type: "select", required: true, options: ["4 GB", "8 GB", "12 GB", "16 GB", "24 GB"] },
              { id: "hb-a8", name: "Çip Üreticisi", type: "select", required: true, options: ["NVIDIA", "AMD", "Intel"] },
            ],
          },
          {
            id: "hb-1-2-2",
            name: "RAM",
            parentId: "hb-1-2",
            attributes: [
              { id: "hb-a9", name: "Kapasite", type: "select", required: true, options: ["8 GB", "16 GB", "32 GB", "64 GB"] },
              { id: "hb-a10", name: "Tip", type: "select", required: true, options: ["DDR4", "DDR5"] },
              { id: "hb-a11", name: "Hız", type: "select", required: false, options: ["3200 MHz", "4800 MHz", "5600 MHz", "6000 MHz"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "hb-2",
    name: "Telefon & Aksesuar",
    parentId: null,
    children: [
      {
        id: "hb-2-1",
        name: "Cep Telefonu",
        parentId: "hb-2",
        children: [
          {
            id: "hb-2-1-1",
            name: "Android Telefon",
            parentId: "hb-2-1",
            attributes: [
              { id: "hb-a12", name: "Marka", type: "select", required: true, options: ["Samsung", "Xiaomi", "Oppo", "Realme", "Google Pixel"] },
              { id: "hb-a13", name: "Hafıza", type: "select", required: true, options: ["64 GB", "128 GB", "256 GB"] },
              { id: "hb-a14", name: "5G Desteği", type: "boolean", required: false },
            ],
          },
          {
            id: "hb-2-1-2",
            name: "iPhone",
            parentId: "hb-2-1",
            attributes: [
              { id: "hb-a15", name: "Model", type: "select", required: true, options: ["iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max", "iPhone 16", "iPhone 16 Pro"] },
              { id: "hb-a16", name: "Hafıza", type: "select", required: true, options: ["128 GB", "256 GB", "512 GB", "1 TB"] },
              { id: "hb-a17", name: "Renk", type: "select", required: true, options: ["Siyah", "Beyaz", "Mavi", "Doğal Titanyum", "Çöl Titanyum"] },
            ],
          },
        ],
      },
      {
        id: "hb-2-2",
        name: "Telefon Kılıfları",
        parentId: "hb-2",
        children: [
          {
            id: "hb-2-2-1",
            name: "iPhone Kılıf",
            parentId: "hb-2-2",
            attributes: [
              { id: "hb-a18", name: "Model Uyumu", type: "select", required: true, options: ["iPhone 14", "iPhone 15", "iPhone 15 Pro", "iPhone 16"] },
              { id: "hb-a19", name: "Malzeme", type: "select", required: false, options: ["Silikon", "Şeffaf", "Deri", "Zırh"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "hb-3",
    name: "Spor & Outdoor",
    parentId: null,
    children: [
      {
        id: "hb-3-1",
        name: "Spor Giyim",
        parentId: "hb-3",
        children: [
          {
            id: "hb-3-1-1",
            name: "Spor Ayakkabı",
            parentId: "hb-3-1",
            attributes: [
              { id: "hb-a20", name: "Numara", type: "select", required: true, options: ["38", "39", "40", "41", "42", "43", "44", "45"] },
              { id: "hb-a21", name: "Renk", type: "select", required: true, options: ["Siyah", "Beyaz", "Gri", "Lacivert"] },
              { id: "hb-a22", name: "Cinsiyet", type: "select", required: true, options: ["Kadın", "Erkek", "Unisex"] },
              { id: "hb-a23", name: "Kullanım Alanı", type: "select", required: false, options: ["Koşu", "Yürüyüş", "Fitness", "Günlük"] },
            ],
          },
          {
            id: "hb-3-1-2",
            name: "Eşofman Takımı",
            parentId: "hb-3-1",
            attributes: [
              { id: "hb-a24", name: "Beden", type: "select", required: true, options: ["S", "M", "L", "XL", "XXL"] },
              { id: "hb-a25", name: "Renk", type: "select", required: true, options: ["Siyah", "Gri", "Lacivert"] },
            ],
          },
        ],
      },
      {
        id: "hb-3-2",
        name: "Outdoor Ekipman",
        parentId: "hb-3",
        children: [
          {
            id: "hb-3-2-1",
            name: "Çadır",
            parentId: "hb-3-2",
            attributes: [
              { id: "hb-a26", name: "Kapasite", type: "select", required: true, options: ["2 Kişilik", "3 Kişilik", "4 Kişilik", "6 Kişilik"] },
              { id: "hb-a27", name: "Mevsim", type: "select", required: false, options: ["3 Mevsim", "4 Mevsim"] },
            ],
          },
        ],
      },
    ],
  },
];

// Initial empty Aserai categories
export const initialAseraiCategories: Category[] = [];
