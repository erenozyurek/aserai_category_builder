Kategori Ağacı Listeleme (GetCategories)

GET https://api.n11.com/cdn/categories

•	Authorization no auth seçiniz.
•	Headers alanına appkey ve appsecret bilgisini eklemeniz gerekir.
•	GetCategories kullanırken herhangi bir parametre gerekmemektedir.
•	Tüm n11 kategori ağacını tek istekle alabilmektesiniz.
•	Ürün açma servisinde en alt kırılım olan kategori id değerleri iletilmelidir.
•	subCategories değerinin null dönmesi o kategorinin en alt kırılım olduğunu ifade etmektedir.



























Kategori Özellikleri Listeleme (GetCategoryAttributesList)

GET https://api.n11.com/cdn/category/{categoryId}/attribute 
•	Authorization no auth seçiniz.
•	Headers alanına appkey ve appsecret bilgisini eklemeniz gerekir.
•	HTTP isteğinizi 'GET' methoduyla ilgili endpoint'e gönderin.
•	Bu serviste Request parametre yer almamaktadır, endpoint içerisindeki categoryId değerine göre kategori özelinde listeleme yapılmaktadır.
 
Dikkat Edilmesi Gerekenler;

•	Endpoint içerisinde yer alan {categoryId} alanını GetCategories servisinden GET : https://api.n11.com/cdn/categories requesti ile çağırdığınız kategori listesinde yer alan “id” parametresindeki değer ile değiştirerek ilgili kategori attributelerini listeleyebilirsiniz.
•	Response body alanında ilgili kategoriye ait attribute id, attribute value ve attribute value id bilgilerini görüntüleyebilirsiniz.
•	isMandatory : true olan attributeleri zorunludur, CreatProduct servisinde ürün bazlı göndermeniz gerekmektedir.
•	isVariant : true olan attribute için CreateProduct servisinde ürünlere aynı productMainId eklenirse aynı sayfada ürün seçeneği şeklinde gözükür.


Örnek Request

GET https://api.n11.com/cdn/category/1002571/attribute

Örnek Response
 
{
    "id": 1002571,
    "name": "Makyaj Çantası",
    "categoryAttributes": [
        {
            "attributeId": 1,
            "categoryId": 1002571,
            "attributeName": "Marka",
            "isMandatory": true,
            "isVariant": false,
            "isSlicer": false,
            "isCustomValue": true,
            "isN11Grouping": false,
            "attributeOrder": 1000,
            "attributeValues": [
                {
                    "id": 8372688,
                    "value": "Abay"
                },
                {
                    "id": 6655098,
                    "value": "Abbagift"
                },
                {
                    "id": 1229210,
                    "value": "Albatros"
                }
            ]
        },
        {
            "attributeId": 429,
            "categoryId": 1002571,
            "attributeName": "Renk",
            "isMandatory": true,
            "isVariant": true,
            "isSlicer": true,
            "isCustomValue": true,
            "isN11Grouping": false,
            "attributeOrder": 102,
            "attributeValues": [
                {
                    "id": 8773717,
                    "value": "Ahşap Rengi"
                },
                {
                    "id": 2523534,
                    "value": "Altın"
                },
                {
                    "id": 8773712,
                    "value": "Altın - Beyaz"
                }
            ]
        }
    ]
}








