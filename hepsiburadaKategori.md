Kategori Özelliklerini Alma
get
https://mpop-sit.hepsiburada.com/product/api/categories/{categoryId}/attributes


Bu metod ile Hepsiburada’ daki uç kategorilerin özellik bilgilerini alabilirsiniz. Kategori özellikleri, sadece ‘leaf’ ve ‘available’ değerleri ‘true’ olan kategorilerde mevcuttur.
Detaylı notlar

Recipes
Kategori bazındaki alanların ve değerlerinin alınması
Open Recipe
Recent Requests
Log in to see full request history
Time	Status	User Agent	
Make a request to see history.
0 Requests This Month

Path Params
categoryId
int32
required
Kategori id'si

Query Params
modifiedAtSince
date-time
Verilen tarihinden günümüze kadar olan tarihlerde update edilmiş kayıtlar için işlem yapar. Versiyon 2 gönderilirse geçerlidir ve versiyon 2 ise doldurulması zorunlu

version
integer
Defaults to 2
Versiyon

2
Headers
User-Agent
string
Responses

200
Successfully retrieved all attributes by category


400
Invalid request data


401
Unauthorized access


500
Internal server error