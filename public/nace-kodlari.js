const naceListesi = [
    {
        "kod": "01.11.07",
        "tanim": "Baklagillerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.11.12",
        "tanim": "Tahıl yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.11.14",
        "tanim": "Yağlı tohum yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.12.14",
        "tanim": "Çeltik (kabuklu pirinç) yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.17",
        "tanim": "Şeker pancarı yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.18",
        "tanim": "Yenilebilir kök ve yumruların yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.19",
        "tanim": "Diğer sebze tohumlarının yetiştiriciliği (şeker pancarı tohumu dahil, diğer pancar tohumları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.20",
        "tanim": "Meyvesi yenen sebzelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.21",
        "tanim": "Mantar ve yer mantarları (domalan) yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.22",
        "tanim": "Kökleri, soğanları, yumruları tüketilen sebzelerin ve diğer benzer sebzelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.13.23",
        "tanim": "Yapraklı veya saplı sebzelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.14.01",
        "tanim": "Şeker kamışı yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.15.01",
        "tanim": "Tütün yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.16.02",
        "tanim": "Pamuk yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.16.90",
        "tanim": "Diğer lifli bitkilerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.19.01",
        "tanim": "Hayvan yemi bitkilerinin yetiştirilmesi (şeker pancarı tohumları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.19.02",
        "tanim": "Çiçek yetiştirilmesi (lale, kasımpatı, zambak, gül vb. ile bunların tohumları)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.19.99",
        "tanim": "Başka yerde sınıflandırılmamış tek yıllık diğer bitkisel ürünlerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.21.05",
        "tanim": "Üzüm yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.22.05",
        "tanim": "Tropikal ve subtropikal meyvelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.23.02",
        "tanim": "Turunçgillerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.24.04",
        "tanim": "Yumuşak çekirdekli meyvelerin ve sert çekirdekli meyvelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.25.09",
        "tanim": "Fındık yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.25.90",
        "tanim": "Diğer ağaç ve çalı (çok yıllık bitkilerin) meyvelerinin ve sert kabuklu meyvelerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.26.02",
        "tanim": "Zeytin yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.26.90",
        "tanim": "Diğer yağlı meyvelerin yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.27.02",
        "tanim": "Çay yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.27.90",
        "tanim": "İçecek üretiminde kullanılan diğer bitkisel ürünlerin yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.28.01",
        "tanim": "Baharatlık, aromatik (ıtırlı), uyuşturucu nitelikte ve farmasötik (eczacılıkla ilgili) bitkisel ürünlerin yetiştirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.29.01",
        "tanim": "Diğer çok yıllık (uzun ömürlü) bitkisel ürünlerin yetiştirilmesi (Kauçuk ağacı, yılbaşı ağacı, örgü, dolgu ve tabaklama yapmak için kullanılan bitkisel ürünler vb. uzun ömürlü bitkisel ürünlerin yetiştirilmesi)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.30.03",
        "tanim": "Dikim için sebze fidesi, meyve fidanı vb. yetiştirilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "01.30.90",
        "tanim": "Dikim için çiçek ve diğer bitkilerin yetiştirilmesi (dekoratif amaçlarla bitki ve çim yetiştirilmesi dahil, sebze fidesi, meyve fidanı hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "01.41.31",
        "tanim": "Sütü sağılan büyükbaş hayvan yetiştiriciliği (sütü için inek ve manda yetiştiriciliği)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.42.09",
        "tanim": "Diğer sığır ve manda yetiştiriciliği (sütü için yetiştirilenler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.43.01",
        "tanim": "At ve at benzeri diğer hayvan yetiştiriciliği (eşek, katır veya bardo vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.44.01",
        "tanim": "Deve ve devegillerin yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.45.01",
        "tanim": "Koyun ve keçi (davar) yetiştiriciliği (işlenmemiş süt, kıl, tiftik, yapağı, yün vb. üretimi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.46.01",
        "tanim": "Domuz yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.47.01",
        "tanim": "Kümes hayvanlarının yetiştirilmesi (tavuk, hindi, ördek, kaz ve beç tavuğu vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.47.02",
        "tanim": "Kuluçkahanelerin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.47.03",
        "tanim": "Kümes hayvanlarından yumurta üretilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.48.01",
        "tanim": "Arıcılık, bal ve bal mumu üretilmesi (arı sütü dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.48.02",
        "tanim": "İpekböceği yetiştiriciliği ve koza üretimi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.48.03",
        "tanim": "Evcil hayvanların yetiştirilmesi ve üretilmesi (balık hariç) (kedi, köpek, kuşlar, hamsterler vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.48.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer hayvan yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.50.06",
        "tanim": "Karma çiftçilik",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.61.01",
        "tanim": "Bitkisel üretimi destekleyici gübreleme, tarlanın sürülmesi, ekilmesi, çapalama ile meyvecilikle ilgili budama vb. faaliyetler (çiçek yetiştiriciliğini destekleyici faaliyetler ile hava yoluyla yapılan gübreleme hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.61.02",
        "tanim": "Bitkisel üretimi destekleyici mahsulün hasat ve harmanlanması, biçilmesi, balyalanması, biçerdöver işletilmesi vb. faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.61.03",
        "tanim": "Bitkisel üretimi destekleyici tarımsal amaçlı sulama faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.61.04",
        "tanim": "Bitkisel üretimi destekleyici ilaçlama ve zirai mücadele faaliyetleri (zararlı otların imhası dahil, hava yoluyla yapılanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "01.61.05",
        "tanim": "Çiçek yetiştiriciliğini destekleyici gübreleme, tarlanın sürülmesi, ekilmesi, bakımı, toplama vb. ile ilgili faaliyetler (hava yoluyla yapılan gübreleme hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.61.06",
        "tanim": "Hava yoluyla yapılan bitkisel üretimi destekleyici gübreleme, ilaçlama ve zirai mücadele faaliyetleri (zararlı otların imhası dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "01.62.01",
        "tanim": "Hayvan üretimini destekleyici olarak sürülerin güdülmesi, başkalarına ait hayvanların beslenmesi, kümeslerin temizlenmesi, kırkma, sağma, barınak sağlama, nalbantlık vb. faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.62.02",
        "tanim": "Hayvan üretimini destekleyici olarak sürü testi, kümes hayvanlarının kısırlaştırılması, yapay dölleme, vb. faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.01",
        "tanim": "Hasat sonrası diğer ürünlerin ayıklanması ve temizlenmesi ile ilgili faaliyetler (pamuğun çırçırlanması ve nişastalı kök ürünleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.02",
        "tanim": "Sert kabuklu ürünlerin kabuklarının kırılması ve temizlenmesi ile ilgili faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.03",
        "tanim": "Haşhaş vb. ürünlerin sürtme, ezme ve temizlenmesi ile ilgili faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.04",
        "tanim": "Mısır vb. ürünlerin tanelenmesi ve temizlenmesi ile ilgili faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.05",
        "tanim": "Tütünün sınıflandırılması, balyalanması vb. hizmetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "01.63.06",
        "tanim": "Nişastalı kök ürünlerinin ayıklanması ve temizlenmesi (patates vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.07",
        "tanim": "Çırçırlama faaliyeti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.08",
        "tanim": "Üretim amaçlı tohum işleme hizmetleri (vernelizasyon işlemleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.63.90",
        "tanim": "Hasat sonrası bitkisel ürünler ile ilgili diğer faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.70.01",
        "tanim": "Ticari olmayan av hayvanı ve yabani hayvan avlama ve yakalama faaliyetleri (yenilmesi, kürkleri, derileri, araştırmalarda kullanılmaları vb. amaçlar için) (balıkçılık hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "01.70.02",
        "tanim": "Ticari olan av hayvanı ve yabani hayvan avlama ve yakalama faaliyetleri (yenilmesi, kürkleri, derileri, araştırmalarda kullanılmaları vb. amaçlar için) (balıkçılık hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.10.01",
        "tanim": "Baltalık olarak işletilen ormanların yetiştirilmesi (kağıtlık ve yakacak odun üretimine yönelik olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.10.02",
        "tanim": "Orman yetiştirmek için fidan ve tohum üretimi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "02.10.03",
        "tanim": "Orman ağaçlarının yetiştirilmesi (baltalık ormanların yetiştirilmesi hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "02.20.01",
        "tanim": "Endüstriyel ve yakacak odun üretimi (geleneksel yöntemlerle odun kömürü üretimi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.30.01",
        "tanim": "Tabii olarak yetişen odun dışı orman ürünlerinin toplanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "02.40.01",
        "tanim": "Ormanda ağaçların kesilmesi, dallarından temizlenmesi, soyulması vb. destekleyici faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.40.02",
        "tanim": "Ormanda kesilmiş ve temizlenmiş ağaçların taşınması, istiflenmesi ve yüklenmesi faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.40.03",
        "tanim": "Ormanda silvikültürel hizmet faaliyetleri (seyreltilmesi, budanması, repikaj vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.40.04",
        "tanim": "Ormanı zararlılara (böcek ve hastalıklar) karşı koruma faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "02.40.05",
        "tanim": "Ormanı yangın ve kaçak kesime (izinsiz kesim) karşı koruma faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.40.06",
        "tanim": "Ormanı koruma ve bakım amaçlı orman yolu yapımı ve bakımı faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "02.40.90",
        "tanim": "Diğer ormancılık hizmet faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "03.11.01",
        "tanim": "Deniz ve kıyı sularında yapılan balıkçılık (gırgır balıkçılığı, dalyancılık dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.11.02",
        "tanim": "Deniz kabuklularının (midye, ıstakoz vb.), yumuşakçaların, diğer deniz canlıları ve ürünlerinin toplanması (sedef, doğal inci, sünger, mercan, deniz yosunu, vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "03.12.01",
        "tanim": "Tatlı su balıklçılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.21.01",
        "tanim": "Denizde yapılan balık yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.21.02",
        "tanim": "Denizde yapılan diğer su ürünleri yetiştiriciliği",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.22.01",
        "tanim": "Tatlı sularda yapılan balık yetiştiriciliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "03.22.02",
        "tanim": "Tatlısu ürünleri yetiştiriciliği (balık hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.30.01",
        "tanim": "Balıkçılık ve su ürünleri yetiştiriciliği için destekleyici faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "03.30.02",
        "tanim": "Balık kafeslerinin onarım ve bakım hizmeti faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "05.10.01",
        "tanim": "Taş kömürü madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "05.10.02",
        "tanim": "Taş kömürü madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "05.20.01",
        "tanim": "Linyit madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "05.20.02",
        "tanim": "Linyit madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "06.10.01",
        "tanim": "Ham petrol çıkarımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "06.20.01",
        "tanim": "Doğal gaz çıkarımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.10.01",
        "tanim": "Demir cevheri madenciliği (sinterlenmiş demir cevheri üretimi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.10.02",
        "tanim": "Demir cevheri madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.01",
        "tanim": "Katran ve zift ihtiva eden cevherlerden uranyum metalinin ayrıştırılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.02",
        "tanim": "Katran ve zift ihtiva eden cevherlerden toryum metalinin ayrıştırılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.03",
        "tanim": "Uranyum madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.04",
        "tanim": "Toryum madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.05",
        "tanim": "Sarı pasta (U3O8) imalatı (uranyum cevherinden elde edilen)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.21.06",
        "tanim": "Uranyum ve toryum cevheri madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.01",
        "tanim": "Altın, gümüş, platin gibi değerli metal madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.02",
        "tanim": "Alüminyum madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.03",
        "tanim": "Bakır madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.04",
        "tanim": "Nikel madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.05",
        "tanim": "Kurşun, çinko ve kalay madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.06",
        "tanim": "Krom madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.08",
        "tanim": "Diğer demir dışı metal cevherleri madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "07.29.99",
        "tanim": "Başka yerde sınıflandırılmamış demir dışı diğer metal cevherleri madenciliği (cıva, manganez, kobalt, molibden, tantal, vanadyum vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.01",
        "tanim": "Mermer ocakçılığı (traverten dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.02",
        "tanim": "Granit ocakçılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.03",
        "tanim": "Yapı taşları ocakçılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.04",
        "tanim": "Süsleme ve yapı taşlarının kırılması ve kabaca kesilmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.05",
        "tanim": "Dolomit ve kayağan taşı (arduvaz / kayraktaşı) ocakçılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.06",
        "tanim": "Kireçtaşı (kalker) ocakçılığı (kireçtaşının kabaca kırılması ve parçalanması dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.07",
        "tanim": "Tebeşir, alçıtaşı ve anhidrit ocakçılığı (çıkarma, parçalama, pişirme işlemi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.11.08",
        "tanim": "Süsleme ve yapı taşları ile kireç taşı, alçı taşı, tebeşir ve kayağantaşı (arduvaz-kayraktaşı) ocakçılığı için taş ocağı sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.12.01",
        "tanim": "Çakıl ve kum ocakçılığı (taşların kırılması ile kil ve kaolin madenciliği hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.12.02",
        "tanim": "Çakıl taşlarının kırılması ve parçalanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.12.03",
        "tanim": "Kil, refrakter kil ve kaolin madenciliği ile bentonit, andaluzit, siyanit, silimanit, mulit, şamot veya dinas toprakları çıkarımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.12.04",
        "tanim": "Çakıl ve kum ocaklarının faaliyetleri ve kil ve kaolin çıkarımı için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.01",
        "tanim": "Kimyasal ve gübreleme amaçlı mineral madenciliği (bor, kükürt madenciliği hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.02",
        "tanim": "Bor mineralleri madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.03",
        "tanim": "Kükürt madenciliği (ocakçılığı)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.04",
        "tanim": "Guano madenciliği (kuş gübresi, güherçile dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.05",
        "tanim": "Kehribar, oltu taşı ve lületaşı ocakçılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.91.06",
        "tanim": "Kimyasal ve gübreleme amaçlı mineral madenciliği için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.92.01",
        "tanim": "Turba çıkarılması ve toplanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.92.02",
        "tanim": "Turba çıkarımı için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.93.01",
        "tanim": "Kaya tuzunun çıkarımı (tuzun elenmesi ve kırılması dahil) (tuzun yemeklik tuza dönüştürülmesi hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.93.02",
        "tanim": "Deniz, göl ve kaynak tuzu üretimi (tuzun yemeklik tuza dönüştürülmesi hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "08.93.03",
        "tanim": "Tuz çıkarımı için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.01",
        "tanim": "Aşındırıcı (törpüleyici) materyaller (zımpara), amyant, silisli fosil artıklar, arsenik cevherleri, sabuntaşı (talk) ve feldispat madenciliği (kuartz, mika, şist, talk, silis, sünger taşı, asbest, doğal korindon vb.)",
        "sinif": "Çok Tehlikeli *"
    },
    {
        "kod": "08.99.02",
        "tanim": "Doğal asfalt, asfaltit, asfaltlı taş (doğal katı zift) ve bitüm madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.03",
        "tanim": "Kıymetli ve yarı kıymetli taşların ocakçılığı (kehribar, Oltu taşı, lüle taşı ve elmas hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.04",
        "tanim": "Grafit ocakçılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.05",
        "tanim": "Elmas (endüstri elmasları dahil) madenciliği",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.06",
        "tanim": "Başka yerde sınıflandırılmamış diğer madencilik ve taş ocakçılığı için maden sahasının hazırlanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "08.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer madencilik ve taş ocakçılığı (elmas, grafit vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "09.10.01",
        "tanim": "Doğalgazın sıvılaştırılması ve gaz haline getirilmesi (maden alanında gerçekleştirilenler)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "09.10.02",
        "tanim": "Petrol ve gaz çıkarımıyla ilgili sondaj hizmetleri (tetkik, araştırma hizmetleri, jeolojik gözlemler, kuyu çalıştırılması ve kapatılması ile test amaçlı sondaj faaliyetleri vb. dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "09.10.03",
        "tanim": "Petrol ve gaz çıkarımı ile ilgili vinç ve sondaj kulesi kurma, onarım, sökme vb. hizmet faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "09.90.01",
        "tanim": "Madencilik ve taş ocakçılığını destekleyici diğer hizmet faaliyetleri (test amaçlı sondaj faaliyetleri ile petrol ve doğalgaz için yapılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "09.90.02",
        "tanim": "Madencilik ve taş ocakçılığını destekleyici test amaçlı sondaj faaliyetleri (petrol ve doğalgaz için yapılanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "10.11.01",
        "tanim": "Etin işlenmesi ve saklanması (mezbahacılık) (kümes hayvanlarının eti hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.12.01",
        "tanim": "Kümes hayvanları etlerinin üretimi (taze veya dondurulmuş) (yenilebilir sakatatları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.12.02",
        "tanim": "Kümes hayvanlarının kesilmesi, temizlenmesi veya paketlenmesi işi ile uğraşan mezbahaların faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.12.03",
        "tanim": "Kümes hayvanlarının yağlarının sofra yağına çevrilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.12.04",
        "tanim": "Kuş tüyü ve ince kuş tüyü imalatı (derileri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.13.01",
        "tanim": "Et ve kümes hayvanları etlerinden üretilen pişmemiş köfte vb. ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.13.02",
        "tanim": "Et ve kümes hayvanları etlerinden üretilen sosis, salam, sucuk, pastırma, kavurma et, konserve et, salamura et, jambon vb. tuzlanmış, kurutulmuş veya tütsülenmiş ürünlerin imalatı (yemek olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.13.03",
        "tanim": "Et ve sakatat unları imalatı (et ve kümes hayvanları etlerinden üretilen)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.13.04",
        "tanim": "Sığır, koyun, keçi vb. hayvanların sakatat ve yağlarından yenilebilir ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.03",
        "tanim": "Balıkların, kabuklu deniz hayvanlarının ve yumuşakçaların işlenmesi ve saklanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.04",
        "tanim": "Balık, kabuklu deniz hayvanı ve yumuşakça ürünlerinin üretimi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.05",
        "tanim": "Balık unları, kaba unları ve peletlerinin üretilmesi (insan tüketimi için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.06",
        "tanim": "Balığın sadece işlenmesi ve saklanmasıyla ilgili faaliyet gösteren tekne ve gemilerin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.07",
        "tanim": "Pişirilmemiş balık yemekleri imalatı (mayalanmış balık, balık hamuru, balık köftesi vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.20.08",
        "tanim": "Balıkların, kabukluların, yumuşakçaların veya diğer su omurgasızlarının unları, kaba unları ve peletlerinin üretimi (insan tüketimine uygun olmayan) ile bunların diğer yenilemeyen ürünlerinin üretimi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.31.01",
        "tanim": "Patatesin işlenmesi ve saklanması (dondurulmuş, kurutulmuş, suyu çıkartılmış, ezilmiş patates imalatı) (soyulması dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.31.02",
        "tanim": "Patates cipsi, patates çerezi, patates unu ve kaba unlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.32.01",
        "tanim": "Katkısız sebze ve meyve suları imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.32.02",
        "tanim": "Konsantre meyve ve sebze suyu imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.01",
        "tanim": "Sebze ve meyve konservesi imalatı (salça, domates püresi dahil, patatesten olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.39.02",
        "tanim": "Kavrulmuş, tuzlanmış vb. şekilde işlem görmüş sert kabuklu yemişler ile bu meyvelerin püre ve ezmelerinin imalatı (pişirilerek yapılanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.03",
        "tanim": "Meyve ve sebzelerden jöle, pekmez, marmelat, reçel vb. imalatı (pestil imalatı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.04",
        "tanim": "Tuzlu su, sirke, sirkeli su, yağ veya diğer koruyucu çözeltilerle korunarak saklanan sebze ve meyvelerin imalatı (turşu, salamura yaprak, sofralık zeytin vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.05",
        "tanim": "Dondurulmuş veya kurutulmuş meyve ve sebzelerin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.06",
        "tanim": "Leblebi imalatı ile kavrulmuş çekirdek, yerfıstığı vb. üretimi (sert kabuklular hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.39.07",
        "tanim": "Susamın işlenmesi ve tahin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.39.99",
        "tanim": "Başka yerde sınıflandırılmamış meyve ve sebzelerin başka yöntemlerle işlenmesi ve saklanması (kesilmiş ve paketlenmiş olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.41.01",
        "tanim": "Ayçiçek yağı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.02",
        "tanim": "Bitkisel sıvı yağ (yenilebilen) imalatı (soya, susam, haşhaş, pamuk, fındık, kolza, hardal vb. yağlar) (zeytin yağı, ayçiçeği yağı ve mısır yağı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.03",
        "tanim": "Beziryağı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.05",
        "tanim": "Prina yağı imalatı (diğer küspelerden elde edilen yağlar dahil) (mısır yağı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.06",
        "tanim": "Kakao yağı, badem yağı, kekik yağı, defne yağı, hurma çekirdeği veya babassu yağı, keten tohumu yağı, Hint yağı, tung yağı ve diğer benzer yağların imalatı (bezir yağı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.07",
        "tanim": "Zeytinyağı imalatı (saf, sızma, rafine)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.10",
        "tanim": "Balık ve deniz memelilerinden yağ elde edilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.41.11",
        "tanim": "Domuz don yağı (stearin), domuz sıvı yağı, oleostarin, oleoil ve yenilemeyen sıvı don yağı (tallow oil) ile diğer hayvansal katı ve sıvı yağların imalatı (işlenmemiş)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.42.01",
        "tanim": "Margarin ve benzeri yenilebilir katı yağların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.51.01",
        "tanim": "Süt imalatı, işlenmiş (pastörize edilmiş, sterilize edilmiş, homojenleştirilmiş ve/veya yüksek ısıdan geçirilmiş) (katı veya toz halde süt hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.51.02",
        "tanim": "Peynir, lor ve çökelek imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.51.03",
        "tanim": "Süt tozu, peynir özü (kazein), süt şekeri (laktoz) ve peynir altı suyu (kesilmiş sütün suyu) imalatı (katı veya toz halde süt, krema dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.51.04",
        "tanim": "Süt temelli hafif içeceklerin imalatı (kefir, salep vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.51.90",
        "tanim": "Sütten yapılan diğer ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.52.01",
        "tanim": "Dondurma imalatı (sade, sebzeli, meyveli vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.52.02",
        "tanim": "Şerbetli diğer yenilebilen buzlu gıdaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.61.01",
        "tanim": "Kahvaltılık tahıl ürünleri ile diğer taneli tahıl ürünlerinin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.61.02",
        "tanim": "Tahılların öğütülmesi ve un imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.61.05",
        "tanim": "Pirinç, pirinç ezmesi ve pirinç unu imalatı (çeltik fabrikası ve ürünleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.61.06",
        "tanim": "İrmik imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.61.07",
        "tanim": "Ön pişirme yapılmış veya başka şekilde hazırlanmış tane halde hububat imalatı (bulgur dahil, mısır hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.61.08",
        "tanim": "Sebzelerin ve baklagillerin öğütülmesi ve sebze unu ile ezmelerinin imalatı (karışımları ile hazır karıştırılmış sebze unları dahil) (pişirilerek yapılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.61.09",
        "tanim": "Fırıncılık ürünlerinin imalatında kullanılan hamur ve un karışımlarının imalatı (sebze un karışımları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.61.90",
        "tanim": "Dövülmüş diğer tahıl ürünlerinin imalatı (bulgur ve irmik hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.62.01",
        "tanim": "Nişasta imalatı (buğday, pirinç, patates, mısır, manyok vb. ürünlerden)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.62.02",
        "tanim": "Glikoz, glikoz şurubu, fruktoz, maltoz, inulin, vb. imalatı (invert şeker dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.62.04",
        "tanim": "Yaş mısırın öğütülmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.62.05",
        "tanim": "Glüten imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.62.06",
        "tanim": "Mısır yağı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.71.01",
        "tanim": "Taze pastane ürünleri imalatı (yaş pasta, kuru pasta, poğaça, kek, börek, pay, turta, waffles vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.71.02",
        "tanim": "Ekmek imalatı (sade pide dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.71.03",
        "tanim": "Hamur tatlıları imalatı (tatlandırılmış kadayıf, lokma tatlısı, baklava vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.71.04",
        "tanim": "Simit imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.72.01",
        "tanim": "Peksimet, bisküvi, gofret, dondurma külahı, kağıt helva vb. ürünlerin imalatı (çikolata kaplı olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.72.02",
        "tanim": "Tatlı veya tuzlu hafif dayanıklı fırın ve pastane ürünlerinin imalatı (kurabiyeler, krakerler, galeta, gevrek halkalar vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.72.03",
        "tanim": "Tatlandırılmamış dayanıklı hamur tatlıları imalatı (pişirilmiş olsun olmasın tatlandırılmamış kadayıf, baklava vb.) (yufka imalatı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.81.01",
        "tanim": "Şeker kamışından, pancardan, palmiyeden, akça ağaçtan şeker (sakkaroz) ve şeker ürünleri imalatı veya bunların rafine edilmesi (sıvı şeker ve melas üretimi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.81.03",
        "tanim": "Akçaağaç şurubu imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.82.01",
        "tanim": "Çikolata ve kakao içeren şekerlemelerin imalatı (beyaz çikolata ve sürülerek yenebilen kakaolu ürünler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.02",
        "tanim": "Şekerlemelerin ve şeker pastillerinin imalatı (bonbon şekeri vb.) (kakaolu şekerlemeler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.03",
        "tanim": "Sürülerek yenebilen kakaolu ürünlerin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.04",
        "tanim": "Lokum, pişmaniye, helva, karamel, koz helva, fondan, beyaz çikolata vb. imalatı (tahin helvası dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.05",
        "tanim": "Ciklet imalatı (sakız)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.06",
        "tanim": "Sert kabuklu yemiş, meyve, meyve kabuğu ve diğer bitki parçalarından şekerleme imalatı (meyan kökü hülasaları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.82.07",
        "tanim": "Kakao tozu, kakao ezmesi/hamuru ve kakao yağı imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.83.01",
        "tanim": "Çay ürünleri imalatı (siyah çay, yeşil çay ve poşet çay ile çay ekstre, esans ve konsantreleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.83.02",
        "tanim": "Kahve ürünleri imalatı (çekilmiş kahve, çözünebilir kahve ile kahve ekstre, esans ve konsantreleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.83.03",
        "tanim": "Bitkisel çayların imalatı (nane, yaban otu, papatya, ıhlamur, kuşburnu vb. çaylar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.83.04",
        "tanim": "Kahve içeren ve kahve yerine geçebilecek ürünlerin imalatı (şeker, süt vb. karıştırılmış ürünler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.84.01",
        "tanim": "Baharat imalatı (karabiber, kırmızı toz/pul biber, hardal unu, tarçın, yenibahar, damla sakızı, baharat karışımları vb.) (işlenmiş)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.84.02",
        "tanim": "Sirke ve sirke ikamelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.84.03",
        "tanim": "Sos imalatı (soya sosu, ketçap, mayonez, hardal sosu, çemen, mango sosu vb.) (baharat, sirke ve salça hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.84.05",
        "tanim": "Gıda tuzu imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.85.01",
        "tanim": "Hazır yemek imalatı (vakumla paketlenmiş veya korunmuş olanlar) (lokanta ve catering hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.86.04",
        "tanim": "Homojenize gıda müstahzarları ve diyetetik gıdaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.89.01",
        "tanim": "Hazır çorba (geleneksel ve yöresel olarak imal edilenler dahil) ile hazır et suyu, balık suyu, tavuk suyu ve konsantrelerinin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.89.02",
        "tanim": "Maya ve kabartma tozu imalatı (bira mayası dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.89.04",
        "tanim": "Suni bal, karamela, kabuksuz yumurta, yumurta albümini vb. imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.89.05",
        "tanim": "Bitki özsu ve ekstreleri ile peptik maddeler, müsilaj ve kıvam arttırıcı maddelerin imalatı (kola konsantresi, malt özü, meyan balı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.89.99",
        "tanim": "Başka yerde sınıflandırılmamış çeşitli gıda ürünleri imalatı (çabuk bozulan hazır gıdalar, peynir fondüleri, renklendirilmiş/tatlandırılmış şeker şurupları vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "10.91.01",
        "tanim": "Çiftlik hayvanları için hazır yem imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "10.92.01",
        "tanim": "Ev hayvanları için hazır gıda imalatı (kedi ve köpek mamaları, kuş ve balık yemleri vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.01.01",
        "tanim": "Damıtılmış alkollü içeceklerin imalatı (viski, brendi, cin, likör, rakı, votka, kanyak vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "11.01.02",
        "tanim": "Damıtılmış alkollü içeceklerle karıştırılmış içki imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "11.01.03",
        "tanim": "Etil alkol üretimi (doğal özellikleri değiştirilmemiş/tağyir edilmemiş, alkol derecesi <%80)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "11.02.01",
        "tanim": "Üzümden şarap, köpüklü şarap, şampanya vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.02.02",
        "tanim": "Üzüm şırası imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.03.01",
        "tanim": "Elma şarabı ve diğer fermente meyve içeceklerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.04.02",
        "tanim": "Diğer damıtılmamış fermente içeceklerin imalatı (vermut ve benzeri içkiler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.05.01",
        "tanim": "Bira imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.06.01",
        "tanim": "Malt imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.07.01",
        "tanim": "Doğal veya suni maden sularının üretimi (tatlandırılmış ve aromalandırılmış olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "11.07.03",
        "tanim": "İçme suyu üretimi (şişelenmiş, gazsız, tatlandırılmamış ve aromalandırılmamış)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "11.07.04",
        "tanim": "Boza imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "11.07.90",
        "tanim": "Diğer alkolsüz içeceklerin imalatı (içme suyu ve maden suları ile boza imalatı hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "12.00.04",
        "tanim": "Tütün ürünleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.03",
        "tanim": "Doğal pamuk elyafının imalatı (kardelenmesi, taraklanması vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.05",
        "tanim": "Doğal yün ve tiftik elyafının imalatı (kardelenmesi, taraklanması, yün yağının giderilmesi, karbonize edilmesi ve yapağının boyanması vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.06",
        "tanim": "Doğal jüt, keten ve diğer bitkisel tekstil elyaflarının imalatı (kardelenmesi, taraklanması vb.) (pamuk hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.08",
        "tanim": "İpeğin kozadan ayrılması ve sarılması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.09",
        "tanim": "Sentetik veya suni devamsız elyafın kardelenmesi ve taraklanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.10",
        "tanim": "Doğal ipeğin bükülmesi ve iplik haline getirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.12",
        "tanim": "Pamuk elyafının bükülmesi ve iplik haline getirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.13",
        "tanim": "Yün ve tiftik elyafının bükülmesi ve iplik haline getirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.14",
        "tanim": "Jüt, keten ve diğer bitkisel tekstil elyaflarının bükülmesi ve iplik haline getirilmesi (pamuk hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.10.15",
        "tanim": "Suni ve sentetik elyafların bükülmesi ve iplik haline getirilmesi (filament ipliği ve suni ipek elyafı imalatı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.14",
        "tanim": "Kot kumaşı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.16",
        "tanim": "Pamuklu dokuma kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.17",
        "tanim": "Doğal kıl ve yünden dokuma kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.19",
        "tanim": "Doğal ipekten kumaş (doğal ipekten dokuma tül kumaş dahil) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.20",
        "tanim": "Keten, rami, kenevir, jüt elyafları ile diğer bitkisel tekstil elyaflarından dokuma kumaş (bitkisel elyaftan dokuma tül kumaş dahil) imalatı (pamuk hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.21",
        "tanim": "Havlı, şönil, havlu, pelüş, tırtıl ve benzeri ilmeği kesilmemiş dokuma kumaşlar ile tafting kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.22",
        "tanim": "Suni ve sentetik filamentlerden ve devamsız elyaflardan dokuma kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.20.23",
        "tanim": "Dokuma yoluyla imitasyon kürk kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.01",
        "tanim": "Kumaş ve tekstil ürünlerini ağartma ve boyama hizmetleri (giyim eşyası dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.02",
        "tanim": "Tekstil elyaf ve ipliklerini ağartma ve boyama hizmetleri (kasarlama dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.03",
        "tanim": "Kumaş ve tekstil ürünlerine baskı yapılması hizmetleri (giyim eşyası dahil, emprime baskı dahil, transfer baskı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.04",
        "tanim": "Kumaş ve tekstil ürünlerine ilişkin diğer bitirme hizmetleri (apreleme, pliseleme, sanforlama, vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.05",
        "tanim": "Kumaş ve tekstil ürünlerine transfer baskı yapılması hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.30.06",
        "tanim": "Serigrafi faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.91.01",
        "tanim": "Örgü ve tığ işi kumaşların imalatı (penye ve havlı kumaşlar ile raschel veya benzeri makineler ile örülen tül kumaş, perdelik kumaş vb. örgü veya tığ ile örülmüş kumaşlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.91.02",
        "tanim": "Örme yoluyla imitasyon kürk kumaşı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.01",
        "tanim": "Yatak örtü takımları, yatak çarşafları, yastık kılıfları, masa örtüsü ile tuvalet ve mutfakta kullanılan örtülerin imalatı (el ve yüz havluları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.02",
        "tanim": "Yorgan, kuştüyü yorgan, minder, puf, yastık, halı yastık, uyku tulumu ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.03",
        "tanim": "Perdelerin ve iç storların, perde veya yatak saçaklarının, farbelalarının ve malzemelerinin imalatı (gipür, hazır tül perde ve kalın perdeler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.04",
        "tanim": "Tekstilden yer bezi, bulaşık bezi, toz bezi vb. temizlik bezleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.05",
        "tanim": "Battaniye imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.06",
        "tanim": "Tekstilden çuval, torba, çanta ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.09",
        "tanim": "Bayrak, sancak ve flama imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.92.11",
        "tanim": "Branda, tente, stor (güneşlik), yelken, çadır ve kamp malzemeleri imalatı (şişme yataklar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.93.01",
        "tanim": "Halı (duvar halısı dahil) ve kilim imalatı (paspas, yolluk ve benzeri tekstil yer kaplamaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.93.02",
        "tanim": "Halı, kilim vb. için çözgücülük, halı oymacılığı vb. faaliyetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "13.94.02",
        "tanim": "Ağ ve ağ ürünleri imalatı, sicim, kınnap, halat veya urgandan (balık ağı, yük boşaltma ağları, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "13.94.03",
        "tanim": "Sicim, urgan, halat, kordon ve benzerleri imalatı (kauçuk veya plastik emdirilmiş, kaplanmış olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.95.01",
        "tanim": "Dokusuz kumaş ve dokusuz kumaştan yapılan ürünlerin imalatı (giyim eşyası hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.01",
        "tanim": "Dokunabilir ipliklerden metalize iplik ve metalize iplik ile bunlardan dokuma kumaş imalatı (giyim ve döşemecilikte kullanılan)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.02",
        "tanim": "Tekstil malzemelerinden parça halinde kordonlar; işleme yapılmamış şeritçi eşyası ve benzeri süs eşyalarının imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "13.96.03",
        "tanim": "Dar dokuma kumaşların imalatı (etiket, arma ve diğer benzeri eşyalar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.04",
        "tanim": "Tekstil malzemelerinden dokuma etiket, rozet, arma ve diğer benzeri eşyaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "13.96.05",
        "tanim": "Teknik kullanım amaçlı tekstil ürünleri ve eşyaları imalatı (fitil, lüks lambası gömleği, tekstil malzemesinden hortumlar, taşıma veya konveyör bantları, elek bezi ve süzgeç bezi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.06",
        "tanim": "Kord bezi imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.07",
        "tanim": "Tekstille kaplanmış kauçuk iplik veya kordon ile kauçuk veya plastikle kaplanmış veya emdirilmiş tekstilden iplik veya şeritler ve bunlardan yapılmış mensucat imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.08",
        "tanim": "Kaplanmış veya emdirilmiş tekstil kumaşlarının imalatı (cilt kapağı için mensucat, mühendis muşambası, tiyatro dekorları, tuval vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.09",
        "tanim": "Cam elyafından kumaş imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.10",
        "tanim": "Can yeleği ve can kurtaran simidi imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.11",
        "tanim": "Paraşüt (yönlendirilebilen paraşütler dahil) ve rotoşüt ile bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.96.12",
        "tanim": "Tekstilden örtü ve kılıf imalatı (araba, makine, mobilya vb. için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.99.02",
        "tanim": "Oya, dantel ve nakış imalatı (kapitone ürünleri dahil) ile tül ve diğer ağ kumaşların (dokuma, örgü (triko) veya tığ işi (kroşe) olanlar hariç) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.99.03",
        "tanim": "Keçe, basınçlı hassas giysi dokumaları, tekstilden ayakkabı bağı, pudra ponponu vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.99.04",
        "tanim": "Tekstil kırpıntısı imalatı (yatak, yorgan, yastık, şilte ve benzeri doldurmak için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "13.99.06",
        "tanim": "Gipe iplik ve şeritlerin, şönil ipliklerin, şenet ipliklerin imalatı (metalize olanlar ile gipe lastikler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "14.10.01",
        "tanim": "Giyim eşyası imalatı (örgü veya tığ işi kumaştan olanlar) (spor ve bebek giysileri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.10.02",
        "tanim": "Bebek giyim eşyası imalatı (örgü veya tığ işi kumaştan)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.10.03",
        "tanim": "Spor ve antrenman giysileri, kayak kıyafetleri, yüzme kıyafetleri vb. imalatı (örgü veya tığ işi kumaştan olanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.10.04",
        "tanim": "Çorap imalatı (örme ve tığ işi olan külotlu çorap, tayt çorap, kısa kadın çorabı, erkek çorabı, patik ve diğer çoraplar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.10.05",
        "tanim": "Sahne ve gösteri elbiseleri imalatı, dokuma, örgü (triko) ve tığ işi (kroşe), vb. kumaştan olanlar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.21.01",
        "tanim": "Dış giyim eşyası imalatı (örgü veya tığ işi olanlar hariç) (spor ve bebek giysileri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.21.02",
        "tanim": "Bebek dış giyim eşyası imalatı (örgü veya tığ işi kumaştan olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.21.03",
        "tanim": "Gelinlik imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.21.04",
        "tanim": "Siparişe göre ölçü alınarak dış giyim eşyası imalatı, dokuma, örgü (triko) ve tığ işi (kroşe), vb. kumaştan olanlar (terzilerin faaliyetleri) (giyim eşyası tamiri ile gömlek imalatı hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.22.01",
        "tanim": "Atlet, fanila, külot, slip, iç etek, kombinezon, jüp, jüpon, sütyen, korse vb. iç çamaşırı imalatı (örgü veya tığ işi kumaştan olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.22.02",
        "tanim": "Gecelik, sabahlık, pijama, bornoz ve ropdöşambır imalatı (örgü veya tığ işi kumaştan olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.22.03",
        "tanim": "Bebek iç giyim eşyalarının imalatı (örgü veya tığ işi kumaştan olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.22.04",
        "tanim": "Çorap bağları, jartiyer, pantolon askıları vb. iç giyim eşyalarının imalatı (her tür kumaştan)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.23.00",
        "tanim": "İş giysisi imalatı (dikişsiz plastik olanlar ile ateşe dayanıklı ve koruyucu güvenlik kıyafetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.24.01",
        "tanim": "Deri giyim eşyası imalatı (deri ayakkabı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "14.24.02",
        "tanim": "Kürklü deriden giyim eşyası, giysi aksesuarları ve diğer eşyaların imalatı (kürkten şapka ve başlık hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "14.29.01",
        "tanim": "Giyim eşyası imalatı (keçeden veya diğer dokusuz kumaştan ya da emdirilmiş veya kaplanmış tekstil kumaşından olanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.29.02",
        "tanim": "Spor ve antrenman giysileri, kayak kıyafetleri, yüzme kıyafetleri vb. imalatı (örgü veya tığ işi kumaştan olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.29.03",
        "tanim": "Yazma, tülbent, eşarp, vb. imalatı (her tür kumaştan)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "14.29.04",
        "tanim": "Eldiven, kemer, şal, papyon, kravat, saç fileleri, kumaş mendil, atkı, fular vb. giysi aksesuarları imalatı (kürklü deriden olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "14.29.05",
        "tanim": "Şapka, kep, başlık, kasket ve el manşonları ile bunların parçalarının imalatı (kürkten şapka ve başlıklar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "15.11.10",
        "tanim": "Deri ve kürklü deri imalatı (kürkün ve derinin tabaklanması, sepilenmesi, boyanması, cilalanması ve işlenmesi)(işlenmiş derinin başka işlemlere tabi tutulmaksızın yalnızca tamburda ütülenmesi ve kurutulması hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "15.11.11",
        "tanim": "Kürklü derinin ve postların kazınarak temizlenmesi, kırkılması, tüylerinin yolunması ve ağartılması (postlu derilerin terbiyesi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "15.11.13",
        "tanim": "Deri ve kösele esaslı terkip ile elde edilen levha, yaprak, şerit deri ve kösele imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "15.11.14",
        "tanim": "İşlenmiş derinin başka işlemlere tabi tutulmaksızın yalnızca tamburda ütülenmesi ve kurutulması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "15.12.07",
        "tanim": "Deri, kösele, karma deri ve diğer malzemelerden bavul ve çanta, deriden sigaralık, deri ayakkabı bağı, kişisel bakım, dikiş vb. amaçlı seyahat seti vb. ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.12.08",
        "tanim": "Deriden veya diğer malzemelerden saraçlık ve koşum takımı imalatı (kamçı, semer, eyer, tasma kayışı, heybe vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.12.09",
        "tanim": "Deri saat kayışı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.12.10",
        "tanim": "Plastik veya kauçuk saat kayışı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.12.11",
        "tanim": "Kumaş ve diğer malzemelerden saat kayışı imalatı (metal olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "15.12.99",
        "tanim": "Deriden veya deri bileşimlerinden başka yerde sınıflandırılmamış diğer ürünlerin imalatı (makinelerde veya mekanik cihazlarda kullanılan veya diğer teknik kullanımlar için ürünler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.05",
        "tanim": "Ayakkabı ve terliklerin ahşap parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.06",
        "tanim": "Ayakkabı ve terliklerin kauçuk parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.07",
        "tanim": "Ayakkabı ve terliklerin plastik parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.15",
        "tanim": "Deriden ayakkabı, mes, bot, çizme, postal, terlik, vb. imalatı (ortopedik ayakkabı ve kayak ayakkabısı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.17",
        "tanim": "Plastik veya kauçuktan ayakkabı, bot, çizme, postal, terlik, vb. imalatı (ortopedik ayakkabı ve kayak ayakkabısı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.18",
        "tanim": "Tekstilden ve diğer malzemelerden ayakkabı, mes, bot, çizme, postal, terlik, vb. imalatı (tamamıyla tekstilden olanlar ile ortopedik ayakkabı ve kayak ayakkabısı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "15.20.19",
        "tanim": "Ayakkabı ve terliklerin deri parçalarının imalatı ile sayacılık faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.11.01",
        "tanim": "Kereste imalatı (ağaçların biçilmesi, planyalanması, rendelenmesi ve şekillendirilmesi faaliyetleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.11.02",
        "tanim": "Ahşap demir yolu veya tramvay traversi imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.11.03",
        "tanim": "Ağaç yünü, ağaç unu, ağaç talaşı, ağaç yonga imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "16.11.04",
        "tanim": "Ahşap döşemelerin ve yer döşemelerinin imalatı (birleştirilebilir parkeler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.12.00",
        "tanim": "Ahşabın işlenmesi ve bitirilmesi (bir ücret veya sözleşmeye dayalı olarak gerçekleştirilen)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "16.21.01",
        "tanim": "Ahşap, bambu ve diğer odunsu malzemelerden kaplamalık plaka, levha, vb. imalatı (yaprak halde) (preslenmemiş)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.21.02",
        "tanim": "Sıkıştırılmış lif, tahta ve tabakalardan kontrplak, MDF, sunta, OSB, CLT vb. levha imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "16.22.01",
        "tanim": "Birleştirilmiş parke yer döşemelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.23.02",
        "tanim": "Ahşap prefabrik yapılar ve ahşap taşınabilir evlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.23.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer inşaat doğrama ve marangozluk ürünleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.24.02",
        "tanim": "Palet, kutu palet ve diğer ahşap yükleme tablaları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.24.90",
        "tanim": "Diğer ahşap konteyner imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.25.00",
        "tanim": "Ahşap kapı ve pencere imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.26.00",
        "tanim": "Bitkisel biyokütleden katı yakıt imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.27.00",
        "tanim": "Ahşap ürünlerin bitirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.28.01",
        "tanim": "Ahşap mutfak ve sofra eşyası imalatı (kaşık, kepçe, spatula, bardak, havan, havan eli, tepsi vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "16.28.02",
        "tanim": "Ahşap çerçeve ve ahşaptan diğer eşyaların imalatı (panolar, tuval için çerçeveler, ip vb. için makaralar, arı kovanları, köpek kulübeleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.28.03",
        "tanim": "Ahşaptan iş aletleri, alet gövdeleri, alet sapları, süpürge veya fırça gövdeleri ile sapları, ayakkabı kalıpları, ahşap mandal, elbise ve şapka askıları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "16.28.04",
        "tanim": "Hasır veya diğer örme malzemesinden (kamış, saz, saman vb.) eşyaların imalatı ile sepet türü ve hasır işi eşyaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "16.28.05",
        "tanim": "Sedef kakma ahşap işleri, kakma ile süslü ahşap eşyalar, mücevher için veya çatal-kaşık takımı ve benzeri eşyalar için ahşap kutular, ahşap biblo, heykel ve diğer süslerin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "16.28.06",
        "tanim": "Doğal mantarın işlenmesi, aglomera mantar imalatı ile bunlardan eşyaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "16.28.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ağaç ürünleri imalatı; mantardan, saz, saman ve benzeri örme malzemelerinden yapılmış ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.11.08",
        "tanim": "Kağıt hamuru imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.12.07",
        "tanim": "Kağıt ve mukavva imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.21.10",
        "tanim": "Bürolarda, dükkanlarda ve benzeri yerlerde kullanılan kağıt veya mukavvadan dosya veya evrak tasnif kutuları, mektup kutuları ve benzeri eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.21.11",
        "tanim": "Kağıt ve kartondan torba ve çanta imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.21.12",
        "tanim": "Kağıt veya mukavvadan koli, kutu ve benzeri muhafazaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.21.13",
        "tanim": "Oluklu kağıt ve mukavva imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.22.02",
        "tanim": "Kağıt hamurundan, kağıttan, selüloz vatkadan veya selüloz lifli ağlardan tuvalet kağıdı, kağıt mendil, temizlik veya yüz temizleme için kağıt mendil ve havlular ile masa örtüsü ve peçetelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.22.03",
        "tanim": "Kağıt veya mukavvadan tepsi, tabak, kase, bardak ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.22.04",
        "tanim": "Kağıt hamurundan, kağıttan, selüloz vatkadan veya selüloz lifli ağlardan hijyenik havlu ve tamponlar, kadın bağı, pedler, bebek bezleri vb. hijyenik ürünler ile giyim eşyası ve giysi aksesuarlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.23.04",
        "tanim": "Kullanıma hazır karbon kağıdı, kendinden kopyalı kağıt ve diğer kopyalama veya transfer kağıtları, mumlu teksir kağıdı, kağıttan ofset tabakalar ile tutkallı veya yapışkanlı kağıtların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.23.06",
        "tanim": "Kağıt veya mukavvadan ana niteliği bilgi içermeyen eğitim ve ticari kırtasiye malzemeleri imalatı (ajandalar, defterler, sicil defterleri, muhasebe defterleri, ciltler, kayıt formları ve diğer benzeri kırtasiye ürünleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.23.07",
        "tanim": "Kağıt veya mukavvadan dosya, portföy dosya, klasör ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.23.08",
        "tanim": "Kullanıma hazır basım ve yazım kağıdı ile bilgisayar çıktısı için kullanılacak kağıt ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.23.09",
        "tanim": "Baskısız zarf, mektup kartı, yazışma kartı ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.24.02",
        "tanim": "Duvar kağıdı ve benzeri duvar kaplamalarının imalatı (tekstilden olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.24.03",
        "tanim": "Tekstil duvar kaplamalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.25.01",
        "tanim": "Kağıt veya mukavvadan etiketlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.25.02",
        "tanim": "Sigara kağıdı, kağıt ve mukavvadan bobin, makara, masura, yumurta viyolü ve benzeri kağıt, mukavva veya kağıt hamurundan destekler ile kağıttan hediyelik ve süs eşyaları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.25.03",
        "tanim": "Filtre kağıdı, kartonları ve mukavvaları, kağıt hamurundan filtre edici blok ve levhalar ile kalıplanmış ya da sıkıştırılmış eşyaların imalatı (kağıt veya karton esaslı contalar ve rondelalar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "17.25.99",
        "tanim": "Başka yerde sınıflandırılmamış kağıt ve mukavvadan diğer ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.11.01",
        "tanim": "Gazetelerin basımı (haftada dört veya daha fazla yayınlananlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.01",
        "tanim": "Çıkartma, takvim, ticari katalog, tanıtım broşürü, poster, satış bülteni, kartpostal, davetiye ve tebrik kartları, yıllık, rehber, resim, çizim ve boyama kitapları, çizgi roman vb. basım hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.02",
        "tanim": "Gazetelerin, dergilerin ve süreli yayınların basım hizmetleri (haftada dört kereden daha az yayınlananlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.03",
        "tanim": "Ansiklopedi, sözlük, kitap, kitapçık, müzik eserleri ve müzik el yazmaları, atlas, harita vb. basım hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.04",
        "tanim": "Röprodüksiyon basımı (bir sanat eserinin aslını bozmadan basılması)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.06",
        "tanim": "Posta pulu, damga pulu, matbu belgeler, tapu senetleri, akıllı kart, çek defterleri, kağıt para ve diğer değerli kağıtların ve benzerlerinin basım hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.07",
        "tanim": "Plastik, cam, metal, ağaç ve seramik üstüne baskı hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.12.08",
        "tanim": "Fotokopi çekme faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "18.12.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer matbacılık (USB, mobil cihazlar, hafıza kartları vb. kaynaklardan fotoğraf basımı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "18.13.01",
        "tanim": "Basımda kullanmak üzere baskı klişeleri ya da silindirleri ile diğer basım unsurlarının üretilmesi (klişecilik vb.) ile mizanpaj, dizgi, tabaka yapım hizmetleri, gravür baskı için silindirlerin kazınması veya asitle aşındırılması vb. hizmetler",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "18.13.02",
        "tanim": "Basım öncesi bilgisayar destekli hizmetler (bilgisayar destekli sayfa tasarımı ile saydam, asetat, reprografik sunum araçları ve diğer sayısal sunum ortamları, taslaklar, planlar vb. baskı ürünlerinin tasarlanması) (masa üstü yayımcılık dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "18.14.01",
        "tanim": "Ciltçilik ve ilgili hizmetler (katlama, birleştirme, dikme, yapıştırma, kesme, kapak takma gibi işlemler ile damgalama, Braille alfabesi kopyalama vb. hizmetler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "18.20.02",
        "tanim": "Ses ve görüntü kayıtlarının çoğaltılması hizmetleri (CD'lerin, DVD'lerin, kasetlerin ve benzerlerinin asıl (master) kopyalarından çoğaltılması)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "18.20.03",
        "tanim": "Yazılımların çoğaltılması hizmetleri (CD, kaset vb. ortamlardaki bilgisayar yazılımlarının ve verilerin asıl (master) kopyalarından çoğaltılması)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "19.10.10",
        "tanim": "Linyit ve turbadan kok fırını ürünlerinin imalatı (kok ve yarı kok kömürü, karni kömürü, katran, zift ve zift koku vb. ürünlerin imalatı ile kok kömürünün topak haline getirilmesi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.10.11",
        "tanim": "Taşkömüründen kok fırını ürünlerinin imalatı (kok ve yarı kok kömürü, karni kömürü, katran, zift ve zift koku vb. ürünlerin imalatı ile kok kömürünün topak haline getirilmesi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.20.12",
        "tanim": "Turba, linyit ve taş kömürü briketleri imalatı (kömür tozundan basınçla elde edilen yakıt)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.20.15",
        "tanim": "Petrol türevi yakıtların, petrol gazları ve diğer hidrokarbonların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.20.16",
        "tanim": "Petrolden madeni yağların (yağlama ve makine yağları) imalatı (gres yağı dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.20.17",
        "tanim": "Vazelin, parafin mumu, petrol mumu, petrol koku, petrol bitümeni ve diğer petrol ürünlerinin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "19.20.19",
        "tanim": "Ağırlık itibariyle %70 veya daha fazla oranda petrol yağları veya bitümenli yağlardan elde edilen diğer karışımların üretimi (%70 petrol yağı ile karıştırılmış biyodizelden ürünler dahil, madeni yağlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.11.01",
        "tanim": "Sanayi gazları imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.12.01",
        "tanim": "Boya maddeleri ve pigment imalatı (birincil formda veya konsantre olarak herhangi bir kaynaktan) (hazır boyalar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.12.02",
        "tanim": "Tabaklama ekstreleri, bitkisel kökenli; tanenler ve tuzları, eterleri, esterleri ve diğer türevleri; bitkisel veya hayvansal kökenli renklendirme maddelerinin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.02",
        "tanim": "Metalik halojenler, hipokloritler, kloratlar ve perkloratların imalatı (çamaşır suyu dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.03",
        "tanim": "Sülfidler (sülfürler), sülfatlar, fosfinatlar, fosfonatlar, fosfatlar ve nitratların imalatı (şap dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.04",
        "tanim": "Karbonatların imalatı (sodyum, kalsiyum ve diğerleri) (çamaşır sodası dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.06",
        "tanim": "Uranyum, plütonyum ve toryum cevherlerinin zenginleştirilmesi (nükleer reaktörler için yakıt kartuşları dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.90",
        "tanim": "Diğer metal tuzları ve temel inorganik kimyasalların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.13.99",
        "tanim": "Başka yerde sınıflandırılmamış kimyasal elementler, inorganik asitler ve bileşiklerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.14.00",
        "tanim": "Diğer organik temel kimyasalların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.15.01",
        "tanim": "Fosfatlı veya potasyumlu gübreler, iki (azot ve fosfor veya fosfor ve potasyum) veya üç besin maddesi (azot, fosfor ve potasyum) içeren gübreler, sodyum nitrat ile diğer kimyasal ve mineral gübrelerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.15.02",
        "tanim": "Bileşik azotlu ürünlerin imalatı (gübreler hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.16.01",
        "tanim": "Birincil formda poliamitler, üre reçineleri, melamin reçineleri, vb. plastik hammaddelerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.16.02",
        "tanim": "Birincil formda alkid reçine, polyester reçine, epoksi reçine, poliasetal, polikarbonat ile diğer polieter ve polyester imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.16.03",
        "tanim": "Birincil formda polimerlerin imalatı (etilen, propilen, stiren, vinil klorür, vinil asetat, vinil esterleri, akrilik vb. polimerleri ile sertleştirilmiş proteinler, doğal kauçuğun kimyasal türevleri dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.16.04",
        "tanim": "Birincil formda silikon ve polimer esaslı iyon değiştiricileri imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.16.05",
        "tanim": "Birincil formda diğer amino reçineler, fenolik reçineler, poliüretanlar, politerpenler, polisülfürler, selüloz ve kimyasal türevleri ile diğer petrol reçineleri imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.17.01",
        "tanim": "Birincil formda sentetik kauçuk imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.20.11",
        "tanim": "Böcek ilacı, kemirgen ilacı, küf ve mantar ilacı, yabancı otla mücadele ilacı imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.20.13",
        "tanim": "Çimlenmeyi önleyici ve bitki gelişimini düzenleyici ürün imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.20.15",
        "tanim": "Dezenfektan imalatı (tarımsal ve diğer kullanımlar için) (hijyenik maddeler, bakteriostatlar ve sterilize ediciler dahil) (doğal dezenfektanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.20.16",
        "tanim": "Doğal dezenfektan imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.20.90",
        "tanim": "Diğer zirai kimyasal ürünlerin imalatı (gübre ve azotlu bileşik imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.11",
        "tanim": "Boya ve vernikler, akrilik ve vinil polimer esaslı olanların (sulu ortamda dağılanlar, çözülenler ve çözeltiler) imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.12",
        "tanim": "Macun imalatı (dolgu, cam, sıvama için olanlar ile üstübeç, vb. dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.14",
        "tanim": "Boya ve vernikler, polyester, akrilik ve vinil polimer esaslı olanların (susuz ortamda dağılanlar, çözülenler ve çözeltiler) imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.15",
        "tanim": "Hazır boya pigmentleri, matlaştırıcılar (opaklaştırıcı) ve renklendiriciler, camlaştırılabilir emay ve sırlar, astarlar, cam firit, sıvı cilalar ve benzerlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.16",
        "tanim": "Boya müstahzarları hazır kurutucu maddelerinin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.17",
        "tanim": "Elektrostatik toz boya imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.30.90",
        "tanim": "Diğer boya, vernik ve ilgili ürünlerin imalatı (renk ayarlayıcılar, matbaa mürekkepleri, solventler, incelticiler (tiner))",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.41.01",
        "tanim": "Kapalı alanlar için kokulu müstahzarlar ve koku gidericiler ile suni mumların imalatı (kişisel kullanım için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.41.03",
        "tanim": "Ham gliserin (gliserol) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.41.04",
        "tanim": "Sabun, yıkama ve temizleme müstahzarları (deterjanlar) ile sabun olarak kullanılan müstahzarlar imalatı (kişisel bakım için olanlar ile ovalama toz ve kremleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.41.06",
        "tanim": "Cila, krem ve ovalama krem ve tozlarının imalatı (ayakkabı, mobilya, yer döşemesi, kaporta, cam, metal vb. için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.42.01",
        "tanim": "Ağız veya diş bakım ürünleri imalatı (diş macunu, vb. ile takma dişleri ağızda sabit tutmaya yarayan macun ve tozlar ile diş temizleme iplikleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.42.02",
        "tanim": "Kolonya imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.42.03",
        "tanim": "Parfüm ve koku verici diğer sıvı ürün, manikür/pedikür müstahzarı, güneş koruyucu ürünler, dudak ve göz makyajı ürünü, banyo tuzu, kozmetik veya kişisel bakım amaçlı pudra, sabun ve organik yüzey aktif müstahzarı, deodorant, vb. imalatı (kolonya hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.42.04",
        "tanim": "Şampuan, saç kremi, saç spreyi, jöle, saç düzleştirme ve perma ürünleri, saç losyonları, saç boyaları, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.51.24",
        "tanim": "Sıvı biyoyakıt imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.01",
        "tanim": "Fotoğrafik levha ve filmlerin (hassaslaştırılmış, ışığa maruz kalmamış olanlar), anında baskılanan filmlerin, fotoğrafçılıkta kullanılan kimyasal müstahzarların ve karışımsız (saf) ürünlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.02",
        "tanim": "Tutkal imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.03",
        "tanim": "Aktif karbon imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.04",
        "tanim": "Yağlama müstahzarları (hidrolik fren sıvıları dahil), vuruntu önleyici müstahzarlar ile katkı maddeleri ve antifrizlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.05",
        "tanim": "Yazım ve çizim mürekkepleri ve diğer mürekkeplerin imalatı (matbaa mürekkebi imalatı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.59.06",
        "tanim": "Peptonlar, diğer protein maddeleri ve bunların türevlerinin ve deri tozlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.59.07",
        "tanim": "Laboratuvar için hazır kültür ortamları, model hamurları, kompozit diyagnostik reaktifler veya laboratuvar reaktifleri imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.08",
        "tanim": "Elektronikte kullanılan macun kıvamında (dope edilmiş) olan kimyasal elementler ile bileşiklerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.09",
        "tanim": "Bitirme (apreleme dahil) maddeleri, boya hammaddesi ve benzeri ürünlerin sabitlenmesini veya boyayıcılığını hızlandıran boya taşıyıcı maddelerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.10",
        "tanim": "Dekapaj (temizleme) müstahzarları, eritkenler, hazır vulkanizasyon hızlandırıcı maddeler, kauçuk veya plastikler için plastikleştirici bileşikler ve stabilizatörler, diğer katalitik müstahzarların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.11",
        "tanim": "Jelatin ve jelatin türevleri ile süt albüminlerinin imalatı (gıda endüstrisinde kullanılan jelatinler ve süt albüminleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.12",
        "tanim": "Kimyasal olarak değiştirilmiş veya yenilemeyen hayvansal veya bitkisel katı ve sıvı yağlar ve yağ karışımlarının imalatı (linoksin, teknik ve sanayi amaçlı bitkisel sabit sıvı yağlar, sanayide kullanılan sıvı yağlar, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.59.15",
        "tanim": "Yangın söndürücü müstahzarları ve dolum malzemeleri imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.16",
        "tanim": "Jelatin ve süt albüminlerinin imalatı (yalnızca gıda endüstrisinde kullanılanlar)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.17",
        "tanim": "Patlayıcı diğer maddelerin imalatı (itici tozların imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.18",
        "tanim": "Mikronize edilmiş ve stearik asitle kaplanmış kalsit imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.19",
        "tanim": "Uçucu yağların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "20.59.20",
        "tanim": "Barut vb. itici tozların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.59.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer kimyasal ürünlerin imalatı (vakum tüpleri için emiciler, pirolinyitler, kazan taşı önleyici bileşikler, yağ emülsiyonlaştırıcıları, dökümhanelerde kullanılan yardımcı kimyasal ürünler ve hazır bağlayıcılar, vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.60.01",
        "tanim": "Kardelenmemiş ve taranmamış suni ve sentetik elyaf imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "20.60.02",
        "tanim": "Sentetik filament ipliği ve sentetik monofilamentlerin, şeritlerin ve benzerlerinin imalatı (poliamidden ve polyesterden yüksek mukavemetli filament iplikler dahil) (bükülü, katlı ve tekstürize olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "21.10.01",
        "tanim": "Temel eczacılık ürünlerinin hammaddelerinin  imalatı (antibiyotik, vitamin, salisilik asit gibi ilaçların imalatında farmakolojik özelliklerinden yararlanmak üzere tıbbi olarak etken maddeler ile kan ürünlerinin, salgı bezi ve ekstrelerin, hormonların vb. imalatı) (Kanın işlenmesi dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "21.20.01",
        "tanim": "Eczacılığa ilişkin tıbbi ilaçların imalatı (antibiyotik içeren tıbbi ilaçlar, ağrı kesiciler, hormon içeren tıbbi ilaçlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "21.20.02",
        "tanim": "Yapışkanlı bandajlar, katkütler ve benzeri tıbbi malzemelerin üretimi (steril cerrahi katgütler, eczacılık maddeleri ile birlikte kullanılan tamponlar, hidrofil pamuk, gazlı bez, sargı bezi vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "21.20.03",
        "tanim": "Hayvan sağlığına ilişkin tıbbi ilaçların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "21.20.90",
        "tanim": "Diğer eczacılık müstahzarlarının imalatı (antiserumlar, panzehirler, aşılar, hormon ve spermisit esaslı kimyasal kontraseptik müstahzarlar, diyagnostik reaktifleri ve diğer eczacılık müstahzarları) (hayvan sağlığı için olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.11.17",
        "tanim": "Kauçuktan iç lastiklerin imalatı (dış lastikler için değişebilir sırtlar, kolonlar ve şeritlerin imalatı dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "22.11.18",
        "tanim": "Kauçuktan dış lastik imalatı (motosikletler, bisikletler, otomobiller, otobüsler, kamyonlar, hava taşıtları, traktörler ve diğer araç ve donanımlar için) (dolgu veya alçak basınçlı lastikler dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "22.11.19",
        "tanim": "Lastik tekerleklerinin yeniden işlenmesi ve sırt geçirilmesi (lastiğin kaplanması)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "22.12.01",
        "tanim": "Kauçuktan tüp, boru ve hortumların imalatı (vulkanize kauçuktan)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.02",
        "tanim": "Kauçuktan silgi, rondela, conta, tekne veya iskele usturmaçaları, gözenekli vulkanize kauçuktan teknik işlerde kullanılan diğer eşyalar ile demiryolu, kara yolu taşıtları ve diğer araçlar için kalıplanmış parçaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.03",
        "tanim": "Kauçuktan konveyör bantları ve taşıma kayışlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.04",
        "tanim": "Vulkanize edilmiş (kükürtle sertleştirilmiş) kauçuk imalatı (ip, kordon, levha, tabaka, şerit, çubuk ve profil halinde)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.05",
        "tanim": "Rejenere kauçuk imalatı, birincil formda veya levha, tabaka veya şerit halinde",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.06",
        "tanim": "Kauçuktan paket lastiği, tütün kesesi, cam silecekleri, tarih ıstampaları için karakterler, tapalar, lavabo pompaları, şişeler için tıpa ve halkalar ile sert kauçuktan diğer çeşitli eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.07",
        "tanim": "Kauçuktan yer döşemeleri ve paspasların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.08",
        "tanim": "Kauçuktan hijyenik ve eczacılık ürünlerinin imalatı (prezervatifler, emzikler, hijyenik eldivenler vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.09",
        "tanim": "Kauçuk kaplanmış, emdirilmiş, sıvanmış ve lamine edilmiş tekstil kumaşlarının imalatı, ana bileşeni kauçuk olanlar (kord bezi hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.10",
        "tanim": "Kauçuktan süpürgelerin ve fırçaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.12.11",
        "tanim": "Kauçuktan giyim eşyası ve giysi aksesuarlarının imalatı (giysiler, eldivenler vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.21.03",
        "tanim": "Plastikten mamul halde tüp, boru, hortum ve bunların bağlantı elemanlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.21.04",
        "tanim": "Plastikten yarı mamul halde profil, çubuk, tabaka, levha, blok, film, folyo, şerit, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.22.43",
        "tanim": "Plastik ambalaj malzemeleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.23.08",
        "tanim": "Plastikten kapı ve pencere imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.01",
        "tanim": "Plastikten banyo küvetleri, lavabolar, klozet kapakları, oturakları ve rezervuarları ile benzeri sıhhi ürünlerin imalatı (kalıcı tesisat için kullanılan montaj ve bağlantı parçaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.02",
        "tanim": "Plastikten depo, tank, fıçı ve benzeri kapların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.03",
        "tanim": "Plastikten merdiven, merdiven korkuluğu, panjur, güneşlik, jaluzi, stor, vb. eşya ile bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.04",
        "tanim": "Vinil, linolyum (muşamba) gibi esnek yer kaplamaları ile plastik zemin, duvar ve tavan kaplamalarının imalatı (duvar kağıdı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.05",
        "tanim": "Plastikten prefabrik yapıların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.24.99",
        "tanim": "Başka yerde sınıflandırılmamış plastik inşaat malzemelerinin imalatı (plastik suni taş-mermerit imalatı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.25.00",
        "tanim": "Plastik ürünlerin işlenmesi ve bitirilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.01",
        "tanim": "Plastikten sofra, mutfak, banyoda kullanılan eşya (silikon kek kalıbı, leğen, tas, kova vb.) ve diğer ev eşyası imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.02",
        "tanim": "Plastikten mandal, askı, sünger, sabunluk, tarak, bigudi, toka, saç firketesi, boncuk, biblo, heykelcik ve diğer eşyalar ile mamul haldeki kendinden yapışkanlı levha, şerit vb. ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.03",
        "tanim": "Makine, mobilya, kaporta, el aletleri ve benzerlerinin plastikten bağlantı parçaları, plastikten taşıyıcı bantların ve konveyör bantlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.04",
        "tanim": "Plastikten büro ve okul malzemelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.05",
        "tanim": "Plastik başlık (koruma amaçlı olanlar hariç), izolasyon bağlantı parçaları ile lambaların, aydınlatma ekipmanlarının, ışıklı tabelaların, vb.nin başka yerde sınıflandırılmamış plastik kısımlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.06",
        "tanim": "Plastikten dikişsiz giyim eşyası ve giysi aksesuarlarının imalatı (eldiven dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "22.26.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer plastik ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.11.01",
        "tanim": "Düz cam imalatı (telli, buzlu cam, renkli veya boyalı düz cam dahil) (dökülmüş, haddelenmiş, çekilmiş, üflenmiş, float, yüzeyi parlatılmış veya cilalanmış ancak başka şekilde işlenmemiş olanlar)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.12.01",
        "tanim": "Cam ayna imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.12.02",
        "tanim": "Sertleştirilmiş emniyet camı ve temperli düz cam imalatı (oto camı dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.12.03",
        "tanim": "Çok katlı yalıtım camları imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.12.04",
        "tanim": "Levha veya tabaka halinde işlenmiş cam imalatı (kavislendirilmiş, kenarları işlenmiş, gravür yapılmış, delinmiş, emaylanmış/sırlanmış veya başka bir şekilde işlenmiş, fakat çerçevelenmemiş veya monte edilmemiş olanlar) (optik camlar dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.13.01",
        "tanim": "Camdan şişe, kavanoz ve diğer muhafaza kapları, bardaklar, termos ve diğer vakumlu kapların camdan yapılmış iç yüzeyleri ile camdan sofra ve mutfak eşyaları imalatı (ampuller hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.13.02",
        "tanim": "Tuvalet, banyo, büro, iç dekorasyon, vb. amaçlarla kullanılan cam ve kristal eşya imalatı (camdan biblo, boncuk vb. küçük cam eşyalar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.14.01",
        "tanim": "Cam elyafı imalatı (cam yünü ve bunlardan yapılmış dokuma dışı ürünler dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.15.01",
        "tanim": "Laboratuvar, hijyen veya eczacılık ile ilgili cam eşyalar ile cam ampullerin (serum ampulleri) imalatı (ambalajlama ve taşımada kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.02",
        "tanim": "Lamba ve aydınlatma teçhizatının, ışıklı işaretlerin, isim tabelalarının vb.nin cam parçalarının imalatı (cam tabelaların imalatı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.03",
        "tanim": "Sıkıştırılmış veya kalıplanmış camdan döşeme blokları, tuğlalar, karolar ve diğer ürünler, kurşunlu lambalar ve benzerleri, blok, plaka veya benzer şekillerdeki gözenekli, köpüklü camların imalatı (vitray cam hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.04",
        "tanim": "Küçük cam eşya imalatı (biblo, vb. süs eşyası, boncuklar, imitasyon inciler/taşlar, imitasyon mücevherler, vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.05",
        "tanim": "Vitray cam imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.15.06",
        "tanim": "Camdan elektrik izolasyon malzemesi imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.07",
        "tanim": "Cam zarflar (açık) ve bunların cam parçalarının imalatı (elektrik ampulleri, elektrik lambaları, katot ışınlı tüpler vb. için kullanılan)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.08",
        "tanim": "Duvar saati, kol saati veya gözlük için camlar (bombeli, kavisli, içi oyuk vb. şekilde fakat, optik açıdan işlenmemiş) ile bu tür camların imalatı için kullanılan içi boş küre ve bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.15.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer cam ürünlerin imalatı ve işlenmesi (düz camdan yapılmış akvaryumların imalatı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.20.16",
        "tanim": "Silisli süzme topraktan (kizelgur) ısı yalıtımlı seramik ürünler ile ateşe dayanıklı briket, blok, tuğla, ateş tuğlası, vb. ateşe dayanıklı seramik yapı ürünleri imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.20.17",
        "tanim": "Ateşe dayanıklı imbikler, damıtma kabı, eritme potası, vana ucu, tüp, boru, döküm potaları, mufl ocağı, püskürtme tüpleri vb. seramik ürünlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.20.19",
        "tanim": "Ateşe dayanıklı çimento imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.20.20",
        "tanim": "Ateşe dayanıklı çamur, harç, beton vb. imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.31.01",
        "tanim": "Seramik karo ve kaldırım taşları imalatı (mozaik taşı ve mozaik küpleri dahil) (ateşe dayanıklı olanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.32.02",
        "tanim": "Fırınlanmış, ateşe dayanıklı olmayan kil ve topraktan baca künkleri ve başlıkları, şömine ve baca boruları, oluklar ve bağlantı parçaları ile karo vb. inşaat malzemeleri imalatı (seramikten oluklar, borular ve bağlantı parçaları dahil) (tuğla ve kiremit hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.32.03",
        "tanim": "Fırınlanmış, ateşe dayanıklı olmayan kil ve topraktan tuğla ve kiremit imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.41.01",
        "tanim": "Seramik veya porselenden sofra takımları (tabak, bardak, fincan, vb.) ve diğer ev ve tuvalet eşyasının imalatı (çiniden olanlar ve sıhhi ürünler hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.41.02",
        "tanim": "Seramik ve porselenden heykelcik, vazo, biblo, vb. süs eşyası imalatı (oyuncaklar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.41.03",
        "tanim": "Çiniden sofra takımı, ev, tuvalet ve süs eşyası imalatı (çinicilik) (çini dekoru dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.41.04",
        "tanim": "Topraktan güveç, çanak, çömlek, küp, vazo, vb. eşyalar ile topraktan heykel vb. süs ve dekoratif eşya imalatı (porselen ve çiniden olanlar ile malların ambalajlanması ve taşınması için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.42.01",
        "tanim": "Seramik sıhhi ürünlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.43.01",
        "tanim": "Seramik yalıtkanların (izolatörlerin) ve yalıtkan bağlantı parçalarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.44.01",
        "tanim": "Diğer teknik seramik ürünlerin imalatı (laboratuvar, kimyasal ve diğer teknik alanlarda kullanılan seramikten ürünler) (ateşe dayanıklı seramik ürünler hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.45.01",
        "tanim": "Tarımsal amaçlı olanlar ile malların taşınması ya da ambalajlanması için kullanılan seramik ürünlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.45.99",
        "tanim": "Başka yerde sınıflandırılmamış yapı işlerinde kullanılmayan diğer seramik eşyaların imalatı (dekoratif amaçlı olmayan seramik saksılar dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.51.01",
        "tanim": "Çimento imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.52.01",
        "tanim": "Sönmemiş kireç, sönmüş kireç ve suya dayanıklı kireç imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.52.02",
        "tanim": "Sönmüş alçıtaşından ya da sönmüş sülfattan alçı imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.52.03",
        "tanim": "Yanmış (kalsine edilmiş) veya aglomera edilmiş dolomit imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.61.01",
        "tanim": "Çimentodan, betondan veya suni taştan prefabrik yapı elemanları imalatı (gazbetondan ve kireç taşından olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.61.02",
        "tanim": "Çimentodan, betondan veya suni taştan karo, döşeme taşı, kiremit, tuğla, boru, vb. inşaat amaçlı ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.61.03",
        "tanim": "Betondan yapılmış prefabrik yapıların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.62.01",
        "tanim": "İnşaat amaçlı alçı ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.63.01",
        "tanim": "Hazır beton imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.64.01",
        "tanim": "Toz harç imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.65.02",
        "tanim": "Lif ve çimento karışımlı ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.66.00",
        "tanim": "Beton, çimento ve alçıdan diğer eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.70.01",
        "tanim": "Taş ve mermerin kesilmesi, şekil verilmesi ve bitirilmesi (doğal taşlardan, mermerden, su mermerinden, travertenden, kayağantaşından levha/tabaka, kurna, lavabo, karo, kaldırım taşı, yapı taşı, mezar taşı, vb. imalatı dahil, süs eşyası hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.70.02",
        "tanim": "Doğal taşlardan, mermerden, su mermerinden, travertenden, kayağantaşından süs eşyası imalatı (lületaşı, kehribar ve benzerlerinden olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "23.91.01",
        "tanim": "Aşındırıcı ürünlerin imalatı (değirmen taşları, bileği taşı, zımpara taşı vb.)(dokuma tekstil kumaşlarına, kağıt ve mukavvaya tutturulmuş zımparalar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.91.02",
        "tanim": "Dokuma tekstil kumaşlarına, kağıt ve mukavvaya tutturulmuş olan zımparaların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.99.01",
        "tanim": "Asfalttan ve benzeri malzemelerden yapılan ürünlerin imalatı (çatı yapımında veya su yalıtımında kullanılan bitüm esaslı keçeler dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.99.02",
        "tanim": "Mineral ses/ısı izolasyon malzemelerinin imalatı (cüruf yünleri, taş yünü, madeni yünler, pul pul ayrılmış vermikulit, genleştirilmiş kil, soğuk tandiş plakası, vb. ısı ve ses yalıtım malzemeleri)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.99.03",
        "tanim": "İşlenmiş asbest (amyant) lifleri, asbest ve magnezyum karbonat esaslı karışımlar, bu karışımlardan veya asbestten yapılan ürünler, fren, debriyaj ve benzerleri için monte edilmemiş sürtünme malzemeleri (fren balatası vb.) imalatı",
        "sinif": "Çok Tehlikeli *"
    },
    {
        "kod": "23.99.05",
        "tanim": "Bitümlü karışımların imalatı (doğal veya suni taştan malzemeler ile bir bağlayıcı olarak bitüm, doğal asfalt veya ilgili maddelerin karıştırılmasıyla elde edilenler)",
        "sinif": "Çok Tehlikeli *"
    },
    {
        "kod": "23.99.07",
        "tanim": "Amyantlı kağıt imalatı",
        "sinif": "Çok Tehlikeli *"
    },
    {
        "kod": "23.99.09",
        "tanim": "Suni korindon imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "23.99.99",
        "tanim": "Başka yerde sınıflandırılmamış metal dışı minerallerden ürünlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.01",
        "tanim": "Ham çelik üretilmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.02",
        "tanim": "Çelikten açık profil imalatı (sıcak haddeleme, sıcak çekme veya kalıptan çekme işlemlerinden daha ileri işlem görmemiş)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.03",
        "tanim": "Demir ve çelikten sıcak veya soğuk çekilmiş yassı hadde ürünleri imalatı (demir veya çelik alaşımlı levha, şerit, sac, teneke sac, vb. dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.05",
        "tanim": "Sıcak haddelenmiş demir veya çelikten bar ve çubukların üretilmesi (inşaat demiri dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.06",
        "tanim": "Demir veya çelik granül ve demir tozu üretilmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.07",
        "tanim": "Demir ya da çelik hurdaların yeniden eritilmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.08",
        "tanim": "Demir cevherinin doğrudan indirgenmesiyle elde edilen demirli ürünler ve diğer sünger demir ürünlerinin imalatı ile elektroliz veya diğer kimyasal yöntemlerle istisnai saflıkta demir üretilmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.09",
        "tanim": "Çelikten demir yolu ve tramvay yolu yapım malzemesi (birleştirilmemiş raylar ile ray donanımı, aksamı, vb.) ile levha kazıkları (palplanş) ve kaynaklı açık profil imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.10",
        "tanim": "Pik demir ve manganezli dökme demir (aynalı demir/spiegeleisen) üretimi (külçe, blok, veya diğer birincil formlarda)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.10.12",
        "tanim": "Ferro alaşımların imalatı (ferro manganez, ferro silisyum, ferro siliko manganez, ferro krom ve diğerleri)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.20.09",
        "tanim": "Çelikten/demirden yapılmış tüp, boru, içi boş profiller ve ilgili bağlantı parçalarının imalatı (sıcak çekilmiş veya sıcak haddelenmiş)",
        "sinif": "Çok tehlikeli"
    },
    {
        "kod": "24.20.10",
        "tanim": "Çelikten/demirden yapılmış tüp, boru, içi boş profiller ve ilgili bağlantı parçalarının imalatı (soğuk çekilmiş veya soğuk haddelenmiş)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.31.01",
        "tanim": "Barların soğuk çekilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.32.01",
        "tanim": "Dar şeritlerin soğuk haddelenmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.33.01",
        "tanim": "Soğuk şekillendirme veya katlama",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.34.01",
        "tanim": "Tellerin soğuk çekilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.41.16",
        "tanim": "İşlenmemiş, yarı işlenmiş, toz halde altın imalatı ile gümüş veya adi metallerin altınla preslenerek kaplanması (Mücevher ve benzeri eşyaların imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.41.17",
        "tanim": "İşlenmemiş, yarı işlenmiş, toz halde gümüş imalatı ile adi metallerin gümüşle preslenerek kaplanması (Mücevher ve benzeri eşyaların imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.41.18",
        "tanim": "İşlenmemiş, yarı işlenmiş, toz halde platin imalatı ile altın, gümüş veya adi metallerin platinle preslenerek kaplanması (paladyum, rodyum, osmiyum ve rutenyum imalatı ile platin katalizör imalatı dahil) (Mücevher ve benzeri eşyaların imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.41.19",
        "tanim": "Değerli metal alaşımlarının imalatı (Mücevher ve benzeri eşyaların imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.42.16",
        "tanim": "Alüminyum folyo imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.42.17",
        "tanim": "Alüminyum imalatı (işlenmemiş halde)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.42.18",
        "tanim": "Alüminyum sac, levha, tabaka, şerit imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.42.20",
        "tanim": "Alüminyum oksit imalatı (suni korindon hariç) (alümina)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.42.21",
        "tanim": "Alüminyum bar, çubuk, tel ve profil, tüp, boru ve bağlantı parçaları imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.43.01",
        "tanim": "Kurşun tabaka, levha, şerit, folyo, kurşun tozu ve pulu imalatı (alaşımdan olanlar dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.43.02",
        "tanim": "Kurşun imalatı (işlenmemiş)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.43.04",
        "tanim": "Kalay bar, çubuk, profil, tel, vb. imalatı (alaşımdan olanlar dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.43.05",
        "tanim": "Kalay imalatı (işlenmemiş halde)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.43.06",
        "tanim": "Çinko imalatı (işlenmemiş halde)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.43.07",
        "tanim": "Çinko bar, çubuk, profil, tel vb. imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.43.08",
        "tanim": "Çinko sac, tabaka, levha, şerit, folyo, çinko tozları, vb. imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.44.01",
        "tanim": "Bakır, bakır matı, bakır tozu, semente bakır, bakır anotu ile bakır ve bakır alaşımlarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.44.03",
        "tanim": "Bakır sac, tabaka, levha, şerit, folyo imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.44.04",
        "tanim": "Bakırın çekilmesi ve haddelenmesi ile tüp, boru, bunların bağlantı elemanları, bar, çubuk, tel ve profil imalatı (alaşımdan olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "24.45.01",
        "tanim": "Maden cevherlerinden ya da oksitlerden işlenmemiş krom, manganez, nikel, tungsten, molibden, tantalum, kobalt, bizmut, titanyum, zirkonyum, berilyum, germanyum vb. imalatı (alaşımları dahil)(atık ve hurdalardan dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.45.02",
        "tanim": "Krom, manganez, tungsten, molibden, tantalum, kobalt, bizmut, titanyum, zirkonyum, berilyum, germanyum vb. diğer demir dışı metallerden yapılan ürünlerin imalatı (sermetler ve diğer ara ürünler dahil, nikelden olanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.45.06",
        "tanim": "Nikel matları, nikel oksit sinterleri ve diğer ara ürünleri ile nikel bar, çubuk, profil, tel, levha, şerit, folyo, tüp, boru ve bağlantı parçaları imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.46.00",
        "tanim": "Nükleer yakıtların işlenmesi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.51.13",
        "tanim": "Demir döküm",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.52.20",
        "tanim": "Çelik dökümü",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.53.01",
        "tanim": "Hafif metallerin dökümü",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.54.02",
        "tanim": "Değerli metallerin dökümü",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "24.54.90",
        "tanim": "Demir dışı diğer metallerin dökümü (değerli metallerin dökümü hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.11.06",
        "tanim": "İnşaat ve inşaatın parçaları için metal çatı ya da iskeletlerin imalatı (kuleler, direkler, destekler, köprüler vb.) (kepenk ve yangın merdiveni ile prefabrik yapılar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.11.07",
        "tanim": "Metalden kepenk ve yangın merdiveni imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.11.08",
        "tanim": "Metalden prefabrik yapı imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.12.04",
        "tanim": "Alüminyum kapı, pencere, bunların kasaları, kapı eşiği, panjur, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.12.05",
        "tanim": "Çelik kapı, pencere, bunların kasaları, kapı eşiği, panjur, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.12.06",
        "tanim": "Demir kapı, pencere, bunların kasaları, kapı eşiği, panjur, vb. imalatı (bahçe kapıları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.21.10",
        "tanim": "Merkezi ısıtma radyatörleri imalatı (elektrikli radyatörler ile döküm olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.21.11",
        "tanim": "Merkezi ısıtma kazanları (boyler) imalatı (kombi, kat kaloriferi ve diğer merkezi ısıtma kazanları,) (buhar jeneratörleri ve kızgın su üreten kazanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.21.12",
        "tanim": "Merkezi ısıtma radyatörleri imalatı, döküm olanlar (elektrikli radyatörler hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.21.13",
        "tanim": "Buhar üretim kazanları (buhar jeneratörü), kızgın su kazanları (boyler), denizcilik veya enerji kazanları ile bunların parçaları ile kazanlar (boylerler) için yardımcı üniteler ve buhar veya diğer buhar güç üniteleri için kondansatör imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.21.14",
        "tanim": "Nükleer reaktörler ve nükleer reaktör parçası imalatı (izotop ayırıcılar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.22.01",
        "tanim": "Metalden rezervuarlar, tanklar, fıçılar ve benzeri kapasitesi > 300 litre olan konteynerlerin imalatı (sıkıştırılmış veya sıvılaştırılmış gazlar için olanlar ile mekanik veya termal ekipmanlı olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.22.02",
        "tanim": "Sıkıştırılmış veya sıvılaştırılmış gaz için kullanılan metal konteynerlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.30.03",
        "tanim": "Tabanca, revolver (altıpatlar), av tüfeği, havalı tabanca, cop, vb. askeri amaçlı olmayan ateşli silahlar ve benzeri aletlerin ve bunların parçalarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.30.04",
        "tanim": "Askeri silah ve bunların parçalarının imalatı (büyük toplar, savaş araçları, füzeatarlar, torpil kovanları, ağır makineli tüfekler, vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.30.05",
        "tanim": "Bomba, füze ve benzeri savaş gereçleri, fişekler, diğer mermi ve mühimmatlar ile bunların parçalarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.40.04",
        "tanim": "Metallerin dövülmesi, preslenmesi, baskılanması ve damgalanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.40.05",
        "tanim": "Toz metalürjisi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.51.01",
        "tanim": "Metallerin nikel ile kaplanması (nikelajcılık) faaliyeti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.51.02",
        "tanim": "Metallerin kalay ile kaplanması (kalaycılık) faaliyeti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.51.09",
        "tanim": "Metallerin diğer malzemelerle kaplanması (ısıl işlem hariç)",
        "sinif": "çok Tehlikeli"
    },
    {
        "kod": "25.52.00",
        "tanim": "Metallerin ısıl işlemi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.53.01",
        "tanim": "Metallerin makinede işlenmesi (torna tesfiye işleri, metal parçaları delme, tornalama, frezeleme, rendeleme, parlatma, oluk açma, perdahlama, birleştirme, kaynak yapma, çapak alma, kumlama, vb. faaliyetler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.53.02",
        "tanim": "CNC oksijen, CNC plazma, CNC su jeti vb. makinelerinin kullanılması yoluyla metallerin kesilmesi veya üzerlerinin yazılması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.53.03",
        "tanim": "Lazer ışınlarının kullanılması yoluyla metallerin kesilmesi veya üzerlerinin yazılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.61.04",
        "tanim": "Kaşık, çatal, kepçe, kevgir, servis spatulası, şeker maşası ve benzeri mutfak gereçleri, sofra takımları, çatal bıçak takımları imalatı (balık bıçakları, kahvaltı ve meyve bıçakları dahil fakat, sofra bıçakları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.61.05",
        "tanim": "Tıraş bıçakları, usturalar ile jiletler ve tıraş makinelerinin bıçaklarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.61.06",
        "tanim": "Sofra bıçakları (balık bıçakları, kahvaltı ve meyve bıçakları hariç), budama bıçakları, sustalı bıçaklar, satır,balta vb. bıçaklar (makineler için olanlar hariç) ile terzi makasları, vb. makaslar ve bunların ağızlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.61.07",
        "tanim": "Manikür veya pedikür setleri ve aletleri, kağıt bıçakları, mektup açacakları, kalemtıraşlar ve bunların bıçakları, kırma, yarma ve kıyma bıçakları, saç kesme ve hayvan kırkma makine ve aletleri ile benzeri elektriksiz kesici aletlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.61.08",
        "tanim": "Kılıç, pala, kasatura, mızrak, süngü, avcı bıçağı ve benzeri silahlar ile bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.62.04",
        "tanim": "Kilit ve menteşe imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.63.01",
        "tanim": "Metalden kalıp ve döküm modeli imalatı (kek ve ayakkabı kalıpları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.63.02",
        "tanim": "Plastikten kalıp ve döküm modeli imalatı (kek ve ayakkabı kalıpları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.63.03",
        "tanim": "Ahşap ve diğer malzemelerden kalıp ve döküm modeli imalatı (kek ve ayakkabı kalıpları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.63.04",
        "tanim": "El aletleri, takım tezgahı uçları, testere ağızları, mengeneler, kıskaçlar, sıkıştırma anahtarları vb. imalatı (makineler veya mekanik cihazlar için değiştirilebilen uçlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.91.01",
        "tanim": "Çelik varil ve benzer muhafazaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.92.01",
        "tanim": "Demir veya çelikten yiyecek, içecek ve diğer ürünler için kapasitesi < 50 litre olan kutuların imalatı (lehim veya kıvrılarak kapatılanlar) (tenekeden olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.92.02",
        "tanim": "Adi metalden dişli kapaklar (şişe kapağı vb.) ve tıpalar ile tıkaçlar ve kapakların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.92.03",
        "tanim": "Kapasitesi 300 lt.yi geçmeyen alüminyum varil fıçı, kova vb. imalatı (diş macunu, krem gibi kapaklı tüpler ve katlanabilir kutular ile aerosol kutuları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.93.01",
        "tanim": "Metalden zincirler (mafsallı bağlantı zinciri hariç) ve parçaları ile yay ve yay yaprakları, kaplanmış veya nüveli teller, çubuklar, tüpler, levhalar ve elektrotların imalatı (elektrik işlerinde kullanılanlar ile elektrik yalıtımı olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.93.02",
        "tanim": "İğne, çengelli iğne, çuvaldız, örgü şişi, tığ, raptiye, çivi, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.93.03",
        "tanim": "Telden yapılan diğer ürünlerin imalatı (örgülü tel, örme şerit,örme halat, taşıma askısı, dikenli tel (elektrik yalıtımı olanlar hariç) ve demir, çelik veya bakır tellerden mensucat, ızgara, ağ, kafeslik ve çitler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.94.01",
        "tanim": "Yivsiz bağlantı malzemeleri imalatı, demir, çelik veya bakırdan (rondelalar, perçinler, perçin çivileri, kamalı pimler, kopilyalar vb. ürünler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.94.02",
        "tanim": "Yivli bağlantı malzemeleri imalatı, demir, çelik veya bakırdan (vidalar, cıvatalar, somunlar vb. yivli ürünler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.01",
        "tanim": "Demir, çelik ve alüminyumdan sofra ve mutfak eşyalarının imalatı (tencere, tava, çaydanlık, cezve, yemek kapları, bulaşık telleri vb.) (teflon, emaye vb. ile kaplanmışlar dahil, bakırdan olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.02",
        "tanim": "Metalden yapılmış eviye, lavabo, küvet, duş teknesi, jakuzi (emaye olsun ya da olmasın) ve diğer sıhhi ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.03",
        "tanim": "Zırhlı veya güçlendirilmiş kasalar, kasa daireleri, kilitli para kasaları, zırhlı kapılar vb. imalatı (adi metalden)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.04",
        "tanim": "Adi metalden büro malzemeleri imalatı (dosya kutuları, kaşeler, zımba telleri, kağıt ataçları vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.05",
        "tanim": "Adi metalden tokalar, klipsli çanta sapları, kemer tokaları, kancalar, halkalar, kuş gözü halkalar ve benzerleri (giysi, ayakkabı, tente, el çantası, seyahat eşyası veya diğer hazır eşya için kullanılan türde) ile adi metallerden boru şeklinde veya çatallı perçinler; boncuklar vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.06",
        "tanim": "Bakırdan sofra ve mutfak eşyası imalatı (cezve, tencere, çanak, tabak, ibrik vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.08",
        "tanim": "Metalden gemi ve tekne pervaneleri ve bunların aksamları ile çıpalar, filika demirleri vb. imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.99.12",
        "tanim": "Kalıba dökülerek yapılan zil, çan, gong vb. eşyalar ile adi metallerden kalıba dökülerek yapılan biblo, heykelcik ve diğer süs eşyası imalatı (bisiklet zilleri dahil ancak bakırdan olanlar ile mutfak eşyaları hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.99.13",
        "tanim": "Metalden çatı olukları, çatı kaplamaları vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.14",
        "tanim": "Adi metallerden işaret levhaları ve tabelalar ile rakamlar, harfler ve diğer sembollerin imalatı (oto plakaları dahil, ışıklı olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.15",
        "tanim": "Kurşun tüp, boru ve bunların bağlantı parçaları ile kurşun bar, çubuk, profil, tel vb. imalatı (alaşımdan olanlar dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "25.99.18",
        "tanim": "Bakırdan yapılan biblolar, çerçeveler, aynalar ve diğer süsleme eşyaları ile süsleme işleri (mutfak eşyaları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.21",
        "tanim": "Metalden elektriksiz hazneli döner bacaların, havalandırma kanallarının vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "25.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer fabrikasyon metal ürünlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.11.04",
        "tanim": "Diyotların, transistörlerin, diyakların, triyaklar, tristör, rezistans, ledler, kristal, röle, mikro anahtar, sabit veya ayarlanabilir direnç ve kondansatörler ile elektronik entegre devrelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.11.05",
        "tanim": "Katot ışınlı görüntü tüpleri, televizyon kamerası tüpleri ve magnetronlar, klistronlar, mikrodalga tüpleri ve diğer valf tüplerinin, LCD ve plazma TV panelleri ve göstergelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.11.06",
        "tanim": "Çıplak baskılı devre kartlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.11.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer elektronik bileşenlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.12.01",
        "tanim": "Yüklü elektronik kart imalatı (yüklü baskılı devre kartları, ses, görüntü, denetleyici, ağ ve modem kartları ile akıllı kartlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.20.01",
        "tanim": "Bilgisayar ve bilgisayar çevre birimleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.02",
        "tanim": "Radyo ve televizyon stüdyoları ve yayın teçhizatları ile radyo ve televizyon iletim cihazlarının imalatı (tv kameraları ve baz istasyonları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.03",
        "tanim": "Kızıl ötesi (enfraruj) sinyal kullanan iletişim cihazlarının imalatı (örn: uzaktan kumanda cihazları)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.05",
        "tanim": "Alıcı ve verici antenlerin imalatı (harici, teleskopik, çubuk, uydu, çanak ve hava ve deniz taşıtlarının antenleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.06",
        "tanim": "Kablolu ve kablosuz telefon, cep telefonu, kablolu görüntülü telefon, çağrı cihazı ve faks cihazı imalatı (telesekreter imalatı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.08",
        "tanim": "Merkezi iletişim santral donanımları ile sayısal veya analog telefon-telgraf santrallerinin ve ağ geçitleri, köprüleri, yönlendiricileri gibi veri iletim donanımlarının imalatı (mors veya mors tipi kaydedici ve anahtarlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.09",
        "tanim": "Hırsız ve yangın alarm sistemleri ve kapı konuşma sistemlerinin (diyafon) (görüntülü olanlar dahil) imalatı (motorlu kara taşıtları için alarm sistemleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.10",
        "tanim": "Ses, görüntü veya diğer verilerin alınması, dönüştürülmesi, iletilmesi/yeniden oluşturulması için kullanılan diğer makinelerin imalatı (alıcısı/vericisi bulunan telgraf, teleks cihazları ile anahtarlama ve yönlendirme cihazları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.30.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer iletişim ekipmanlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.08",
        "tanim": "Ses ve görüntü oynatıcı ve kaydedicileri, ev tipi video kameralar ve diğer görüntü kayıt veya görüntü çoğaltma cihazlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.09",
        "tanim": "Radyo ve televizyon imalatı (taşıtlarda kullanılanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.10",
        "tanim": "Mikrofon, hoparlör ve kulaklıklar ile elektrikli ses yükselteçlerinin (amplifikatörler) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.11",
        "tanim": "Monitörler ve projektörlerin imalatı (bilgisayar gibi bir otomatik veri işleme sisteminde kullanılmayanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.12",
        "tanim": "Video oyun ve konsollarının (televizyonla kullanılanlar ve kendi ekranı olanlar) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.40.99",
        "tanim": "Başka yerde sınıflandırılmamış tüketici elektroniği ürünlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.01",
        "tanim": "Hırsız ve yangın alarm sistemleri imalatı (bir kontrol istasyonuna sinyal gönderenler) (motorlu kara taşıtları için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.02",
        "tanim": "Dedektör imalatı (yeraltı kaynakları, maden, mayın, güvenlik kontrol, radyasyon vb. dedektörleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.03",
        "tanim": "Elektrik miktarını (volt, akım vb.) ölçmek ve kontrol etmek için kullanılan alet ve cihazların imalatı (avometre, voltmetre, osiloskop ile diğer voltaj, akım, direnç veya elektrik gücünü ölçüm veya kontrol için olanlar) (elektrik sayaçları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.04",
        "tanim": "Hız ve mesafe ölçümünde kullanılan alet ve cihazların imalatı (taşıt hız göstergesi, takometre, taksimetre vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.05",
        "tanim": "Isı ve sıcaklık ölçümünde kullanılan alet ve cihazların imalatı (termometre, termostat, pirometre vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.06",
        "tanim": "Işık, ışın ve renk ölçümünde kullanılan alet ve cihazların imalatı (polarimetre, kolorimetre, refraktometre vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.07",
        "tanim": "Meteorolojide kullanılan alet ve cihazların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.08",
        "tanim": "Yön bulma pusulaları ile diğer seyrüsefer alet ve cihazlarının, radar ve sonar cihazlarının imalatı (hava, kara ve deniz taşımacılığında kullanılanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.09",
        "tanim": "Hava, sıvı ve gazların akış, seviye, basınç veya diğer değişkenlerini ölçme ve kontrol etme için kullanılan aletlerin imalatı (hidrometre, debimetre, barometre, higrometre vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.10",
        "tanim": "Gaz, sıvı veya elektrik üretim veya tüketim sayaçlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.11",
        "tanim": "Teçhizatlı çizim masaları ve makineleri ile diğer çizim, işaretleme veya matematiksel hesaplama aletlerinin imalatı (pergel takımı, pantograf, resim, çizim, hesap yapmaya mahsus elektrikli/elektronik çiziciler vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.12",
        "tanim": "Laboratuvar, kuyumculuk vb. yerlerde kullanılan hassas tartıların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.13",
        "tanim": "Sanayide kullanılan işlem kontrol amaçlı teçhizatların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.14",
        "tanim": "Telemetreler, teodolitler ve diğer arazi ölçümü, hidrografik, oşinografik, hidrolojik veya jeofizik alet ve cihazlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.15",
        "tanim": "Seyrüsefere yardımcı telsiz cihazları ile uzaktan kumandalı kontrol cihazlarının (roketler, füzeler, makineler vb) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.51.99",
        "tanim": "Başka yerde sınıflandırılmamış ölçme, test ve seyrüsefer amaçlı alet ve cihazların imalatı (hidrolik veya pnömatik otomatik ayar veya kontrol aletleri ile milometreler, pedometreler, stroboskoplar, monostatlar, kumpaslar, spektrometreler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.52.03",
        "tanim": "Devam kayıt cihazları, zaman kayıt cihazları, parkmetreler; duvar ve kol saati makineli zaman ayarlı anahtarların imalatı (vardiya saati vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.52.04",
        "tanim": "Kol, masa, duvar ve cep saatlerinin, bunların makinelerinin, kasalarının ve diğer parçalarının imalatı (kronometreler ve taşıtlar için gösterge panellerinde bulunan saatler ve benzeri tipteki saatler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.60.01",
        "tanim": "Işınlama, elektro medikal ve elektro terapi ile ilgili cihazların imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "26.70.11",
        "tanim": "Objektif merceği, levha ve tabaka halinde polarizan madde, renk filtresi, optik mercek, prizma, ayna ve diğer optik elemanlar ile dürbün, optik mikroskop, optik teleskop ve diğer astronomik aletler ile bunların aksam ve parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.12",
        "tanim": "Mikrofilm, mikrofiş ve diğer mikroform okuyucuların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.13",
        "tanim": "Sinematografik kameraların ve projektörlerin, diyapozitif (slayt) ve diğer projektörlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.16",
        "tanim": "Fotoğraf makinesi imalatı (dijital, anında görüntü basan, dokümanların mikrofilm, vb. üzerine kaydedilmesinde, deniz altında, hava fotoğrafçılığında, adli tıp veya kriminolojik laboratuvarlarda, vb. kullanılanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.19",
        "tanim": "Flaş lambaları, fotografik agrandisörler (büyütücüler), fotoğraf laboratuvarları için cihazlar, negatoskoplar (ince ışıklı panel), projeksiyon ekranları, likit kristal cihazlar ile lazerlerin (lazer diyotlar hariç) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.20",
        "tanim": "Boş manyetik ses ve görüntü kaset bantlarının imalatı (plak dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.21",
        "tanim": "Manyetik şeritli kartların imalatı (boş telefon kartı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.22",
        "tanim": "Boş CD, DVD, disket, mavi ışınlı (blu-ray) disk, vb. ürünlerin imalatı (disk üretimi için kullanılan kalıp (matris) ve master dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "26.70.99",
        "tanim": "Başka yerde sınıflandırılmamış manyetik ve optik ortamların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.11.01",
        "tanim": "Elektrik motoru, jeneratör ve transformatörlerin imalatı (aksam ve parçaları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.11.03",
        "tanim": "Elektrik motoru, jeneratör ve transformatörlerin aksam ve parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.12.01",
        "tanim": "Elektrik dağıtım ve kontrol cihazları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.12.02",
        "tanim": "Elektrik dağıtım ve kontrol cihazlarının aksam ve parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.20.01",
        "tanim": "Elektrik akümülatör parçalarının imalatı (akümülatör plakaları, separatörler, kurşun ızgaralar) (akümülatör kutu ve kapaklarının imalatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "27.20.02",
        "tanim": "Şarj edilemeyen (birincil) pil ve bataryalar ile bunların aksam ve parçalarının imalatı (manganez dioksitli, cıva oksitli, gümüş oksitli, lityum oksitli, çinko-hava reaksiyonlu pil ve bataryalar)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "27.20.03",
        "tanim": "Akümülatör imalatı (kurşun asitli, nikel kadmiyum, nikel metal hidrit, lityum-iyon, lityum polimer, nikel demir ve diğer elektrik akümülatörleri)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "27.20.04",
        "tanim": "Şarj edilebilir pil ve batarya ile bunların parçalarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "27.20.05",
        "tanim": "Akümülatör kutu ve kapaklarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.31.04",
        "tanim": "Fiber optik kabloların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.32.03",
        "tanim": "Diğer elektronik ve elektrikli teller ve kabloların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.33.00",
        "tanim": "Kablolamada kullanılan gereçlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.01",
        "tanim": "Ampul, flaş küpü ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.02",
        "tanim": "Hava ve motorlu kara taşıtları için monoblok far üniteleri, kara, hava ve deniz taşıtları için elektrikli aydınlatma donanımları veya görsel sinyalizasyon ekipmanları imalatı (polis araçları, ambulans vb. araçların dış ikaz lambaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.03",
        "tanim": "Avize, aplik ve diğer elektrikli aydınlatma armatürleri, sahne, fotoğraf veya sinema stüdyoları için projektörler ve spot ışıkları, elektrikli masa lambaları, çalışma lambaları, abajur vb. lambaların imalatı (süsleme için ışıklandırma setleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.04",
        "tanim": "Sokak aydınlatma donanımlarının imalatı (trafik ışıkları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.05",
        "tanim": "Pil, akümülatör veya manyeto ile çalışan portatif elektrik lambaları ve elektriksiz lambalar ile el feneri, gaz ve lüks lambası vb. aydınlatma armatürlerinin imalatı (taşıtlar için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.06",
        "tanim": "Işıklı tabela, ışıklı reklam panosu ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.40.99",
        "tanim": "Başka yerde sınıflandırılmamış aydınlatma ekipmanları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.02",
        "tanim": "Ev tipi elektrikli su ısıtıcıları (depolu su ısıtıcıları, anında su ısıtıcıları, şofben, termosifon dahil), elektrikli ısıtma cihazları (elektrikli soba, radyatör, vb.) ve elektrikli toprak ısıtma cihazlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.03",
        "tanim": "Ev tipi elektrikli süpürge ve halı temizleme/yıkama makineleri ile kuru veya ıslak elektrikli süpürgeler, şarjlı veya pilli el süpürgelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.04",
        "tanim": "Mutfakta kullanılan elektrikli küçük ev aletlerinin imalatı (çay veya kahve makinesi, semaver, ızgara, kızartma cihazı, ekmek kızartma makinesi, mutfak robotu, mikser, blender, meyve sıkacağı, et kıyma makinesi, tost makinesi, fritöz vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.05",
        "tanim": "Elektrikli diğer küçük ev aletleri (elektrotermik el kurutma makinesi, elektrikli ütü, havlu dispenseri, hava nemlendirici) ile elektrikli battaniyelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.06",
        "tanim": "Elektrikli kişisel bakım eşyalarının imalatı (elektrikli tıraş makinesi, epilatör ve saç kesme makinesi, elektrotermik saç şekillendirme makinesi (saç kurutma makinesi, bigudi, tarak, saç maşası), elektrikli diş fırçası, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.07",
        "tanim": "Elektrikli ev aletleri aksam ve parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.08",
        "tanim": "Ev tipi buzdolabı, dondurucu, çamaşır makinesi, çamaşır kurutma makinesi, bulaşık makinesi, vantilatör, aspiratör, fan, aspiratörlü davlumbaz, fırın, ocak, mikrodalga fırın, elektrikli pişirme sacı vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.51.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer elektrikli ev aletlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.52.02",
        "tanim": "Elektriksiz ev tipi gaz, sıvı veya katı yakıtlı soba, kuzine, ızgara, şömine, mangal, semaver, su ısıtıcısı (termosifon, şofben vb.) vb. aletlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.52.05",
        "tanim": "Elektriksiz yemek pişirme cihazlarının imalatı (gaz yakıtlı set üstü ocaklar, gaz veya sıvı yakıtlı fırınlar ve ocaklar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.52.06",
        "tanim": "Elektriksiz ev aletlerinin aksam ve parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.90.01",
        "tanim": "Elektro kaplama makinelerinin imalatı (galvanoplasti, elektro kaplama, elektroliz veya elektroforez için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.90.03",
        "tanim": "Elektrikli sinyalizasyon, güvenlik veya trafik kontrol ekipmanlarının imalatı (demir yolları, kara yolları, iç su yolları, taşıt park alanları, limanlar ve hava meydanları için) (trafik ışıkları ve sinyal donanımları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.90.04",
        "tanim": "Karbon elektrotlar ve elektrik işlerinde kullanılan grafitten veya karbondan diğer ürünlerin imalatı (ısıtıcı kömür rezistanslar, pil kömürleri, ark lambaları ve diğer lambalar için kömürler vb. dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "27.90.05",
        "tanim": "Elektrikli kaynak ve lehim teçhizatı (lehim havyaları, ark kaynak makineleri, endüksiyon kaynak makineleri vb.) ile metallerin veya sinterlenmiş metal karbürlerin sıcak spreylenmesi için elektrikli makine ve cihazlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.90.06",
        "tanim": "Sıvı kristal cihazlı (LCD) veya ışık yayan diyotlu (LED) gösterge panelleri ile bys. elektrikli sesli veya görsel sinyalizasyon cihazlarının imalatı (elektronik sayı levhası (skorbord) dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "27.90.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer elektrikli ekipmanların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.11.08",
        "tanim": "Türbin ve türbin parçalarının imalatı (rüzgar, gaz, su ve buhar türbinleri ile su çarkları ve bunların parçaları) (hava taşıtları için turbo jetler veya turbo pervaneler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.11.09",
        "tanim": "Deniz taşıtlarında, demir yolu taşıtlarında ve sanayide kullanılan kıvılcım ateşlemeli veya sıkıştırma ateşlemeli içten yanmalı motorların ve bunların parçalarının imalatı (hava taşıtı, motorlu kara taşıtı ve motosiklet motorları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.11.10",
        "tanim": "İçten yanmalı motorlar, dizel motorlar vb.de kullanılan pistonlar, silindirler ve silindir blokları, silindir başları, silindir gömlekleri, emme ve egzos subapları, segmanlar, hareket kolları, karbüratörler, yakıt memeleri vb.nin imalatı  (hava taşıtı, motorlu kara taşıtı ve motosiklet motorları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.12.05",
        "tanim": "Akışkan gücü ile çalışan ekipmanların ve bunların parçalarının imalatı (hidrolik ve pnömatik motorlar, hidrolik pompalar, hidrolik ve pnömatik valfler, hidrolik sistemler ve bunların parçaları)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.13.01",
        "tanim": "Hava veya vakum pompaları ile hava veya diğer gaz kompresörlerinin imalatı (el ve ayakla çalışan hava pompaları ile motorlu taşıtlar için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.13.02",
        "tanim": "Sıvı pompaları ve sıvı elevatörleri imalatı (yakıt, yağlama, soğutma ve diğer amaçlar için) (deplasmanlı ve santrifüjlü pompalar ile benzinliklerde kullanılan akaryakıt pompaları dahil) (tulumba dahil, içten yanmalı motorlar için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.13.03",
        "tanim": "El ve ayakla çalışan hava pompalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.13.04",
        "tanim": "İçten yanmalı motorlara monte edilmek üzere tasarlanmış pompaların imalatı (yağ pompaları, yakıt pompaları (benzin, mazot vb. pompaları) ve soğutma pompaları)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.14.01",
        "tanim": "Sanayi musluk, valf ve vanaları, sıhhi tesisat ve ısıtmada kullanılan musluk ve vanalar ile doğalgaz vanaları, dökme olanlar",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "28.14.02",
        "tanim": "Sanayi musluk, valf ve vanaları, sıhhi tesisat ve ısıtmada kullanılan musluk ve vanalar ile doğalgaz vanaları, dökme olanlar hariç",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.15.01",
        "tanim": "Rulmanlar ve mekanik güç aktarma donanımları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.15.02",
        "tanim": "Debriyajlar (kavramalar), mil (şaft) kaplinler ve üniversal mafsalların imalatı (motorlu kara taşıtlarında kullanılan debriyajlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.15.03",
        "tanim": "Dişliler/dişli takımları, bilyeli ve makaralı vidalar, şanzımanlar, vites kutuları ve diğer hız değiştiricilerin imalatı (motorlu kara taşıtlarında kullanılan vites kutuları ve diferansiyelleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.15.04",
        "tanim": "Volanlar ve kasnaklar ile mafsallı bağlantı zincirleri ve güç aktarım zincirlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.21.07",
        "tanim": "Elektrikli veya elektriksiz laboratuar ocakları, döküm ocakları vb. endüstriyel ocak ve fırınlarının imalatı (çöp yakma fırınları ile elektrikli ekmek ve unlu mamul fırınları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.21.10",
        "tanim": "Güneşle (güneş kolektörleri), buharla ve yağla ısıtma sistemleri ile benzeri ocak ve ısınma donanımları gibi elektriksiz ev tipi ısıtma, soğutma, havalandırma donanımlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.21.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer fırın ve ocakların (sanayi ocakları) imalatı (ocak brülörleri (ateşleyicileri), endüksiyon veya dielektrik ısıtma ekipmanları, mekanik kömür taşıyıcıları, mekanik ızgaralar, mekanik kül boşaltıcıları ve benzeri cihazların imalatı, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.22.10",
        "tanim": "El veya motor gücü ile çalışan kaldırma, taşıma, yükleme ya da boşaltma makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.22.11",
        "tanim": "Asansör, yürüyen merdiven ve yürüyen yolların imalatı (yeraltında kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.22.12",
        "tanim": "Pnömatik ve diğer devamlı hareketli asansör, elavatör ve konveyörlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.22.90",
        "tanim": "Diğer kaldırma, taşıma, yükleme veya boşaltma makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.23.00",
        "tanim": "Büro makine ve ekipmanları imalatı (bilgisayarlar ve çevre birimleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.23.90",
        "tanim": "Diğer büro makine ve ekipmanları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.24.01",
        "tanim": "Motorlu veya pnömatik (hava basınçlı) el aletlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.25.01",
        "tanim": "Sanayi tipi soğutucu ve dondurucu donanımları ile ısı pompalarının imalatı (camekanlı, tezgahlı veya mobilya tipi soğutucular, kondenserleri ısı değiştiricisi fonksiyonu gören kompresörlü üniteler vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.25.02",
        "tanim": "Sanayi tipi fan ve vantilatörlerin imalatı (çatı havalandırma pervaneleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.25.03",
        "tanim": "İklimlendirme cihazlarının (klimalar) imalatı (motorlu taşıtlarda kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.25.04",
        "tanim": "Isı değiştirici birimlerin (eşanjörler), hava veya diğer gazların sıvılaştırılmasında kullanılan makinelerin ve hava/gazların filtrelenmesi ve arıtılması için kullanılan makine ve cihazların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.04",
        "tanim": "Sıvılar için filtreleme veya arıtma makine ve cihazlarının imalatı (suyun filtre edilmesi/arıtılmasına mahsus cihazlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.05",
        "tanim": "Doldurma, paketleme ve ambalajlama makinelerinin imalatı (doldurma, kapatma, mühürleme, kapsülleme veya etiketleme ve içecekleri gazlandırma vb. için makineler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.07",
        "tanim": "Metal tabakalardan contaların ve mekanik salmastraların imalatı (diğer malzemelerle birleştirilmiş metal tabakalardan veya iki ya da daha fazla metal tabakasından yapılmış olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.08",
        "tanim": "Tartı aletleri ve baskül imalatı (ev ve dükkanlarda kullanılan terazi ve kantarlar, sürekli ölçüm için tartılar, taşıt baskülleri (köprü tipi basküller) vb.) (kuyumculukta ve laboratuvarlarda kullanılan hassas tartılar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.10",
        "tanim": "Yangın söndürücüler, püskürtme tabancaları, buhar veya kum püskürtme makineleri vb. sıvı ve tozları atan, dağıtan ya da püskürten mekanik cihazların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.18",
        "tanim": "İçten yanmalı motorlar için yağ filtresi, yakıt filtresi, hava filtresi, gres nipelleri, yağ keçesi ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.29.90",
        "tanim": "Diğer genel amaçlı makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.08",
        "tanim": "Tarımsal amaçlı römork veya yarı römork imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.09",
        "tanim": "Yumurta, meyve ve diğer tarımsal ürünlerin temizlenmesi, tasnif edilmesi veya derecelendirilmesi için kullanılan makine ve ekipmanların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.10",
        "tanim": "Traktörlerin ve yaya kontrollü traktörlerin (motokültörler) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.11",
        "tanim": "Kümes hayvanı makineleri, arıcılık makineleri ve hayvan yemi hazırlama makinelerinin ve donanımlarının imalatı (kuluçka makineleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.12",
        "tanim": "Çim biçme makinelerinin imalatı (traktörlere monte edilen kesici barlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.13",
        "tanim": "Hasat ve harman makinelerinin imalatı (biçer döver, saman yapma makinesi, ot ve saman balyalama makinesi, kök ve yumru hasat makinesi, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.14",
        "tanim": "Pulluk, saban, tırmık, diskaro, skarifikatör, kültivatör, çapa makinesi, mibzer, fide ve fidan dikim makinesi vb. toprağın hazırlanmasında, ekiminde, dikiminde kullanılan aletler ile gübreleme makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.15",
        "tanim": "Süt sağma makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.16",
        "tanim": "Tarım ve bahçecilikte kullanılan hava, sıvı veya toz atma, dağıtma, püskürtme ve iklimlendirme makinelerinin imalatı (sulama cihazları, pülverizatörler, zirai mücadelede kullanılan portatif sıvı ve toz püskürtücüler, don pervaneleri vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.30.90",
        "tanim": "Ormancılığa özgü makineler ile tarla bahçe bakımına mahsus diğer makine ve cihazların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.41.01",
        "tanim": "Takım tezgahları (metal işlemek için lazer ve benzerleriyle çalışanlar) ile metal ve benzerlerini işlemek için işleme merkezlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.41.03",
        "tanim": "Metal tornalama, delme, frezeleme ve planyalama takım tezgahlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.41.07",
        "tanim": "Metal işleyen takım tezgahlarının parça ve aksesuarlarının imalatı (alet tutacakları ve kendinden açılan pafta kafaları, iş tutacakları, ayırıcı kafalar ve takım tezgahları için diğer özel aksesuarlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.41.90",
        "tanim": "Metal işlemek için kullanılan diğer takım tezgahlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.42.01",
        "tanim": "Ahşap, mantar, kemik, sert kauçuk, sert plastik veya benzeri sert malzemeleri işlemek için olan takım tezgahı ile bunların parçalarının imalatı (transfer, testere, planya, freze, taşlama, zımparalama, parlatma, bükme, delme, dilimleme, pres, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.42.02",
        "tanim": "Takım tezgahları ve el aletleri için takım tutucuları ve kendinden açılan pafta kafaları, işlenecek parça tutucuları, bölme başlıkları ve diğer özel ek parçalar, dingiller, yüksükler ve rakorlar ile fikstürlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.42.03",
        "tanim": "Taş, seramik, beton veya benzeri mineral malzemeleri işlemek veya camı soğuk işlemek için olan takım tezgahı ile bunların parçalarının imalatı (testere, taşlama, parlatma, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.42.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer takım tezgahlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.91.01",
        "tanim": "Konvertörler (metalürji), külçe kalıpları (ingot kalıpları), döküm kepçeleri, döküm makineleri, vb. sıcak metallerin işlenmesi için kullanılan makine ve teçhizatın imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.91.02",
        "tanim": "Sıcak ve soğuk metal haddeleme makinesi ve metal boru imaline özgü hadde makinesi ile hadde ve metalürji makineleri için silindir ve diğer parçaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.01",
        "tanim": "Beton ve harç karıştırıcılarının imalatı (mikserler dahil, beton karıştırıcılı (mikserli) kamyonlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.02",
        "tanim": "Buldozer, angledozer, greyder, skreyper, düzleyici, önden küreyici-yükleyici, kepçeli yükleyici, mekanik kepçe, ekskavatör, kazık çakma (kazık varyosları) ve sökme makineleri, harç ve asfalt yayıcılar ile beton kaplama makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.03",
        "tanim": "Taş, toprak, cevher, alçı, çimento ve diğer mineral maddeleri tasnif etme, eleme, ayırma, yıkama, ezme, öğütme, karıştırma, yoğurma vb. işlemden geçirme için kullanılan makinelerin imalatı (beton ve harç karıştırıcılar (mikserler) hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.05",
        "tanim": "Kömür veya kaya kesicileri (havözler), tünel ve kuyu açma makineleri ile delme ve sondaj makinelerinin imalatı (yer altı veya yer üstü)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.06",
        "tanim": "Yer altı kullanımı için sürekli hareketli elevatör ve konveyörlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.08",
        "tanim": "Paletli traktörlerin imalatı (inşaat veya madencilikte kullanılan traktörler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.09",
        "tanim": "Kara yolu dışında kullanılan damperli kamyonların imalatı (mega kamyonlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.10",
        "tanim": "Kar küreyici ve püskürtücüleri, toprağı sıkıştırmaya veya bastırıp sıkıştırmaya mahsus makineler ile maden, taş ocağı, inşaat, imar, park vb. işler için kullanılan diğer makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.92.11",
        "tanim": "Delme, sondaj, hafriyat ve kazı makinesi parçalarının, vinç ve hareketli kaldırma kafeslerinin ve toprak, taş ve benzeri maddeleri tasnifleme, öğütme, karıştırma veya diğer işlerde kullanılan makine parçalarının imalatı (buldozer bıçakları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.02",
        "tanim": "Şarap, meyve suyu ve benzeri içeceklerin imalatında kullanılan makinelerin imalatı (presler, eziciler ve benzeri makineler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.03",
        "tanim": "Süt ürünleri makinelerinin ve santrifüjlü krema ayırıcılarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.04",
        "tanim": "Tütünün hazırlanmasında ve işlenmesinde kullanılan makinelerin imalatı (tütün yapraklarını damarlarından ayıran makineler ile enfiye, sigara, puro, pipo tütünü veya çiğneme tütünleri imalinde kullanılan makineler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.06",
        "tanim": "Değirmencilik sanayiinde, hububat veya kurutulmuş sebzelerin işlenmesi veya öğütülmesi için kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.07",
        "tanim": "Ekmek ve diğer unlu mamuller için elektrikli olmayan fırınların imalatı (gaz, sıvı ve katı yakıtlı olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.08",
        "tanim": "Ev tipi olmayan pişirme veya ısıtma cihazlarının imalatı (ev tipi olmayan filtreli kahve makineleri vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.09",
        "tanim": "Tarımsal ürünler için kurutucuların imalatı (kahve, kuruyemiş vb. için kavurma makine ve cihazları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.10",
        "tanim": "Tohumların, tanelerin veya kuru baklagillerin temizlenmesi, tasnif edilmesi veya derecelendirilmesi için kullanılan makinelerin imalatı (tarımsal selektörler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.93.99",
        "tanim": "Gıda ve içeceklerin endüstriyel olarak hazırlanması veya imalatı için başka yerde sınıflandırılmamış makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.01",
        "tanim": "Post, deri ve köselelerin işlenmesi ile ayakkabı ve diğer deri eşyaların üretimi veya tamiri için kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.02",
        "tanim": "Sanayi tipi çamaşır makinesi, kuru temizleme makinesi, çamaşır kurutma makinesi, ütü makinesi ve pres ütü imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.03",
        "tanim": "Sanayi ve ev tipi dikiş makinelerinin imalatı (dikiş makinelerinin iğneleri, mobilyaları, tabanları, kapakları vb. parçaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.04",
        "tanim": "Suni ve sentetik tekstil malzemesinin ekstrüzyonu, çekilmesi, tekstüre edilmesi veya kesilmesi için kullanılan makineler ile doğal tekstil elyafı hazırlama makineleri ve dokuma makinelerinin imalatı (çırçır makinesi, taraklama makinesi vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.05",
        "tanim": "Tekstil ipliği ve kumaşını yıkama, ağartma, boyama, apreleme, temizleme, sıkma, sarma, emprenye etme, bitirme, kesme, surfile ve benzerleri için makineler ile keçe imalatında ve bitirilmesinde kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.06",
        "tanim": "Tekstil büküm makineleri ile katlama, bükme, bobine sarma veya çile yapma makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.07",
        "tanim": "Örgü, trikotaj ve benzeri makineler ile tafting makinelerinin imalatı (gipe iplik, tül, dantel, nakış, süs, örgü veya ağ yapma makineleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.08",
        "tanim": "Tekstil amaçlı makinelerle kullanılan yardımcı makinelerin ve tekstil baskı makinelerinin imalatı (ratiyerler, jakardlar, vb.) (ofset baskı makineleri, tipografik, fleksografik, gravür baskı makineleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.94.09",
        "tanim": "Tekstil, giyim eşyası ve deri üretiminde kullanılan makinelerin parçalarının imalatı (dikiş makinelerinde kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.95.01",
        "tanim": "Kağıt ve mukavva üretiminde kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.96.01",
        "tanim": "Plastik ve kauçuk makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.97.00",
        "tanim": "Katmanlı (eklemeli) imalat makineleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.01",
        "tanim": "Basım ve ciltleme makineleri ile basıma yardımcı makinelerin ve bunların parçalarının imalatı (ofset baskı makinesi, tipografik baskı makinesi, dizgi makinesi, baskı kalıpları için makineler, ciltleme makinesi vb.) (büro tipi baskı makinesi hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.02",
        "tanim": "Cam ve cam eşya imalatında ve cam eşyaların sıcak işlenmesinde kullanılan makinelerin ve elektrikli veya elektronik lamba, tüp, ampul montajında kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.04",
        "tanim": "Kiremit, briket, şekilli seramik hamuru, boru, grafit elektrotu, yazı tahtası tebeşiri vb. ürünlerin üretilmesinde kullanılan makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.05",
        "tanim": "Otomatik bovling salonu donanımlarının, dönme dolap, atlı karınca, salıncak, poligon, vb. diğer panayır alanı eğlence donanımları ile kumarhane oyun masalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.06",
        "tanim": "Hava taşıtı fırlatma donanımlarının, uçak gemilerinde kullanılan katapultların (kısa mesafede hava taşıtlarının kalkmasını sağlayan mekanizma) ve ilgili donanımların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.07",
        "tanim": "Yarı iletken tek kristalli külçe (boules) ve yonga plakalar ile yarı iletken aygıtların, elektronik entegre devre veya düz panel ekranların imalatı için kullanılan makine ve cihazların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.08",
        "tanim": "Sicim ve halat makinelerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.09",
        "tanim": "Lastik tekerlerin balansında ve hizalanmasında kullanılan donanımların imalatı (jant için kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.10",
        "tanim": "Özel amaçlar için çoklu görevlerde kullanılabilen sanayi robotlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.11",
        "tanim": "Kurutucuların imalatı (odun, kağıt hamuru, kağıt, mukavva, süt tozu ve diğer malzemelerin imalatında kullanılanlar) (ev tipi, tarım ürünleri ve tekstil için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "28.99.12",
        "tanim": "İzotopik ayırma makineleri ve cihazlarının imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "28.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer özel amaçlı makinelerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.01",
        "tanim": "Kamyonet, kamyon, yarı römorklar için çekiciler, tankerler, vb. karayolu taşıtlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.02",
        "tanim": "Otomobil ve benzeri araçların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.03",
        "tanim": "Motorlu kara taşıtlarının motorlarının imalatı (elektrikli motor ve motorların fabrikada yeniden yapımı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.04",
        "tanim": "Minibüs, midibüs, otobüs, troleybüs, metrobüs, vb. yolcu nakil araçlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.05",
        "tanim": "Kar motosikleti, golf arabası, ATV motosikletler, go-kart arabaları vb. taşıtların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.07",
        "tanim": "Özel amaçlı motorlu kara taşıtlarının imalatı (amfibi araçlar, çöp kamyonu, yol temizleme araçları, zırhlı nakil araçları, mikserli kamyon, vinçli kamyon, itfaiye aracı, ambulans, motorlu karavan vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.10.08",
        "tanim": "Motorlu kara taşıtları için şasi imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.01",
        "tanim": "Treyler (römork), yarı treyler (yarı römork) ve mekanik hareket ettirici tertibatı bulunmayan diğer araçların parçalarının imalatı (bu araçların karoserleri, kasaları, aksları ve diğer parçaları)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.02",
        "tanim": "Motorlu kara taşıtları için karoser, kabin, kupa, dorse ve damper imalatı (otomobil, kamyon, kamyonet, otobüs, minibüs, traktör, damperli kamyon ve özel amaçlı motorlu kara taşıtlarının karoserleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.03",
        "tanim": "Konteyner imalatı (bir veya daha fazla taşıma şekline göre özel olarak tasarlanmış olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.04",
        "tanim": "Treyler (römork) ve yarı treyler (yarı römork) imalatı, römorklar için şasi imalatı (karavan tipinde olanlar ve tarımsal amaçlı olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.05",
        "tanim": "Karavan tipinde treyler (römork) ve yarı treyler (yarı römork) imalatı - ev olarak veya kamp için kullanılanlar",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.20.06",
        "tanim": "Motorlu kara taşıtlarının modifiye edilmesi ve karoser hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.31.04",
        "tanim": "Motorlu taşıtlar için ateşleme kablo takımları ve diğer kablo setleri ile ateşleme bujisi ve manyetosu, dinamo, manyetik volan, distribütör, ateşleme bobini, marş motoru, alternatör vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.31.05",
        "tanim": "Motorlu kara taşıtları ve motosikletler için elektrikli sinyalizasyon donanımları, kornalar, sirenler, cam silecekleri, buğu önleyiciler, elektrikli cam/kapı sistemleri, voltaj regülatörleri vb. elektrikli ekipmanların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.31.90",
        "tanim": "Motorlu kara taşıtları için diğer elektrik ve elektronik donanımların imalatı (oto alarm sistemlerinin imalatı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.32.20",
        "tanim": "Motorlu kara taşıtları için vites kutusu, debriyaj, fren, aks, amortisör gibi çeşitli parça ve aksesuarların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.32.21",
        "tanim": "Motorlu kara taşıtları için karoser, kabin ve kupalara ait parça ve aksesuarların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.32.22",
        "tanim": "Motorlu kara taşıtları için koltuk imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.32.23",
        "tanim": "Motorlu kara taşıtlarında kullanılan motorlar için piston, segman ve diğer motor parçaları ile karbüratörlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "29.32.24",
        "tanim": "Motorlu kara taşıtları için iklimlendirme cihazlarının (klimalar) imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.11.01",
        "tanim": "Yüzen ve su altında kalabilen sondaj platformlarının inşası faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.02",
        "tanim": "Yolcu gemi ve tekneleri, feribotlar, tankerler, frigorifik gemiler, kuru yük gemileri, çekici ve itici römorkörler, tarak gemileri, açık deniz gemileri, hover kraftların ve diğer gemilerin inşası (spor ve eğlence amaçlı olanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.04",
        "tanim": "Balıkçı gemi ve tekneleri ile deniz ürünlerinin işlenmesine ve saklanmasına yönelik fabrika gemilerinin yapımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.05",
        "tanim": "Yüzen rıhtımlar, dubalar, batardolar, koferdamlar, yüzen iskeleler, şamandıralar, yüzen tanklar, mavnalar, salapuryalar, yüzen vinçler, eğlence amaçlı olmayan şişme botlar vb. imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.06",
        "tanim": "Gemiler ve yüzer yapılar için oturulacak yerlerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.07",
        "tanim": "Gemiler ve yüzer yapılar için iç bölmelerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.11.08",
        "tanim": "Gemilerin, yüzer platformların ve yüzer yapıların büyük çapta değiştirilmesi ve yeniden inşası",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.12.01",
        "tanim": "Jet ski vb. kişisel su araçlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.12.03",
        "tanim": "Şişirilebilir motorlu/motorsuz botların imalatı (eğlence ve spor amaçlı olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.12.04",
        "tanim": "Eğlence ve sportif amaçlı motorlu/motorsuz yelkenlilerin, motorlu tekne ve yatların, sandalların, kayıkların, kanoların, eğlence amaçlı hover kraftların ve benzer araçların imalatı (polyester tekneler dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.13.00",
        "tanim": "Askeri gemilerin ve teknelerin inşası",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.20.01",
        "tanim": "Demir yolu ve tramvay lokomotifleri, vagonları, bagaj vagonları, lokomotif tenderleri, demir yolu veya tramvay bakım veya servis araçları imalatı (lokomotiflere ve vagonlara ait parçalar ile koltuklarının imalatı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.20.02",
        "tanim": "Demir yolu ve tramvay lokomotif veya vagonlarının parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.20.03",
        "tanim": "Raylı sistem taşıtları için koltuk imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.20.04",
        "tanim": "Mekanik veya elektromekanik sinyalizasyon, emniyet veya trafik kontrol cihazları ve bunların parçalarının imalatı (demir yolu, tramvay hatları, kara yolları, dahili su yolları, park yerleri, liman tesisleri veya hava alanları için olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.20.05",
        "tanim": "Demir yolu veya tramvay lokomotiflerinin ve vagonlarının büyük çapta yenilenmesi ve donanım hizmetleri (tamamlama)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.01",
        "tanim": "Sivil helikopter imalatı (helikopter veya helikopter motorlarının fabrikalarda büyük çaplı revizyonu ve değiştirilmesi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.02",
        "tanim": "Sivil hava taşıtı parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.03",
        "tanim": "Sivil sıcak hava balonu, zeplin, planör, delta kanatlı planör ve diğer motorsuz hava araçlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.04",
        "tanim": "Sivil uçak ve benzer hava taşıtlarının imalatı (uçak veya uçak motorlarının fabrikalarda büyük çaplı revizyonu ve değiştirilmesi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.05",
        "tanim": "Sivil yer uçuş eğitim cihazları ve bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.31.06",
        "tanim": "Sivil uzay aracı, uzay aracı fırlatma araçları ve mekanizmaları ile uydular, uzay roketleri, yörünge istasyonları ve uzay mekiklerinin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.31.07",
        "tanim": "Sivil hava taşıtları ve uzay araçlarında kullanılan koltukların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.32.00",
        "tanim": "Askeri hava ve uzay araçları ve ilgili makinelerin imalatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.40.01",
        "tanim": "Askeri kara savaş araçlarının imalatı (tank, zırhlı savaş araçları ve bunların parçaları)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "30.91.01",
        "tanim": "Motosiklet ve moped imalatı (yardımcı elektrikli motoru bulunan bisiklet hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.91.02",
        "tanim": "Motosiklet parça ve aksesuarları imalatı (motosikletler için pistonlar, piston segmanları, karbüratörler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.91.03",
        "tanim": "Motosiklet motorları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.92.01",
        "tanim": "Bisiklet imalatı (yardımcı elektrikli motoru bulunan bisiklet dahil) (çocuklar için plastik bisikletler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.92.02",
        "tanim": "Bisiklet parça ve aksesuarlarının imalatı (jantlar, gidonlar, iskelet, çatallar, pedal fren göbekleri/poyraları, göbek/poyra frenleri, krank dişlileri, pedallar ve serbest dişlilerin parçaları, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.92.03",
        "tanim": "Engelli araçlarının imalatı (motorlu, motorsuz, akülü, şarjlı, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.92.04",
        "tanim": "Engelli araçlarının parça ve aksesuarlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.92.05",
        "tanim": "Bebek arabaları, pusetler ve bunların parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.99.01",
        "tanim": "Mekanik hareket ettirici tertibatı bulunmayan araçların imalatı (alışveriş arabaları, sanayi el arabaları, işportacı arabaları, bagaj arabaları, elle çekilen golf arabaları, hasta nakli için arabalar, kızaklar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "30.99.02",
        "tanim": "Hayvanlar tarafından çekilen araçların imalatı (at, eşek arabası, fayton, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "30.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ulaşım ekipmanlarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.01",
        "tanim": "Yatak odası, yemek odası, mutfak mobilyası, banyo dolabı, genç ve çocuk odası takımı, gardırop, vestiyer, vb. imalatı (gömme dolap, masa, zigon, vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.02",
        "tanim": "Büro, okul, ibadethane, otel, lokanta, sinema, tiyatro vb. kapalı alanlar için mobilya imalatı (iskelet imalatı dahil; taş, beton, seramikten olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.03",
        "tanim": "Sandalye, koltuk, kanepe, oturma takımı, çekyat, divan, markiz, vb. imalatı (iskelet imalatı dahil; plastik olanlar ile bürolarda ve park ve bahçelerde kullanılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.04",
        "tanim": "Mağazalar için tezgah, banko, vitrin, raf, çekmeceli dolap vb. özel mobilya imalatı (laboratuvarlar ve teknik bürolar için olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.05",
        "tanim": "Yatak ve yatak desteklerinin imalatı (kauçuk şişme yatak ve su yatağı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.06",
        "tanim": "Mobilyaların boyanması, verniklenmesi, cilalanması vb. tamamlayıcı işlerin yapılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "31.00.07",
        "tanim": "Park ve bahçelerde kullanılan bank, masa, tabure, sandalye, koltuk, vb. mobilyaların imalatı (plastik olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.08",
        "tanim": "Sandalyelerin, koltukların vb. döşenmesi gibi tamamlayıcı işlerin yapılması (büro ve ev mobilyalarının yeniden kaplanması hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.09",
        "tanim": "Plastikten bank, masa, tabure, sandalye vb. mobilyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "31.00.90",
        "tanim": "Diğer mobilyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.11.01",
        "tanim": "Madeni para basımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.12.01",
        "tanim": "Değerli metallerden takı ve mücevherlerin imalatı (değerli metallerle baskı, yapıştırma vb. yöntemlerle giydirilmiş adi metallerden olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.12.04",
        "tanim": "İnci ve değerli doğal taşların işlenmesi ve değerli taşlardan takı ve mücevher ile bunların parçalarının imalatı (sentetik veya yeniden oluşturulmuş olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.12.90",
        "tanim": "Mücevher ve benzeri diğer eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.13.01",
        "tanim": "İmitasyon (taklit) takılar ve ilgili eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.20.21",
        "tanim": "Elektronik müzik aletleri veya klavyeli çalgıların imalatı (elektrik gücüyle ses üreten veya sesi güçlendirilen enstrümanlar) (dijital piyano, sintizayzır, elektrogitar, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.20.23",
        "tanim": "Ağızları huni gibi genişleyen neviden olan boru esaslı müzik aletleri ile diğer üflemeli müzik aletlerinin imalatı (saksafon, flüt, trombon, borazan, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.20.24",
        "tanim": "Vurmalı çalgıların imalatı (trampet, davul, ksilofon, zil, kas vs.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.20.25",
        "tanim": "Piyanolar ve diğer klavyeli yaylı/telli çalgıların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.20.26",
        "tanim": "Borulu ve klavyeli orglar, armonyumlar, akordiyonlar, ağız mızıkaları (armonikalar), tulum vb. çalgıların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.20.27",
        "tanim": "Müzik kutuları, orkestriyonlar, laternalar, çıngıraklar vb. imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.20.28",
        "tanim": "Metronomlar, akort çatalları (diyapazonlar) ve akort düdükleri, müzik kutuları için mekanizmalar, müzik aleti telleri ile müzik aletlerinin parça ve aksesuarlarının imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.20.90",
        "tanim": "Diğer yaylı/telli müzik aletlerinin imalatı (saz, gitar, keman, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.20.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer müzik aletlerinin imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.30.17",
        "tanim": "Kar kayakları, kayak ayakkabıları, kayak botları, kayak batonları, buz patenleri ve tekerlekli patenler ile su kayağı araçları, sörf tahtaları, rüzgar sörfleri vb. ekipmanlar ile bunların parçalarının imalatı (kaykaylar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.30.18",
        "tanim": "Jimnastik ve atletizm eşyaları ile form tutma salonlarına ait eşya ve ekipmanların imalatı (atlama beygiri, dambıl ve halterler, kürek çekme ve bisiklete binme aletleri, ciritler, çekiçler; boks çalışma topları, boks veya güreş için ringler vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.30.19",
        "tanim": "Spor amaçlı dağcılık, avcılık veya balıkçılık eşyalarının imalatı (kasklar, olta kamışları, olta iğneleri ve kancaları, otomatik olta makaraları, el kepçeleri, kelebek ağları, yapma balıklar, sinekler gibi suni yemler, kurşunlar, yapma kuşlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.30.20",
        "tanim": "Spor veya açık hava oyunları için diğer eşyaların imalatı (boks eldiveni, spor eldiveni, yaylar, beyzbol ve golf sopaları ile top ve diğer eşyaları, tenis masası, raket, ağ ve topları, tozluklar, bacak koruyucular, şişme ve diğer havuzlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.30.21",
        "tanim": "Top imalatı (beyzbol, futbol, basketbol ve voleybol için)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.02",
        "tanim": "Bozuk para veya jetonla çalışan oyun makineleri ile bilardo için kullanılan eşya ve aksesuarların imalatı (rulet vb. oyun makineleri ile bilardo masa ve istekaları, isteka dayanakları, bilardo topları, tebeşirleri, toplu veya sürgülü puan sayaçları vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.03",
        "tanim": "Yap boz, puzzle ve benzeri ürünlerin imalatı (lego vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.04",
        "tanim": "İçi doldurulmuş oyuncak bebeklerin ve oyuncak hayvanların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.40.05",
        "tanim": "Oyuncak bebek, kukla ve hayvanlar ile bunların giysi, parça ve aksesuarlarının imalatı (içi doldurulmuş olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.06",
        "tanim": "Lunapark, masa ve salon oyunları için gereçlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.09",
        "tanim": "Oyun tahtaları (satranç, dama, dart, tavla tahtaları, okey istekası, go vb.) ve tabu, monopol vb. oyunların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.10",
        "tanim": "Tekerlekli oyuncaklar, oyuncak bebek arabaları, oyuncak trenler ve diğer küçültülmüş boyutlu modeller/maketler veya inşaat oyun takımları, yarış setleri imalatı (motorlu olanlar, pres döküm oyuncaklar ve plastik diğer oyuncaklar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.40.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer oyun ve oyuncakların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.02",
        "tanim": "Tıpta, cerrahide ve dişçilikte kullanılan protezler, ortopedik cihazlar ve aksesuarların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.03",
        "tanim": "Diş laboratuvarlarının faaliyetleri (protez diş, metal kuron, vb. imalatı)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "32.50.04",
        "tanim": "Gözlükler ve lensler ile parçalarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.05",
        "tanim": "Tıbbi, cerrahi, dişçilik veya veterinerlikle ilgili mobilyaların, berber koltukları ve benzeri sandalyeler ile bunların parçalarının imalatı (X ışını masa ve koltukları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.06",
        "tanim": "Dişçi çimentosu, dişçilik mumları, dolgu maddesi, kemik tedavisinde kullanılan çimento, jel preparat, steril adhezyon bariyeri, dikiş malzemesi (katgüt hariç), doku yapıştırıcısı, laminarya, emilebilir hemostatik, vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.07",
        "tanim": "Tıpta, cerrahide, dişçilikte veya veterinerlikte kullanılan şırınga, iğne, katater, kanül ve benzerlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.14",
        "tanim": "Tıpta, cerrahide ve dişçilikte kullanılan araç-gereç ve cihazların imalatı (ortopedik cihazlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.15",
        "tanim": "Terapatik alet ve cihazların imalatı (suni solunum veya terapatik solunum cihazları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.50.90",
        "tanim": "Tıbbi ve dişçilik ile ilgili diğer araç ve gereçlerin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.91.01",
        "tanim": "Ev veya büro temizliği için olan süpürge ve fırçaların imalatı (elektrikli olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.91.02",
        "tanim": "Boyama, badana, duvar kağıdı ve vernik fırçaları ile rulolarının imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.91.03",
        "tanim": "Diş fırçaları, saç fırçaları, tıraş fırçaları ve kişisel bakım için kullanılan diğer fırçalar ile resim fırçaları, yazı fırçaları ve kozmetik fırçaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.91.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer süpürge ve fırçaların imalatı (elektrikli olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.01",
        "tanim": "Terzi mankeni, el kalbur ve eleği, yapma çiçek, meyve ve bitkiler, şaka ve sihirbazlık benzeri eşya, koku püskürtücüleri ve mekanizmaları, tabut vb. eşyaların imalatı (gelin çiçeği dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.02",
        "tanim": "Kot vb. baskı düğmeleri, çıtçıtlar, düğmeler, fermuarlar vb. imalatı (düğme formları ve fermuar parçaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.03",
        "tanim": "Pipo, sigara ağızlıkları, Oltu veya lüle taşından tespih vb. imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.04",
        "tanim": "Mekanik olsun veya olmasın her çeşit dolma kalem, tükenmez ve kurşun kalem ile boya kalemi, pastel boya imalatı (kalem ucu ve kurşun kalem içleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.05",
        "tanim": "Koruyucu güvenlik başlıkları ve diğer güvenlik malzemeleri imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.06",
        "tanim": "Peruk, takma saç, takma sakal, takma kaş vb. imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.99.07",
        "tanim": "Şemsiyeler, güneş şemsiyeleri, baston ve koltuklu baston, koltuk değneği vb. imalatı (parçaları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.08",
        "tanim": "Tarih verme, damga, mühür veya numara verme kaşeleri, numaratör, elle çalışan basım aletleri, kabartma etiketleri, el baskı setleri, hazır daktilo şeritleri ve ıstampaların imalatı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "32.99.09",
        "tanim": "Koruyucu amaçlı solunum ekipmanları ve gaz maskelerinin imalatı (tedavi edici olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.10",
        "tanim": "Ateşe dayanıklı ve koruyucu güvenlik kıyafetleri ve başlıkları ile diğer güvenlik ürünlerinin imalatı (solunum ekipmanları ve gaz maskeleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.11",
        "tanim": "Mantar can simitlerinin imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.13",
        "tanim": "Termos ve vakumlu kapların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.15",
        "tanim": "Suni balmumu ile suni mumların ve müstahzar mumların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.16",
        "tanim": "Yazı veya çizim tahtaları imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.17",
        "tanim": "Sigara çakmakları ve diğer çakmaklar ile çabuk tutuşan (piroforik) alaşımların imalatı (çakmaklar için kap hacmi ≤ 300cm3 sıvı veya sıvılaştırılmış gaz yakıtları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.18",
        "tanim": "Fildişi, kemik, boynuz, sedef gibi hayvansal malzemelerden oyma eşyaların imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.19",
        "tanim": "Elektronik sigara imalatı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "32.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer imalatlar (bağırsak (ipek böceği guddesi hariç), kursak ve mesaneden mamul eşyalar dahil, tıbbi amaçlı steril olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.01",
        "tanim": "Metal boru ve boru hatları ile pompa istasyonlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.02",
        "tanim": "Ateşli silahların ve savaş gereçlerinin onarım ve bakımı (spor ve eğlence amaçlı silahların onarımı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.03",
        "tanim": "Buhar kazanları veya buhar jeneratörlerinin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.04",
        "tanim": "Merkezi ısıtma sıcak su kazanları (boyler) ve radyatörlerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.10",
        "tanim": "Metal tankların, rezervuarların ve muhafaza kaplarının (konteynerler dahil) onarımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.11.11",
        "tanim": "Nükleer reaktörlerin onarım ve bakımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "33.11.99",
        "tanim": "Başka yerde sınıflandırılmamış metal ürünlerin onarım ve bakımı (balık kafesleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.02",
        "tanim": "Tarım ve ormancılık makinelerinin onarım ve bakımı (traktörlerin bakım ve onarımı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.03",
        "tanim": "Motor ve türbinlerin onarım ve bakımı (hidrolik, rüzgar, gaz, su, buhar türbinleri) (gemi ve tekne motorları, motorlu kara taşıtı ve motosiklet motorları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.04",
        "tanim": "Sanayi fırınlarının, ocaklarının ve ocak brülörlerinin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.05",
        "tanim": "Kaldırma ve taşıma ekipmanlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.06",
        "tanim": "Sanayi tipi soğutma ve havalandırma ekipmanlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.07",
        "tanim": "Tartı aletlerinin onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.12.08",
        "tanim": "Madencilik, inşaat, petrol ve gaz sahalarında kullanılan makinelerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.09",
        "tanim": "Tarım ve ormancılıkta kullanılan motokültörler ve traktörlerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.10",
        "tanim": "Akışkan gücü ile çalışan ekipmanlar, pompalar, kompresörler ile valflerin ve vanaların onarım ve bakımı (akaryakıt pompalarının tamiri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.11",
        "tanim": "Metal işleme makinelerinin ve takım tezgahlarının onarım ve bakımı (CNC olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.12",
        "tanim": "Motorlu veya pnömatik (hava basınçlı) el aletlerinin onarımı (yuvarlak/vargel/zincir testere, matkap, pnömatik veya motorlu metal kesme makası, darbeli cıvata anahtarı vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.13",
        "tanim": "Elektrikli kaynak ve lehim aletlerinin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.14",
        "tanim": "Metalürji makinelerinin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.15",
        "tanim": "Gıda, içecek ve tütün işleme makinelerinin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.16",
        "tanim": "Tekstil, giyim eşyası ve deri üretim makinelerinin onarım ve bakımı (triko makinelerinin onarımı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.17",
        "tanim": "Kağıt, karton ve mukavva üretiminde kullanılan makinelerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.18",
        "tanim": "Büro ve muhasebe makinelerinin onarım ve bakımı (daktilo, yazar kasa, fotokopi makineleri, hesap makineleri, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.12.19",
        "tanim": "Ağaç, mantar, taş, sert kauçuk veya benzeri sert malzemeleri işlemede kullanılan takım tezgahlarının onarım ve bakımı (CNC olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.21",
        "tanim": "Sıvılar için filtreleme ya da temizleme makineleri ve aparatlarının onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.12.27",
        "tanim": "Kesici aletler ile el aletlerinin onarım ve bakımı (matbaa giyotini, şerit testere, el testeresi, çapa, orak vb. bileyleme ve çarkçılık dahil) (motorlu ve pnömatik olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.28",
        "tanim": "Plastik ve kauçuk imalatında ve işlenmesinde kullanılan makinelerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.29",
        "tanim": "Endüstriyel rulmanların, dişlilerin, dişli takımlarının ve tahrik tertibatı elemanlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.30",
        "tanim": "Tarımsal amaçlı kullanılan römorkların onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.12.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer makinelerin onarım ve bakımı (motorlu kara taşıtları, gemiler, tekneler ve uçaklar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.13.01",
        "tanim": "Ölçme, test ve seyrüsefer alet ve cihazlarının onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.13.02",
        "tanim": "Işınlama, elektromedikal ve elektroterapi ekipmanlarının onarım ve bakımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "33.13.03",
        "tanim": "Profesyonel optik aletlerin ve fotoğrafçılık ekipmanlarının onarım ve bakımı (tüketici elektronik ürünlerinin onarımı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.13.05",
        "tanim": "Yüklü elektronik devrelerin/kartların bakımı ve onarımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.13.90",
        "tanim": "Diğer profesyonel elektronik ekipmanların onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.14.01",
        "tanim": "Güç transformatörleri, dağıtım transformatörleri ve özel transformatörlerin onarım ve bakımı (elektrik dağıtım ve kontrol cihazları dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.14.02",
        "tanim": "Elektrik motorları, jeneratörler ve motor jeneratör setlerinin onarım ve bakımı (bobinlerin tekrar sarımı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.14.90",
        "tanim": "Diğer profesyonel elektrikli ekipmanların onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.15.00",
        "tanim": "Sivil gemilerin ve teknelerin onarım ve bakımı (yüzen yapılar, sandal, kayık, vb. bakım ve onarımı ile bunların kalafatlanması dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "33.16.01",
        "tanim": "Sivil hava taşıtları ve uzay araçlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.17.01",
        "tanim": "Demir yolu lokomotiflerinin ve vagonlarının onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.17.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ulaşım ekipmanlarının onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.18.01",
        "tanim": "Askeri kara savaş araçlarının onarım ve bakımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "33.18.03",
        "tanim": "Askeri savaş gemilerinin ve teknelerin onarım ve bakımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "33.19.01",
        "tanim": "Tentelerin, kamp ekipmanlarının, çuvalların ve balıkçılık ağları gibi diğer hazır tekstil malzemelerinin onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.19.02",
        "tanim": "Halatlar, gemi çarmık ve halatları ile yelken bezleri ve bez astarlı muşambaların onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.19.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ekipmanların onarımı (ahşap konteyner, gemi fıçı ve varilleri, madeni para ile çalışan oyun makineleri, değirmentaşı, bileme taşı vs.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "33.20.36",
        "tanim": "Metallerin işlenmesinde, kesilmesinde ve şekillendirilmesinde kullanılan makinelerin kurulum hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.45",
        "tanim": "Sanayi tipi ısıtma, iklimlendirme ve soğutma cihaz ve ekipmanlarının kurulumu",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.46",
        "tanim": "Genel amaçlı makinelerin kurulum hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.51",
        "tanim": "Elektrikli ekipmanların kurulum hizmetleri (yollar, vb. için elektrikli sinyalizasyon ekipmanları hariç))",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.52",
        "tanim": "Fabrikasyon metal ürünlerin kurulum hizmetleri (buhar jeneratörlerinin kurulum hizmetleri ve sanayi tesislerindeki metal boru sistemlerinin kurulumu dahil, merkezi ısıtma sıcak su kazanları (boylerleri) ile makine ve ekipmanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.53",
        "tanim": "Endüstriyel işlem kontrol ekipmanlarının kurulum hizmetleri (otomasyon destekliler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "33.20.90",
        "tanim": "Diğer sanayi makine ve ekipmanlarının kurulumu",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "35.11.00",
        "tanim": "Yenilenemeyen kaynaklardan elektrik üretimi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.12.00",
        "tanim": "Yenilenebilir kaynaklardan elektrik üretimi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.13.00",
        "tanim": "Elektrik enerjisinin iletimi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.14.02",
        "tanim": "Elektrik sayaçlarının bakım ve onarımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "35.14.06",
        "tanim": "Elektrik enerjisinin dağıtımı (üretim kaynağından veya iletim sisteminden son kullanıcıya iletim sistemiyle taşınan elektrik enerjisi dağıtım sisteminin işletilmesi)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.15.01",
        "tanim": "Elektrikli araçlar ve elektronik cihazlar için şarj istasyonlarının işletilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "35.15.02",
        "tanim": "Elektrik ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "35.16.00",
        "tanim": "Elektriğin depolanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.21.01",
        "tanim": "Doğalgaz dahil, çeşitli türdeki gazlardan arındırma, karıştırma, vb. işlemlerle kalorifik değerde gazlı yakıtların üretimi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.21.02",
        "tanim": "Kömürün karbonlaştırılması, tarımsal yan ürün veya atıklarından gaz üretimi",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.22.01",
        "tanim": "Ana şebeke üzerinden gaz yakıtların dağıtımı (her çeşit gazlı yakıtın, ana boru sistemiyle dağıtımı ve tedariki)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.22.02",
        "tanim": "Gaz sayaçlarının bakım ve onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "35.23.01",
        "tanim": "Ana şebeke üzerinden gaz ticareti (komisyoncular ve acentelerin faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "35.24.00",
        "tanim": "Gazın depolanması (şebeke tedarik hizmetlerinin bir parçası olarak)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.30.21",
        "tanim": "Buhar ve sıcak su üretimi, toplanması ve dağıtımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "35.30.22",
        "tanim": "Soğutulmuş hava ve soğutulmuş su üretim ve dağıtımı (buz üretimi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "35.40.00",
        "tanim": "Elektrik enerjisi ve doğal gaz aracılarının ve komisyoncularının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "36.00.02",
        "tanim": "Suyun toplanması, arıtılması ve dağıtılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "36.00.03",
        "tanim": "Su sayaçlarının bakım ve onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "37.00.01",
        "tanim": "Kanalizasyon (kanalizasyon atıklarının uzaklaştırılması ve arıtılması, kanalizasyon sistemlerinin ve atık su arıtma tesislerinin işletimi, foseptik çukurların ve havuzların boşaltılması ve temizlenmesi, seyyar tuvalet faaliyetleri vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.11.01",
        "tanim": "Tehlikesiz atıkların toplanması (çöpler, geri dönüştürülebilir maddeler, tekstil atıkları, vb.) (inşaat ve yıkım atıkları, çalı, çırpı, moloz gibi enkazlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "38.11.02",
        "tanim": "İnşaat ve yıkım atıklarının, çalı, çırpı, moloz gibi enkazların toplanması ve kaldırılması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "38.11.03",
        "tanim": "Tehlikesiz atık transfer istasyonlarının işletilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "38.12.01",
        "tanim": "Tehlikeli atıkların toplanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.21.02",
        "tanim": "Gemi ve yüzer yapıların hurdalarının materyallerinin geri kazanımı amacıyla parçalara ayrılması (sökülmesi)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.21.03",
        "tanim": "Hurdaların geri kazanım amacıyla parçalara ayrılması (otomobil, bilgisayar, televizyon vb. donanımlar) (gemiler ve yüzer yapılar ile satmak için kullanılabilir parçalar oluşturmak amacıyla sökme hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.21.04",
        "tanim": "Tasnif edilmiş metal atıklar, hurdalar ve diğer parçaların genellikle mekanik veya kimyasal değişim işlemleri ile geri kazanılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.21.05",
        "tanim": "Tasnif edilmiş metal dışı atıklar, hurdalar ve diğer parçaların genellikle mekanik veya kimyasal değişim işlemleri ile geri kazanılması (plastik atıkların kimyasal işlemlerle geri kazanılması hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.22.00",
        "tanim": "Enerji geri kazanımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.23.00",
        "tanim": "Diğer atık geri kazanımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.31.00",
        "tanim": "Enerji geri kazanımı olmaksızın atıkların yakılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.32.03",
        "tanim": "Tehlikesiz atıkların düzenli veya kalıcı olarak depolanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "38.32.04",
        "tanim": "Tehlikeli atıkların düzenli veya kalıcı olarak depolanması (radyoaktif atıklar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.32.05",
        "tanim": "Radyoaktif atıkların düzenli veya kalıcı olarak depolanması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "38.33.00",
        "tanim": "Diğer atıkların bertarafı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "39.00.01",
        "tanim": "İyileştirme faaliyetleri ve diğer atık yönetimi hizmetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "41.00.01",
        "tanim": "İkamet amaçlı binaların inşaatı (ahşap binaların inşaatı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "41.00.02",
        "tanim": "İkamet amaçlı olmayan binaların inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "41.00.03",
        "tanim": "Mevcut ikamet amaçlı olan veya ikamet amaçlı olmayan binaların yeniden düzenlenmesi veya yenilenmesi (büyük çaplı revizyon) (tarihi yapıların restorasyonu hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "41.00.04",
        "tanim": "İkamet amaçlı ahşap binaların inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "41.00.05",
        "tanim": "Prefabrik binalar için bileşenlerin alanda birleştirilmesi ve kurulması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.11.01",
        "tanim": "Otoyollar, kara yolları, şehir içi yollar ve diğer araç veya yaya yollarının inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.11.02",
        "tanim": "Yol yüzeylerinin asfaltlanması ve onarımı, kaldırım, kasis, bisiklet yolu vb.lerin inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.11.03",
        "tanim": "Havaalanı pisti inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.12.01",
        "tanim": "Demir yolları ve metroların inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.13.01",
        "tanim": "Köprülerin inşaatı (yükseltilmiş kara yolları-viyadükler dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.13.02",
        "tanim": "Tünel inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.21.01",
        "tanim": "Akışkanlar için uzun mesafe boru hatlarının inşaatı (petrol ürünleri ve gaz taşımacılığı ile su ve diğer ürünlerin taşımacılığına yönelik karada ve deniz altında uzun mesafe boru hattı)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.21.02",
        "tanim": "Su kuyusu açma ve septik sistem kurulum faaliyetleri (kuyu, artezyen vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.21.03",
        "tanim": "Ana su şebekeleri ve su hatları ile su arıtma tesisleri, kanalizasyon bertaraf tesisleri ve pompa istasyonları inşaatı (sulama sistemleri (kanallar) dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.21.05",
        "tanim": "Akışkanlar için kısa mesafe (yerel) boru hatlarının inşaatı (petrol ürünleri ve gaz taşımacılığı ile su, kanalizasyon, sıcak su, buhar ve diğer ürünlerin taşımacılığına yönelik kısa mesafe boru hattı)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.01",
        "tanim": "Uzun mesafe elektrik hatlarının inşaatı (uzun mesafe yüksek gerilim elektrik iletim hatları ile uzun mesafe yer üstü/altı veya deniz altı iletim hatları)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.02",
        "tanim": "Enerji santralleri inşaatı (hidroelektrik santrali, termik santral, güneş ve rüzgar santrali, nükleer enerji üretim santralleri vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.04",
        "tanim": "Kentsel (kısa mesafe) elektrik hatlarının inşaatı (trafo istasyonları ve yerel sınırlar içerisindeki dağıtım alt istasyonları vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.05",
        "tanim": "Telekomünikasyon şebeke ve ağlarının bakım ve onarımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.06",
        "tanim": "Uzun mesafe telekomünikasyon (iletişim) hatlarının inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.22.07",
        "tanim": "Kentsel (kısa mesafe) telekomünikasyon (iletişim) hatlarının inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.91.01",
        "tanim": "Kıyı ve liman inşaatları ve ilgili hidromekanik yapıların inşaatı (su yolları, kanal vb. dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.91.02",
        "tanim": "Su ve su zemininin taranması ve temizlenmesi (deniz, nehir, göl vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.91.03",
        "tanim": "Tersane, dok ve kanal havuzu inşaatı (gemi inşaatı ve tamiri için)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.91.04",
        "tanim": "Baraj ve bentlerin inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.99.01",
        "tanim": "Açık havada yapılan sporlara uygun tesislerin ve eğlence alanları yapılarının inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.99.02",
        "tanim": "Madencilik ve imalat sanayisi yapılarının inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.99.04",
        "tanim": "Doğalgaz işleme tesisleri inşaatı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "42.99.05",
        "tanim": "Yüzme havuzlarının inşaatı (prefabrik olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "42.99.99",
        "tanim": "Başka yerde sınıflandırılmamış bina dışı diğer yapıların inşaatı (arazi iyileştirilmesi ile birlikte arazinin parsellemesi dahil, iyileştirme yapılmaksızın parselleme hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.11.01",
        "tanim": "Yıkım işleri (binaların ve diğer yapıların yıkılması ve sökülmesi)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.12.01",
        "tanim": "Zemin ve arazi hazırlama, alanın temizlenmesi ile kazı ve hafriyat işleri (madencilik için yapılanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.12.02",
        "tanim": "Maden sahalarının hazırlanması (tünel açma dahil, petrol ve gaz sahaları için olanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.13.01",
        "tanim": "Test sondajı ve delme (madencilikle bağlantılı olarak gerçekleştirilen test sondajı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.21.01",
        "tanim": "Bina ve bina dışı yapıların (ulaşım için aydınlatma ve sinyalizasyon sistemleri hariç) elektrik tesisatı, kablolu televizyon ve bilgisayar ağı tesisatı ile konut tipi antenler (uydu antenleri dahil), elektrikli güneş enerjisi kollektörleri, elektrik sayaçları, elektrikli araçlar için elektrikli şarj cihazları tesisatının kurulumu, duvar dibi ısıtma sistemleri, yangın ve hırsızlık alarm sistemleri vb. kurulumu",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.21.03",
        "tanim": "Kara yolları, demir yolları ve diğer raylı yolların, liman ve havaalanlarının aydınlatma ve sinyalizasyon sistemlerinin tesisatı (havaalanı pisti aydınlatmasının tesisatı dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.22.03",
        "tanim": "Bina ve diğer inşaat projelerinde su ve kanalizasyon tesisatı ve onarımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.22.05",
        "tanim": "Gaz tesisatı faaliyetleri (hastanelerdeki oksijen gazı temini için kurulum işleri dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.22.06",
        "tanim": "Bina veya diğer inşaat projelerinde ısıtma, havalandırma, soğutma ve iklimlendirme sistemlerinin onarım ve bakımı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.22.07",
        "tanim": "Bina veya diğer inşaat projelerinde ısıtma, havalandırma, soğutma ve iklimlendirme sistemlerinin kurulumu",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.23.01",
        "tanim": "Yalıtım tesisatı (su yalıtımı ile çatıların dış yalıtımı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.23.02",
        "tanim": "Su yalıtımı (çatıların su yalıtımı hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.24.01",
        "tanim": "Asansörlerin, yürüyen merdivenlerin, yürüyen yolların, otomatik ve döner kapıların onarım ve bakımı dahil kurulum işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.24.02",
        "tanim": "Isı, ses veya titreşim yalıtımı ile diğer inşaat tesisatı işleri (mantolama ve vakumlu temizleme sistemlerinin kurulumu dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.24.03",
        "tanim": "Parmaklık ve korkuluk tesisatı işleri (metal yangın merdivenlerinin kurulumu dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.24.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer tesisat işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.31.01",
        "tanim": "Sıva işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.32.01",
        "tanim": "Hazır mutfaklar, mutfak tezgahları, gömme dolaplar, iç merdivenler ile ince tahta, lambri ve benzerlerinin montajı işleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.32.02",
        "tanim": "Herhangi bir malzemeden yapılan kapı ve pencere kasaları, kapılar (zırhlı kapılar dahil, otomatik ve döner kapılar hariç), pencereler, kepenkler, panjurlar, garaj kapıları ve benzerlerinin montajı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.32.03",
        "tanim": "Seyyar bölme ve metal yapı üzerine asma tavan montaj işleri ile diğer doğrama tesisatı işleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.33.01",
        "tanim": "Bina ve diğer yapıların içi veya dışında yer ve duvar kaplama faaliyetleri (halı, taban muşambası ve kağıt kaplama hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.33.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer yer döşeme ve kaplama ile duvar kaplama işleri (halı, taban muşambası ve diğer esnek yer kaplamaları ile duvar kaplama işleri)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.34.01",
        "tanim": "Binaların iç ve dış boyama işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.34.02",
        "tanim": "Cam takma işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.34.03",
        "tanim": "Bina dışı yapıların boyama işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.35.00",
        "tanim": "İnşaatlardaki diğer bütünleyici ve tamamlayıcı işler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.41.00",
        "tanim": "Çatı işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.42.01",
        "tanim": "Yapısal çelik bileşenlerin kurulması işleri (bina inşaatları için)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.42.02",
        "tanim": "Bina inşaatı için kazık çakma ve temel inşaatı işleri (forekazık çakma dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.42.03",
        "tanim": "Baca ve sanayi fırınlarının inşaatı ve kurulması (fırınlar için yanma odasına ateş tuğlası döşenmesi işleri dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.42.99",
        "tanim": "Bina inşaatlarında başka yerde sınıflandırılmamış diğer inşaat faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.50.01",
        "tanim": "Yapısal çelik bileşenlerin kurulması işleri (bina dışı inşaatları için)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.50.02",
        "tanim": "Bina dışı yapılar için kazık çakma ve temel inşaatı işleri (forekazık çakma dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.50.03",
        "tanim": "Yer altı çalışmaları (su kuyusu açma hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.50.04",
        "tanim": "Prefabrik yüzme havuzlarının kurulumu",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.50.05",
        "tanim": "Yol yüzeylerin boyayla işaretlenmesi, yol bariyeri, trafik işaret ve levhaları vb.nin kurulumu gibi yol, tünel vb. yerlerdeki yüzey işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.50.06",
        "tanim": "Prefabrik yapıların montajı ve kurulması (prefabrik binalar ve yüzme havuzları hariç her çeşit prefabrik sokak düzeneklerinin (otobüs durağı, telefon kulübesi, bank vb.) kurulumu vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "43.60.00",
        "tanim": "Özel inşaat hizmetleri için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "43.91.00",
        "tanim": "Duvarcılık ve tuğla, briket vb. döşeme faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.99.04",
        "tanim": "Vinç ve benzeri diğer inşaat ekipmanlarının operatörü ile birlikte kiralanması (özel bir inşaat çeşidinde yer almayan)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "43.99.05",
        "tanim": "İnşaatlarda beton işleri (kalıp içerisine beton dökülmesi vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.99.07",
        "tanim": "İnşaat iskelesi ve çalışma platformunu kurma ve sökme işleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.99.13",
        "tanim": "İnşaat demirciliği (inşaat demirinin bükülmesi ve bağlanması)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "43.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer uzmanlaşmış inşaat işleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.11.01",
        "tanim": "Çiçeklerin, bitkilerin, diğer tarımsal hammaddelerin, tekstil hammaddelerinin ve yarı mamul malların bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.11.02",
        "tanim": "Canlı hayvanların bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.11.90",
        "tanim": "Diğer malların toptan satışı ile ilgili aracıların faaliyetleri (kürklü müzayedeleri vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.12.01",
        "tanim": "Katı, sıvı ve gaz haldeki yakıtların ve ilgili ürünlerin toptan satışı ile ilgili aracıların faaliyetleri (motorlu taşıt yakıtları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.12.02",
        "tanim": "Endüstriyel kimyasallar, gübreler ve zirai kimyasal ürünlerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.12.03",
        "tanim": "Birincil formdaki metaller ve metal cevherlerinin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.13.01",
        "tanim": "İnşaat malzemesi toptan satışı ile ilgili aracıların faaliyetleri (inşaat demiri ve kerestesi hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.13.02",
        "tanim": "Kereste ve kereste ürünlerinin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.14.01",
        "tanim": "Bilgisayar, yazılım, elektronik ve telekomünikasyon donanımlarının ve diğer büro ekipmanlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.14.02",
        "tanim": "Tarımsal ekipmalar ile makine ve sanayi ekipmanlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.14.03",
        "tanim": "Gemilerin, hava taşıtlarının ve diğer taşıma ekipmalanlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.15.01",
        "tanim": "Mobilyaların toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.15.02",
        "tanim": "Hırdavatçı (nalburiye) eşyalarının, madeni eşyaların ve el aletlerinin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.15.03",
        "tanim": "Radyo, televizyon ve video cihazlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.15.90",
        "tanim": "Diğer ev eşyalarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.16.01",
        "tanim": "Deri giyim eşyası, kürk ve ayakkabının bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.16.02",
        "tanim": "Deri eşyalar ve seyahat aksesuarlarının bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.16.03",
        "tanim": "Giyim eşyalarının bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar (deri giyim eşyaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.16.04",
        "tanim": "Tekstil ürünlerinin bir ücret veya sözleşmeye dayalı olarak toptan satışını yapan aracılar (iplik, kumaş, ev tekstili, perde vb. ürünler) (giyim eşyaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.17.01",
        "tanim": "Gıda maddelerinin toptan satışı ile ilgili aracıların faaliyetleri (aracı üretici birlikleri dahil, içecekler ile yaş sebze ve meyve hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.17.02",
        "tanim": "Yaş sebze ve meyvelerin toptan satışı ile ilgili aracıların faaliyetleri (kabzımallık ve aracı üretici birlikleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.17.03",
        "tanim": "Tütün ve tütün ürünlerinin toptan satışı ile ilgili aracıların faaliyetleri (aracı üretici birlikleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.17.04",
        "tanim": "İçeceklerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.01",
        "tanim": "Oyun ve oyuncak, spor malzemesi, bisiklet, kitap, gazete, dergi, kırtasiye ürünleri, müzik aleti, saat ve mücevher ile fotoğrafçılıkla ilgili ve optik aletlerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.02",
        "tanim": "Kozmetik, parfüm ve bakım ürünleri ile temizlik malzemesinin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.03",
        "tanim": "Tıbbi ürünlerin, araç ve malzemelerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.04",
        "tanim": "Kağıt ve karton (mukavva) ile ilgili belirli ürünlerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.05",
        "tanim": "Eczacılıkla ilgili ürünlerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.06",
        "tanim": "Otomobillerin ve hafif motorlu kara taşıtlarının toptan satışı ile ilgili aracıların faaliyetleri (elektrikli olanlar ile ambulans ve minibüs benzeri motorlu yolcu taşıtları için olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.07",
        "tanim": "Diğer motorlu kara taşıtlarının toptan satışı ile ilgili aracıların faaliyetleri (kamyonlar, çekiciler, römorklar, yarı römorklar, kamp araçları vb., elektrikli olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.08",
        "tanim": "Motorlu kara taşıtlarının parça ve aksesuarlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.09",
        "tanim": "Motosikletler, motorlu bisikletler ve bunların parça ve aksesuarlarının toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.18.99",
        "tanim": "Başka yerde sınıflandırılmamış belirli diğer ürünlerin toptan satışı ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.19.01",
        "tanim": "Uzmanlaşmamış toptan ticaret ile ilgili aracıların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.01",
        "tanim": "Hayvan yemi toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.02",
        "tanim": "Tahıl toptan ticareti (buğday, arpa, çavdar, yulaf, mısır, çeltik vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.03",
        "tanim": "Yağlı tohum ve yağlı meyvelerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.06",
        "tanim": "Pamuk toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.21.07",
        "tanim": "Yün ve tiftik toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.08",
        "tanim": "Tohum (yağlı tohumlar hariç) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.21.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer tarımsal ham maddelerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.22.01",
        "tanim": "Çiçeklerin ve bitkilerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.23.01",
        "tanim": "Canlı hayvanların toptan ticareti (kümes hayvanları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.23.02",
        "tanim": "Canlı kümes hayvanları toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.24.01",
        "tanim": "Ham deri, post ve kürklü deri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.24.02",
        "tanim": "Tabaklanmış deri, güderi ve kösele toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.01",
        "tanim": "Fındık, antep fıstığı, yer fıstığı ve ceviz toptan ticareti (kavrulmuş olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.02",
        "tanim": "Taze incir ve üzüm toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.03",
        "tanim": "Narenciye toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.04",
        "tanim": "Diğer taze meyve sebze toptan ticareti (patates dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.05",
        "tanim": "Zeytin (işlenmiş) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.06",
        "tanim": "Kültür mantarı toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.08",
        "tanim": "Kuru bakliyat ürünleri toptan ticareti (fasulye, mercimek, nohut, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.09",
        "tanim": "Kavrulmuş veya işlenmiş kuru yemiş toptan ticareti (leblebi, kavrulmuş fındık, fıstık, çekirdek vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.10",
        "tanim": "Kuru üzüm toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.11",
        "tanim": "Kuru incir toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.12",
        "tanim": "Kuru kayısı toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.31.90",
        "tanim": "Diğer işlenmiş veya korunmuş sebze ve meyve toptan ticareti (reçel, pekmez, pestil, salamura veya turşusu yapılmış olanlar dahil) (fındık, incir, üzüm, narenciye, zeytin, kültür mantarı ve kuru yemiş hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.32.01",
        "tanim": "Kümes hayvanları ve av hayvanları etlerinin toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.32.02",
        "tanim": "Et toptan ticareti (av hayvanları ve kümes hayvanları etleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.32.03",
        "tanim": "Yenilebilir sakatat (ciğer, işkembe, böbrek, taşlık vb.) toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.32.04",
        "tanim": "Et ürünlerinin toptan ticareti (salam, sosis, sucuk, pastırma vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.32.05",
        "tanim": "Balık, kabuklular, yumuşakçalar ve diğer deniz ürünleri toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.33.01",
        "tanim": "Süt ürünleri toptan ticareti (işlenmiş süt, süt tozu, yoğurt, peynir, kaymak, tereyağı vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.33.02",
        "tanim": "Yumurta ve yumurta ürünleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.33.03",
        "tanim": "Hayvan veya bitkisel kaynaklı yenilebilir sıvı ve katı yağların toptan ticareti (tereyağı hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.34.01",
        "tanim": "Alkollü içeceklerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.34.02",
        "tanim": "Meyve ve sebze suları, maden suyu, meşrubat ve diğer alkolsüz içeceklerin toptan ticareti (su hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.34.03",
        "tanim": "Su toptan ticareti (su istasyonları dahil, şebeke suyu hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.35.01",
        "tanim": "Tütün ürünlerinin toptan ticareti (işlenmemiş tütün hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.36.01",
        "tanim": "Çikolata ve şekerleme toptan ticareti (helva, lokum, akide şekeri, bonbon şekeri vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.36.02",
        "tanim": "Fırıncılık mamullerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.36.03",
        "tanim": "Şeker toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.36.04",
        "tanim": "Dondurma ve diğer yenilebilir buzların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.37.01",
        "tanim": "Çay toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.37.02",
        "tanim": "Kahve, kakao ve baharat toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.37.03",
        "tanim": "İçecek amaçlı kullanılan aromatik bitkilerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.38.02",
        "tanim": "Ev hayvanları için yemlerin veya yiyeceklerin toptan ticareti (çiftlik hayvanları için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.38.03",
        "tanim": "Gıda tuzu (sofra tuzu) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.38.04",
        "tanim": "Un, nişasta, makarna, şehriye vb. ürünler ile hazır gıdaların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.38.05",
        "tanim": "Hazır homojenize gıda ile diyetetik gıda ürünleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.38.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer gıda ürünlerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.39.03",
        "tanim": "Uzmanlaşmamış gıda, içecek ve tütün toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.41.01",
        "tanim": "Evde kullanılan tekstil takımları, perdeler ve çeşitli tekstil malzemesinden ev eşyaları toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.41.02",
        "tanim": "Tuhafiye ürünleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.41.03",
        "tanim": "Kumaş toptan ticareti (manifatura ürünleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.41.04",
        "tanim": "İplik toptan ticareti (tuhafiye ürünleri ile dikiş ipliği hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.41.90",
        "tanim": "Diğer tekstil ürünleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.01",
        "tanim": "Bebek giysileri, sporcu giysileri ve diğer giyim eşyalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.02",
        "tanim": "Ayakkabı toptan ticareti (spor ayakkabıları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.03",
        "tanim": "Çorap ve giysi aksesuarlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.04",
        "tanim": "Kürk ve deriden giyim eşyalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.05",
        "tanim": "Dış giyim eşyalarının toptan ticareti (iş giysileri ile triko olanlar dahil, kürk ve deriden olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.06",
        "tanim": "İç giyim eşyalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.07",
        "tanim": "Şemsiye toptan ticareti (güneş ve bahçe şemsiyeleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.42.08",
        "tanim": "Ayakkabı malzemeleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.01",
        "tanim": "Beyaz eşya toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.08",
        "tanim": "Hırsız ve yangın alarmları ile benzeri cihazların toptan ticareti (evlerde kullanım amaçlı)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.09",
        "tanim": "Radyo, televizyon, video ve DVD cihazlarının toptan ticareti (antenler ile arabalar için radyo ve TV ekipmanları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.10",
        "tanim": "Fotoğrafçılıkla ilgili ürünlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.11",
        "tanim": "Optik ürünlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.12",
        "tanim": "Konutlarda, bürolarda ve mağazalarda kullanılan klimaların (iklimlendirme ekipmanlarının) toptan ticareti (sanayi tipi olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.43.90",
        "tanim": "Diğer elektrikli ev aletleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.44.01",
        "tanim": "Porselen ve cam eşyalar ile toprak ve seramikten yapılan ürünlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.44.02",
        "tanim": "Temizlik malzemesi toptan ticareti (kişisel temizlik sabunları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.44.04",
        "tanim": "Cila ve krem (ayakkabı, mobilya, yer döşemesi, kaporta, cam veya metal için) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.45.01",
        "tanim": "Parfüm, kozmetik ürünleri ve kolonya toptan ticareti (ıtriyat dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.45.02",
        "tanim": "Sabun toptan ticareti (kişisel temizlik için)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.46.01",
        "tanim": "Cerrahi, tıbbi ve ortopedik alet ve cihazların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.46.02",
        "tanim": "Temel eczacılık ürünleri ile eczacılık müstahzarlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.46.03",
        "tanim": "Dişçilikte kullanılan alet ve cihazların toptan ticareti (protezler, bağlantı parçaları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.46.04",
        "tanim": "Hayvan sağlığı ile ilgili ilaçların toptan ticareti (serum, aşı, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.47.01",
        "tanim": "Mobilya ve mobilya aksesuarları toptan ticareti (yatak dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.47.02",
        "tanim": "Halı, kilim, vb. yer kaplamaları toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.47.03",
        "tanim": "Aydınlatma ekipmanlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.47.04",
        "tanim": "Büro mobilyalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.48.01",
        "tanim": "Mücevher ve takı toptan ticareti (altın, gümüş, vb. olanlar) (imitasyon olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.48.02",
        "tanim": "Saat toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.01",
        "tanim": "Deri eşyalar ve seyahat aksesuarları toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.02",
        "tanim": "Spor malzemesi toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.03",
        "tanim": "Kırtasiye ürünleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.04",
        "tanim": "Oyun ve oyuncak toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.05",
        "tanim": "Hasır eşyalar, mantar eşyalar ve diğer ahşap ürünlerin toptan ticareti (ip vb. için makaralar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.06",
        "tanim": "Müzik aletleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.07",
        "tanim": "Çatal-bıçak takımı ve diğer kesici aletler ile metal sofra ve mutfak eşyalarının toptan ticareti (bakır mutfak eşyaları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.08",
        "tanim": "Tuvalet kağıdı, peçete, kağıt havlu ile kağıt tepsi, tabak, bardak, çocuk bezi vb. toptan ticareti (plastikten olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.09",
        "tanim": "Sportif amaçlı avcılık ve balıkçılık malzemeleri toptan ticareti (tabanca, av tüfeği ve balık ağları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.11",
        "tanim": "Kitap, dergi ve gazete toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.12",
        "tanim": "Hediyelik eşya toptan ticareti (pipo, tespih, bakır süs eşyaları, imitasyon takılar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.13",
        "tanim": "Bisikletler, elektrikli bisikletler, elektrikli tek tekerli taşıt (monowheels), hoverboard, kickscooterlar ve bunların parça ve aksesuarlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.17",
        "tanim": "Plastik sofra, mutfak ve diğer ev eşyası ile tuvalet eşyası toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.22",
        "tanim": "Tıraş bıçakları, usturalar ve jiletlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.24",
        "tanim": "Resim, fotoğraf vb. için çerçeve toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.25",
        "tanim": "Arı kovanı toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.26",
        "tanim": "Spor ve eğlence amaçlı teknelerin, kayıkların ve kanoların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.49.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ev eşyaları ve ev gereçlerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.50.01",
        "tanim": "Bilgisayar, bilgisayar çevre birimleri ve yazılımlarının toptan ticareti (bilgisayar donanımları, pos cihazları, ATM cihazları vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.50.02",
        "tanim": "Telekomünikasyon ekipman ve parçalarının toptan ticareti (telefon ve iletişim ekipmanları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.50.03",
        "tanim": "Elektronik cihaz ve parçalarının toptan ticareti (elektronik valfler, tüpler, yarı iletken cihazlar, mikroçipler, entegre devreler, baskılı devreler, vb.) (seyrüsefer cihazları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.50.90",
        "tanim": "Diğer bilgi ve iletişim teknolojisi ekipmanlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.61.02",
        "tanim": "Tarım, hayvancılık ve ormancılık makine ve ekipmanları ile aksam ve parçalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.61.03",
        "tanim": "Çim biçme ve bahçe makine ve ekipmanları ile aksam ve parçalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.62.01",
        "tanim": "Ağaç işleme takım tezgahları ve parçalarının toptan ticareti (parça tutucuları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.62.02",
        "tanim": "Metal işleme takım tezgahlarının ve parçalarının toptan ticareti (parça tutucuları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.62.04",
        "tanim": "Lehimleme veya kaynak yapma için kullanılan makineler ile metallerin veya sinterlenmiş metal karbürlerin sıcak spreylenmesi için kullanılan elektrikli makine ve cihazlar ile parçalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.62.90",
        "tanim": "Diğer malzemeleri işleme için takım tezgahları ve parçalarının toptan ticareti (parça tutucuları dahil) (ağaç ve metal işlemede kullanılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.63.01",
        "tanim": "Bina ve bina dışı inşaat iş makinelerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.63.02",
        "tanim": "Madencilik makinelerinin toptan ticareti (madenler için bocurgatlar, sürekli hareketli elavatörler ve konveyörler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.03",
        "tanim": "Rüzgar türbinleri, kondansatörler, elektrik yalıtkanları (izolatör), AC/AD/DC motorlar, jeneratörler, yalıtılmış bobin telleri vb. elektrikli makine, cihaz ve aletlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.04",
        "tanim": "Kaldırma ve yükleme-boşaltma (elleçleme) ekipmanlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.05",
        "tanim": "Tekstil endüstrisi makineleri ile dikiş ve örgü makineleri ve parçalarının toptan ticareti (ev tipi olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.06",
        "tanim": "Kompresör ve parçalarının toptan ticareti (soğutma, hava ve diğer amaçlar için)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.07",
        "tanim": "Ulaşım araçları toptan ticareti (motorlu kara taşıtları, motosiklet ve bisikletler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.08",
        "tanim": "Gıda, içecek ve tütün sanayisinde kullanılan makineler ile parçalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.09",
        "tanim": "Akümülatör, batarya, pil ve bunların parçalarının toptan ticareti (evlerde, motosikletlerde ve motorlu kara taşıtlarında kullanılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.10",
        "tanim": "Silah ve mühimmat toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.64.11",
        "tanim": "İş güvenliği amaçlı kişisel koruyucu donanımların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.12",
        "tanim": "Yangın söndürücüler, püskürtme tabancaları, buhar veya kum püskürtme makineleri ile benzeri mekanik cihazların toptan ticareti (tarımsal amaçlı kullanılanlar ile taşıtlar için yangın söndürücüler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.13",
        "tanim": "Sanayi, ticaret, seyrüsefer ve diğer hizmetlerde kullanılmak üzere başka yerde sınıflandırılmamış diğer makinelere ait parçaların toptan ticareti (motorlu kara taşıtları için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.14",
        "tanim": "Zırhlı veya güçlendirilmiş kasalar ve kutular ile kasa daireleri için zırhlı veya güçlendirilmiş kapılar ve kilitli kutular ile para veya evrak kutuları, vb. (adi metalden) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.15",
        "tanim": "Elektrik malzemeleri toptan ticareti (evde kullanılan pil ve bataryalar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.16",
        "tanim": "Makine ve ekipmanlarla ilgili aksam ve parçaların toptan ticareti (motorlu kara taşıtları için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.64.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer makine ve ekipmanların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.71.04",
        "tanim": "Otomobillerin ve hafif motorlu kara taşıtlarının toptan ticareti (elektrikli olanlar ile ambulans ve minibüs benzeri motorlu yolcu taşıtları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.71.90",
        "tanim": "Diğer motorlu kara taşıtlarının toptan ticareti (kamyonlar, çekiciler, römorklar, yarı römorklar, kamp araçları vb., elektrikli olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.72.12",
        "tanim": "Motorlu kara taşıtlarının parçalarının toptan ticareti (cam, lastik ve jantlar ile motosiklet parçaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.72.13",
        "tanim": "Motorlu kara taşıtı lastiklerinin ve jantlarının toptan ticareti (motosiklet lastik ve jantları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.72.14",
        "tanim": "Motorlu kara taşıtlarının aksesuarlarının toptan ticareti (motosiklet aksesuarları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.72.15",
        "tanim": "Motorlu kara taşıtlarının camlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.73.24",
        "tanim": "Motosikletler ve motorlu bisikletlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.73.25",
        "tanim": "Motosikletler ve motorlu bisikletlerin parça ve aksesuarlarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.81.01",
        "tanim": "Sıvı yakıtlar ve bunlarla ilgili ürünlerin toptan ticareti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.81.02",
        "tanim": "Gazlı yakıtlar ve bunlarla ilgili ürünlerin toptan ticareti (LPG (bütan ve propan), tüpgaz, doğalgaz (LNG, CNG) vb. dahil, şebeke üzerinden yapılanlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.81.03",
        "tanim": "Katı yakıtlar ve bunlarla ilgili ürünlerin toptan ticareti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.82.01",
        "tanim": "Demir/çelikten bar ve çubukların, profillerin, levha kazıkların (palplanş), tüp ve boruların toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.02",
        "tanim": "Değerli metal cevherleri ve konsantrelerinin toptan ticareti (altın, gümüş, platin vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.82.03",
        "tanim": "Birincil formdaki değerli metallerin toptan ticareti - kütük, blok, granül, toz, pelet, levha, bar, çubuk, profil vb. formlarda (altın, gümüş, platin vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.04",
        "tanim": "Demir/çelikten haddelenmiş/soğuk çekilmiş yassı ürünlerin toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.05",
        "tanim": "Demir cevherleri toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.06",
        "tanim": "Demir dışı metal cevherleri ve konsantrelerinin toptan ticareti (alüminyum, bakır, nikel, kurşun, çinko, kalay, vb. cevherleri dahil, uranyum ve toryum cevherleri ile değerli metal cevherleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.07",
        "tanim": "Birincil formdaki demir ve çelik toptan ticareti - kütük (ingot), blok, granül, toz, pelet, parça vb. formlarda (pik demir, manganezli dökme demir, demir, çelik ve çelik alaşımları vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.08",
        "tanim": "Birincil formdaki demir dışı metallerin toptan ticareti - kütük, blok, granül, toz, pelet, levha, bar, çubuk, profil vb. formlarda (alüminyum, bakır, nikel, kurşun, çinko, kalay, vb. dahil, altın, gümüş ve platin hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.09",
        "tanim": "Demir/çelikten diğer birincil formdaki ürünlerin toptan ticareti (nervürlü levhalar, sandviç paneller ve demir yolu veya tramvay yolu yapım malzemesi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.82.10",
        "tanim": "Uranyum ve toryum cevherleri toptan ticareti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.83.01",
        "tanim": "Çimento, alçı, harç, kireç, mozaik vb. inşaat malzemeleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.02",
        "tanim": "Ağacın ilk işlenmesinden elde edilen ürünlerin toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.03",
        "tanim": "Düz cam toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.04",
        "tanim": "Boya, vernik ve lak toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.05",
        "tanim": "Banyo küvetleri, lavabolar, eviyeler, klozet kapakları, tuvalet taşı ve rezervuarları ile seramikten karo ve fayans vb. sıhhi ürünlerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.06",
        "tanim": "Metalden prefabrik yapıların, köprülerin, köprü parçalarının, kulelerin, kafes direklerin, konstrüksiyon elemanlarının, diğer yapıların ve yapı elemanlarının toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.07",
        "tanim": "Mermer, granit, kayağan taşı, kum taşı vb. toptan ticareti (işlenmemiş veya blok halde olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.08",
        "tanim": "Taş, kum, çakıl, mıcır, kil, kaolin vb. inşaat malzemeleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.09",
        "tanim": "İşlenmiş mermer, traverten, kaymaktaşı (su mermeri) ve bunlardan yapılmış ürünlerin toptan ticareti (levha halinde olanlar ile lavabo vb. sıhhi ürünler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.10",
        "tanim": "Tuğla, kiremit, briket, kaldırım taşı vb. inşaat malzemeleri toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.11",
        "tanim": "Plastik kapı, pencere ve bunların kasaları ile kapı eşikleri, panjurlar, jaluziler, storlar vb. eşyaların toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.12",
        "tanim": "İşlenmemiş ağaç (tomruk-ham haldeki) toptan ticareti (orman ağaçları, endüstriyel odunlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.13",
        "tanim": "Metalden kapı, pencere ve bunların kasaları ile kapı eşiklerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.14",
        "tanim": "Masif, lamine ve laminant parke toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.15",
        "tanim": "İnşaatlarda izolasyon amaçlı kullanılan malzemelerin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.16",
        "tanim": "Betondan, çimentodan ve suni taştan prefabrik yapıların, yapı elemanlarının ve diğer ürünlerin toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.17",
        "tanim": "Alçı ve alçı esaslı bileşenlerden inşaat amaçlı ürünlerin toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.18",
        "tanim": "Duvar kağıdı, tekstil duvar kaplamaları, plastikten zemin, duvar veya tavan kaplamalarının toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.19",
        "tanim": "Plastikten inşaat amaçlı tabakalar, levhalar, filmler, folyolar, şeritler ve borular ile asfalt vb. malzemeden çatı kaplama ürünlerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.20",
        "tanim": "Ahşap kapı, pencere ve bunların kasaları ile kapı eşiklerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.83.21",
        "tanim": "Plastikten prefabrik yapılar ve yapı elemanlarının toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.22",
        "tanim": "Ahşaptan prefabrik yapıların ve yapı elemanlarının toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.83.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer inşaat malzemesi toptan ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.84.01",
        "tanim": "Hırdavat (nalburiye) malzemesi ve el aletleri toptan ticareti (çivi, raptiye, vida, adi metalden kilit, menteşe, bağlantı parçası, çekiç, testere, pense, tornavida, takım tezgahı uçları, çengel, halka, perçin, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.84.02",
        "tanim": "Sıhhi tesisat ve ısıtma tesisatı malzemesi toptan ticareti (lavabo musluğu, vana, valf, tıkaç, t-parçaları, bağlantılar, vb.) (kombiler ve radyatörler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.84.03",
        "tanim": "Demirden veya çelikten merkezi ısıtma radyatörleri, merkezi ısıtma kazanları (kombiler dahil) ile bunların parçalarının toptan ticareti (buhar jeneratörleri ve kızgın su üreten kazanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.84.04",
        "tanim": "Demir veya çelikten dikenli tel, bakır veya alüminyumdan örgülü tel, kablo, örme şerit ve benzerleri (elektrik yalıtımı olanlar hariç), demir, çelik veya bakır tellerden mensucat, ızgara, ağ, kafeslik ve çit toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.84.05",
        "tanim": "Tarım ve ormancılık alet ve malzemeleri toptan ticareti (balta, kazma, orak, tırpan, vb. dahil, tarımsal amaçlı makine ve ekipmanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.84.06",
        "tanim": "Metal rezervuar, tank, fıçı ve benzeri konteyner toptan ticareti, kapasitesi > 300 litre olanlar (merkezi ısıtma amaçlı olanlar ile mekanik veya termal ekipmanlı olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.85.01",
        "tanim": "Endüstriyel kimyasalların toptan ticareti (anilin, matbaa mürekkebi, kimyasal yapıştırıcı, havai fişek, boyama maddeleri, sentetik reçine, metil alkol, parafin, esans ve tatlandırıcı, soda, sanayi tuzu, parafin, nitrik asit, amonyak, sanayi gazları vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.85.02",
        "tanim": "Suni gübrelerin toptan ticareti (gübre mineralleri, gübre ve azot bileşikleri ve turba ile amonyum sülfat, amonyum nitrat, sodyum nitrat, potasyum nitrat vb. dahil, nitrik asit, sülfonitrik asit ve amonyak hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.85.03",
        "tanim": "Zirai kimyasal ürünlerin toptan ticareti (haşere ilaçları, yabancı ot ilaçları, dezenfektanlar, mantar ilaçları, çimlenmeyi önleyici ürünler, bitki gelişimini düzenleyiciler ve diğer zirai kimyasal ürünler)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.85.04",
        "tanim": "Hayvansal veya bitkisel gübrelerin toptan ticareti (kapalı alanda yapılan ticaret)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "46.85.05",
        "tanim": "Hayvansal veya bitkisel gübrelerin toptan ticareti (açık alanda yapılan ticaret)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.01",
        "tanim": "Birincil formdaki plastik ve kauçuk toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.02",
        "tanim": "Sanayide kullanım amaçlı plastik poşet, çanta, torba, çuval, vb. ambalaj malzemelerinin toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.03",
        "tanim": "Dökme halde kağıt ve mukavva toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.04",
        "tanim": "Tekstil elyafı toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.05",
        "tanim": "İşlenmemiş inci, değerli ve yarı değerli taşların toptan ticareti (sanayi tipi elmaslar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.86.99",
        "tanim": "Başka yerde sınıflandırılmamış ara ürün (tarım hariç) toptan ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.87.01",
        "tanim": "Atık ve hurda toptan ticareti (metal olanlar) (kağıt, cam, plastik vb. ikincil hammaddeler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.87.02",
        "tanim": "Atık ve hurda toptan ticareti (kağıt, cam, plastik vb. olanlar) (metal olanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "46.89.00",
        "tanim": "Başka yerde sınıflandırılmamış uzmanlaşmış diğer toptan ticaret",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.90.01",
        "tanim": "Uzmanlaşmamış toptan ticaret (bir başka ülkeyle yapılan toptan ticaret hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "46.90.04",
        "tanim": "Başka ülkeyle yapılan uzmanlaşmamış toptan ticaret",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.01",
        "tanim": "Bakkal ve marketlerde yapılan perakende ticaret (gıda, içecek veya tütün ağırlıklı perakende ticaret)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.02",
        "tanim": "Süpermarket ve hipermarketlerde yapılan perakende ticaret (gıda, içecek veya tütün ağırlıklı perakende ticaret)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.03",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla diğer gıda ürünleri (bal, un, tahıl, pirinç, bakliyat vb. dahil) perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.04",
        "tanim": "Seyyar olarak ve motorlu araçlarla gıda ürünleri ve içeceklerin (alkollü içecekler hariç) perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.05",
        "tanim": "Büfelerde gıda, alkollü ve alkolsüz içecek veya tütün ağırlıklı perakende ticaret",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.06",
        "tanim": "Mağaza, tezgah, pazar yeri dışında yapılan perakende ticaret (ev ev dolaşarak veya komisyoncular tarafından perakende olarak yapılanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.11.99",
        "tanim": "Başka yerde sınıflandırılmamış gıda, içecek veya tütün ağırlıklı perakende ticaret (tanzim satış ve gıda tüketim kooperatifleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.12.01",
        "tanim": "Uzmanlaşmamış diğer perakende ticaret (gıda, içecek ve tütün ağırlıklı olmayan)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.12.02",
        "tanim": "Seyyar olarak ve motorlu araçlarla diğer malların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.12.03",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla bys. diğer malların perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.01",
        "tanim": "Taze sebze ve meyve perakende ticareti (manav ürünleri ile kültür mantarı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.02",
        "tanim": "İşlenmiş ve korunmuş meyve ve sebzelerin perakende ticareti (turşular ile dondurulmuş, salamura edilmiş, konserve ve kurutulmuş sebze ve meyveler vb. dahil, baklagil, zeytin ve kuru yemiş hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.03",
        "tanim": "Zeytin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.04",
        "tanim": "Kuru bakliyat ürünleri perakende ticareti (fasulye, mercimek, nohut, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.05",
        "tanim": "Kuru yemiş perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.21.06",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla sebze ve meyve (taze veya işlenmiş) (zeytin dahil) perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.22.02",
        "tanim": "Et ürünleri perakende ticareti (sosis, salam, sucuk, pastırma vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.22.05",
        "tanim": "Et perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.22.06",
        "tanim": "Sakatat perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.22.07",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla şarküteri ürünleri, süt ve süt ürünleri ile yumurta perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.23.01",
        "tanim": "Balık, kabuklu hayvanlar ve yumuşakçaların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.23.02",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla balık ve diğer su ürünleri perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.24.01",
        "tanim": "Ekmek, pasta ve unlu mamullerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.24.02",
        "tanim": "Çikolata ve şekerleme perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.24.03",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla fırın ürünleri perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.24.04",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla şekerleme perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.25.01",
        "tanim": "Alkollü ve alkolsüz içeceklerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.25.03",
        "tanim": "İçme suyu perakende ticareti (şebeke suyu hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.26.01",
        "tanim": "Tütün ve tütün ürünleri perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.26.02",
        "tanim": "Pipo, nargile, sigara ağızlığı, vb. perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.01",
        "tanim": "Süt ve süt ürünleri perakende ticareti (dondurma perakende ticareti hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.02",
        "tanim": "Dondurma, aromalı yenilebilir buzlar vb. perakende ticareti (pastanelerde verilen hizmetler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.03",
        "tanim": "Toz, kesme ve kristal şeker perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.04",
        "tanim": "Çay, kahve, kakao ve baharat perakende ticareti (bitki çayları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.05",
        "tanim": "Katı ve sıvı yağların perakende ticareti (yemeklik yağ dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.06",
        "tanim": "Hububat, un ve zahire ürünleri perakende ticareti (bulgur, pirinç, mısır, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.07",
        "tanim": "Yumurta perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.08",
        "tanim": "Homojenize gıda müstahzarları ve diyetetik ürünlerin perakende ticareti (glüten içermeyen gıda maddeleri, sodyum içermeyen tuzlar vb. ile besin yönünden zenginleştirilmiş sporcu gıdaları vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.09",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla yenilebilir katı ve sıvı yağ (tereyağı hariç) perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.10",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla çay, kahve, kakao, baharat perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.27.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer gıda ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.30.01",
        "tanim": "Motorlu kara taşıtı ve motosiklet yakıtının perakende ticareti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "47.30.02",
        "tanim": "Motorlu kara taşıtları için yağlama ve soğutma ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.40.01",
        "tanim": "Bilgisayarların, çevre donanımlarının ve yazılımların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.40.02",
        "tanim": "Telekomünikasyon teçhizatının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.40.03",
        "tanim": "Ses ve görüntü cihazlarının ve bunların parçalarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.02",
        "tanim": "Tuhafiye ürünleri perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.03",
        "tanim": "Kumaş perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.04",
        "tanim": "Halı, goblen veya nakış yapımı için temel materyallerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.05",
        "tanim": "Evde kullanılan tekstil takımları ve çeşitli tekstil malzemesinden ev eşyaları perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.06",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla tuhafiye, manifatura ve mefruşat ürünleri perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.07",
        "tanim": "Seyyar olarak ve motorlu araçlarla tekstil, giyim eşyası ve ayakkabı perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.51.90",
        "tanim": "Diğer tekstil ürünleri perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.01",
        "tanim": "Çimento, alçı, harç, kireç, tuğla, kiremit, briket, taş, kum, çakıl vb. inşaat malzemeleri perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.52.02",
        "tanim": "Hırdavat (nalburiye) ve el aletleri perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.03",
        "tanim": "Boya, vernik, lak, solvent vb. ürünlerin perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.52.04",
        "tanim": "Düz cam perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.05",
        "tanim": "Metalden kapı, pencere ve bunların kasaları ile kapı eşiklerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.06",
        "tanim": "Sıhhi tesisat ve ısıtma tesisatı malzemesi perakende ticareti (kombiler ve radyatörler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.09",
        "tanim": "Plastik kapı, pencere ve bunların kasaları ile kapı eşikleri, panjurlar, jaluziler, storlar ve benzeri eşyaların perakende ticareti (PVC olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.10",
        "tanim": "Ağacın ilk işlenmesinden elde edilen ürünlerin perakende ticareti (kereste, ağaç talaşı ve yongası, kontrplak, yonga ve lifli levhalar (mdf, sunta vb.), parke, ahşap varil, fıçı ve diğer muhafazalar, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.52.11",
        "tanim": "Banyo küveti, lavabo, klozet kapağı, tuvalet taşı ve rezervuarı ile seramikten karo ve fayans vb. sıhhi ürünlerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.13",
        "tanim": "Demirden/çelikten bar ve çubukların, profillerin, tüp ve boruların perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.52.15",
        "tanim": "Demirden veya çelikten merkezi ısıtma radyatörleri, merkezi ısıtma kazanları (kombiler dahil) ile bunların parçalarının perakende ticareti (buhar jeneratörleri ve kızgın su üreten kazanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.16",
        "tanim": "Çim biçme ve bahçe ekipmanları perakende ticareti (kar küreyiciler dahil) (tarımda kullanılan el aletleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.17",
        "tanim": "Ahşap kapı, pencere ve bunların kasaları ile kapı eşiklerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.18",
        "tanim": "Prefabrik yapılar ve yapı elemanlarının perakende ticareti (metalden, betondan, plastikten, ahşaptan vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.52.19",
        "tanim": "İşlenmiş mermer, traverten, kaymaktaşı (su mermeri) ve bunlardan yapılmış ürünlerin perakende ticareti (levha halinde olanlar ile mermer lavabo vb. sıhhi ürünler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.20",
        "tanim": "Alçı ve alçı esaslı bileşenlerden inşaat amaçlı ürünlerin perakende ticareti (kartonpiyer, panel, levha vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.21",
        "tanim": "Plastikten inşaat amaçlı levhalar, folyolar, şeritler ve borular ile asfalt vb. malzemeden çatı kaplama ürünlerinin perakende ticareti (inşaat için naylon örtü, shıngle, mantolama amaçlı strafor vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.22",
        "tanim": "Masif, lamine ve laminant parke perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.23",
        "tanim": "Yangın söndürücüler ve ekipmanlarının perakende ticareti (arabalar için olanlar ve yüksek basınçlı olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.24",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla mutfak eşyaları ile banyo ve tuvalette kullanılan eşyaların perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.25",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla elektrikli alet, cihaz ve elektrik malzemeleri, el aletleri ile hırdavat perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.52.99",
        "tanim": "Başka yerde sınıflandırılmamış inşaat malzemesi perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.53.01",
        "tanim": "Perde, iç stor, perde veya yatak saçağı ve farbelası perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.53.02",
        "tanim": "Halı, kilim ve diğer tekstil yer döşemeleri perakende ticareti (keçeden olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.53.03",
        "tanim": "Duvar kağıdı, tekstil duvar kaplamaları, kauçuk yer döşemeleri ve paspaslar ile plastik zemin, duvar veya tavan kaplamaları perakende ticareti (linolyum gibi elastiki zemin kaplamaları, marley, vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.53.04",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla halı, kilim, vb. perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.54.01",
        "tanim": "Beyaz eşya ve elektrikli küçük ev aleti perakende ticareti (radyo, televizyon ve fotoğrafçılık ürünleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.54.03",
        "tanim": "Evde kullanım amaçlı elektrik tesisat malzemesi perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.54.99",
        "tanim": "Başka yerde sınıflandırılmamış elektrikli ev aletleri perakende ticareti (radyo, TV ve fotoğrafçılık ürünleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.01",
        "tanim": "Elektriksiz ev aletleri, sofra ve mutfak eşyaları ile züccaciye ürünlerinin perakende ticareti (plastikten olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.02",
        "tanim": "Aydınlatma teçhizatı perakende ticareti (elektrik malzemeleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.03",
        "tanim": "Ev mobilyalarının ve aksesuarlarının perakende ticareti (baza, somya, karyola dahil; hasır ve sepetçi söğüdü gibi malzemelerden olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.04",
        "tanim": "Ahşap, mantar ve hasır eşyaların perakende ticareti (ahşap sofra ve mutfak eşyaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.05",
        "tanim": "Plastikten sofra, mutfak, tuvalet ve diğer ev eşyalarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.06",
        "tanim": "Büro mobilyaları ve aksesuarlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.07",
        "tanim": "Bahçe mobilyalarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.08",
        "tanim": "Yatak perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.09",
        "tanim": "Elektriksiz fırın ve ocaklar ile hava ve su ısıtıcılarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.10",
        "tanim": "Bebek arabaları, pusetleri, bebek yürüteçleri, bebek taşıyıları, bebek oto koltukları gibi bebek ekipmanlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.11",
        "tanim": "Kağıt veya mukavvadan tuvalet kağıdı, kağıt mendil, kağıt havlular, kağıt masa örtüsü ve peçeteler ile kağıt veya mukavvadan tepsi, tabak, kase, bardak ve benzerlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.12",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla ev ve büro mobilyaları (ağaç, metal, vb.) perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.13",
        "tanim": "Bakır eşya, bakır sofra ve mutfak eşyası perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.55.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer ev eşyalarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.61.00",
        "tanim": "Kitap perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.62.01",
        "tanim": "Kırtasiye ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.62.03",
        "tanim": "Gazete ve dergilerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.02",
        "tanim": "Motorlu taşıtlar dışındaki eğlence ve spor amaçlı taşıtların perakende ticareti (tekne, yelkenli, kano, kayık, bot, balon,vb. ile deniz taşıtları için dıştan takmalı motorlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.03",
        "tanim": "Kamp malzemeleri perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.04",
        "tanim": "Bisiklet perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.05",
        "tanim": "Jimnastik ve atletizm eşya ve ekipmanları ile form tutma merkezlerine ait eşya ve ekipmanların perakende ticareti (halter, yürüme bantları, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.07",
        "tanim": "Spor ayakkabısı perakende ticareti (kayak botları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.63.08",
        "tanim": "Avcılık ve balıkçılık teçhizatı ve malzemeleri ile silah ve mühimmat perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.63.90",
        "tanim": "Uzmanlaşmış diğer spor malzemelerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.64.08",
        "tanim": "Oyunlar ve oyuncakların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.64.09",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla imitasyon takı, süs eşyası, oyun, oyuncak, turistik ve hediyelik eşya perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.69.01",
        "tanim": "Müzik aletleri ve müzik partisyonu (nota kağıdı) perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.69.02",
        "tanim": "Müzik ve video kayıtlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.69.03",
        "tanim": "Sanat eserlerinin perakende ticareti (antika eşyalar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.69.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer kültür ve eğlence (rekreasyon) ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.01",
        "tanim": "Bebek ve çocuk giyim eşyası perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.02",
        "tanim": "Giysi aksesuarları perakende ticareti (eldiven, kravat, şapka, eşarp, şal, mendil, kemer, pantolon askısı, şemsiye, baston, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.03",
        "tanim": "Kürklü deriden giyim eşyalarının perakende ticareti (işlenmiş kürklü deriler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.04",
        "tanim": "Diğer dış giyim perakende satışı (palto, kaban, anorak, takım elbise, ceket, pantolon, şort (tekstil kumaşından veya örgü ve tığ işi))",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.05",
        "tanim": "İç giyim ve çorap perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.07",
        "tanim": "Deri veya deri bileşimli giyim eşyası perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.08",
        "tanim": "Süveter, kazak, hırka, yelek ve benzeri eşyaların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.09",
        "tanim": "İş giysisi perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.11",
        "tanim": "Spor giysisi perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.12",
        "tanim": "Gelinlik perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.13",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla iç giyim eşyası, dış giyim eşyası, çorap, giysi aksesuarı ve ayakkabı perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.71.99",
        "tanim": "Belirli bir mala tahsis edilmiş mağazalarda başka yerde sınıflandırılmamış giyim eşyası perakende ticareti (plastikten, vulkanize kauçuktan, kağıttan, dokusuz kumaştan ya da emdirilmiş veya kaplanmış tekstil kumaşından giysiler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.72.01",
        "tanim": "Ayakkabı, terlik vb. perakende ticareti (kavafiye dahil; spor ayakkabıları ile tamamı tekstilden olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.72.02",
        "tanim": "Bavul, el çantası ve diğer seyahat aksesuarlarının perakende ticareti (deriden, deri bileşimlerinden, plastik levhadan, tekstil malzemesinden, vulkanize (ebonit) elyaf veya mukavvadan)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.72.05",
        "tanim": "Saraciye ürünleri ve koşum takımı perakende ticareti (eyer, semer, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.72.06",
        "tanim": "Ayakkabı parçaları perakende ticareti (deri, ayakkabı sayası, topuk, topuk yastığı, ayakkabı bağları vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.72.90",
        "tanim": "Deriden veya deri bileşimlerinden diğer ürünlerin perakende ticareti (deri veya deri bileşimli giyim eşyası hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.73.01",
        "tanim": "Eczacılık ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.73.02",
        "tanim": "Veterinerlik ürünlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.74.01",
        "tanim": "Tıbbi ve ortopedik ürünlerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.74.02",
        "tanim": "Gözlük, kontak lens, gözlük camı vb. perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.75.01",
        "tanim": "Kozmetik ve kişisel bakım malzemelerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.75.02",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla kişisel bakım ve kozmetik ürünleri ile temizlik ürünleri perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.76.01",
        "tanim": "Ev hayvanları, bunların mama ve gıdaları ile eşyalarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.76.02",
        "tanim": "Çiçek, bitki ve tohum perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.76.03",
        "tanim": "Gübre ve zirai kimyasal ürünlerin perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.76.04",
        "tanim": "Canlı büyükbaş ve küçükbaş hayvanların perakende ticareti (ev hayvanları hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.76.05",
        "tanim": "Canlı kümes hayvanlarının perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.76.06",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla çiçek, bitki ve bitki tohumu (çiçek toprağı ve saksıları dahil) perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.76.07",
        "tanim": "Tezgahlar ve pazar yerleri vasıtasıyla canlı büyük ve küçükbaş hayvan, canlı kümes hayvanı, ev hayvanı ve yemlerinin perakende ticareti (seyyar satıcılar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.77.01",
        "tanim": "Altın ve diğer değerli metallerden takı, eşya ve mücevherat perakende ticareti (kuyumculuk ürünleri perakende ticareti dahil, gümüşten olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.77.02",
        "tanim": "Gümüş takı, eşya ve mücevherat perakende ticareti (gümüşçü ürünleri perakende ticareti)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.77.03",
        "tanim": "Saat (kol, masa, duvar vb. saatler ile kronometreler) perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.77.05",
        "tanim": "Doğal inciden veya kültür incisinden ürünler ile değerli ya da yarı değerli taşlardan yapılan ürünlerin perakende ticareti (pırlanta, yakut, zümrüt, safir vb.den yapılan ürünler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.02",
        "tanim": "Kömür ve yakacak odun perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.04",
        "tanim": "Hediyelik eşyaların, el işi ürünlerin ve imitasyon takıların perakende ticareti (sanat eserleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.07",
        "tanim": "Optik ve hassas aletlerin perakende ticareti (mikroskop, dürbün ve pusula dahil; gözlük camı, fotoğrafik ürünler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.08",
        "tanim": "Büro makine ve ekipmanlarının perakende ticareti (hesaplama makineleri, daktilolar, fotokopi makineleri, tarama ve faks cihazları, çizim masaları vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.09",
        "tanim": "Evlerde kullanılan fuel oil perakende ticareti",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.78.10",
        "tanim": "Evlerde kullanılan tüpgaz perakende ticareti",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "47.78.15",
        "tanim": "Temizlik malzemesi perakende ticareti (Arap sabunu, deterjan, yumuşatıcılar, şampuanlar vb. dahil; kişisel hijyen için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.16",
        "tanim": "Yün, tiftik vb. perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.22",
        "tanim": "Fotoğrafçılık malzemeleri ve aletlerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.26",
        "tanim": "Yapma çiçek, yaprak ve meyveler ile mum perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.30",
        "tanim": "Tekstilden çuval, torba, vb. perakende ticareti (eşya paketleme amacıyla kullanılanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.78.31",
        "tanim": "Mağaza, tezgah, pazar yeri dışında müşterinin istediği yere ulaştırılarak yapılan doğrudan yakıt satışı (kalorifer yakıtı, yakacak odun, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "47.78.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer yeni malların perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.79.01",
        "tanim": "Antika perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.79.03",
        "tanim": "İkinci el kitapların perakende ticareti (sahafların faaliyetleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.79.04",
        "tanim": "Kullanılmış mobilya, elektrikli ve elektronik ev eşyası perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.79.06",
        "tanim": "Kullanılmış giysiler ve aksesuarlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.79.90",
        "tanim": "Diğer ikinci el eşya perakende ticareti (ikinci el motorlu kara taşıtları ve motosiklet parçaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.81.14",
        "tanim": "Otomobillerin ve hafif motorlu kara taşıtlarının perakende ticareti (elektrikli olanlar ile ambulans ve minibüs benzeri motorlu yolcu taşıtları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.81.90",
        "tanim": "Diğer motorlu kara taşıtlarının perakende ticareti (kamyonlar, çekiciler, römorklar, yarı römorklar, kamp araçları vb., elektrikli olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.04",
        "tanim": "Motorlu kara taşıtı lastiklerinin ve jantlarının perakende ticareti (motosiklet parça ve aksesuarları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.05",
        "tanim": "Motorlu kara taşıtı camlarının perakende ticareti (motosiklet parça ve aksesuarları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.06",
        "tanim": "Motorlu kara taşıtlarının ikinci el (kullanılmış) parçalarının perakende ticareti (motosiklet parça ve aksesuarları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.07",
        "tanim": "Motorlu kara taşıtlarının aksesuarlarının perakende ticareti (motosiklet parça ve aksesuarları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.08",
        "tanim": "Motorlu kara taşıtlarının akülerinin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.82.90",
        "tanim": "Motorlu kara taşıtlarının diğer parça ve aksesuarlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.83.01",
        "tanim": "Motosikletler ve motorlu bisikletlerin perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.83.02",
        "tanim": "Motosikletler ve motorlu bisikletlerin parça ve aksesuarlarının perakende ticareti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.91.14",
        "tanim": "Radyo, TV, posta yoluyla veya internet üzerinden yapılan perakende ticaret",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.91.15",
        "tanim": "Uzmanlaşmamış perakende ticaret için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "47.92.00",
        "tanim": "Uzmanlaşmış perakende ticaret için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.11.00",
        "tanim": "Demir yolu ile şehirler arası yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.12.00",
        "tanim": "Diğer demir yolu ile yolcu taşımacılığı (gezi amaçlı taşımacılık dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.20.01",
        "tanim": "Demir yolu ile yük taşımacılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.31.04",
        "tanim": "Halk otobüsü/otobüs ile yapılan şehir içi ve banliyö yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.05",
        "tanim": "Belediye otobüsü ile yapılan şehir içi ve banliyö yolcu taşımacılığı (belediyenin sağladığı havaalanı otobüsü dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.06",
        "tanim": "Minibüs ve dolmuş ile yapılan şehir içi ve banliyö yolcu taşımacılığı (belirlenmiş güzergahlarda)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.07",
        "tanim": "Kara yolu (otobüs, vb.) ile uluslararası yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.08",
        "tanim": "Şehirler arası tarifeli kara yolu yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.09",
        "tanim": "Şehir içi, banliyö ve kırsal alanlarda kara yolu ile personel, öğrenci, vb. grup taşımacılığı (şehir içi personel ve okul servisleri, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.10",
        "tanim": "Kara yolu şehir içi ve şehirler arası havaalanı servisleri ile yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.31.90",
        "tanim": "Kara yoluyla tarifeli diğer yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.32.04",
        "tanim": "Kara yoluyla tarifesiz yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.33.01",
        "tanim": "Taksi ile yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.33.02",
        "tanim": "Sürücüsü ile birlikte diğer özel araç kiralama faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.34.00",
        "tanim": "Teleferik ve telesiyejlerle yolcu taşımacılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.39.00",
        "tanim": "Başka yerde sınıflandırılmamış kara taşımacılığı ile yapılan diğer yolcu taşımacılığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.41.01",
        "tanim": "Kara yolu ile şehir içi yük taşımacılığı (gıda, sıvı, kuru yük vb.) (gaz ve petrol ürünleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.41.02",
        "tanim": "Kara yolu ile şehirler arası yük taşımacılığı (gıda, sıvı, kuru yük, vb.) (gaz ve petrol ürünleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.41.03",
        "tanim": "Kara yolu ile uluslararası yük taşımacılığı (gıda, sıvı, kuru yük, vb.) (gaz ve petrol ürünleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.41.05",
        "tanim": "Kara yolu ile canlı hayvan taşımacılığı (çiftlik hayvanları, kümes hayvanları, vahşi hayvanlar vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.41.06",
        "tanim": "Sürücüsü ile birlikte kamyon, beton mikseri ve diğer motorlu yük taşıma araçlarının kiralanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.41.08",
        "tanim": "Kara yolu ile şehir içi yük taşımacılığı (gaz ve petrol ürünleri, kimyasal ürünler vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "49.41.09",
        "tanim": "Kara yolu ile şehirler arası yük taşımacılığı (gaz ve petrol ürünleri, kimyasal ürünler vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.41.10",
        "tanim": "Kara yolu ile uluslararası yük taşımacılığı (gaz ve petrol ürünleri, kimyasal ürünler vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.41.11",
        "tanim": "Kara yolu ile çeşitli taşıma türüne uygun konteyner taşımacılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.41.90",
        "tanim": "Kara yolu ile diğer yük taşımacılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.42.01",
        "tanim": "Ev ve iş yerlerine verilen taşımacılık hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "49.50.01",
        "tanim": "Boru hattı ile ham petrol, rafine petrol ve petrol ürünleri taşımacılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.50.03",
        "tanim": "Boru hattı pompa istasyonlarını işletme hizmetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.50.04",
        "tanim": "Boru hattı ile doğal gaz taşımacılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "49.50.90",
        "tanim": "Boru hattı ile diğer malların taşımacılığı (kömür çamuru, kimyasal ürünler, vb, boru hattı pompa istasyonlarını işletme hizmetleri dahil)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "50.10.12",
        "tanim": "Deniz ve kıyı sularında yolcu gemilerinin ve teknelerinin mürettebatıyla birlikte kiralanması (gezinti tekneleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.10.13",
        "tanim": "Kıyı sularında yolcuların feribotlarla, kruvaziyer gemilerle ve teknelerle taşınması (deniz otobüsleri işletmeciliği dahil; uluslararası denizler ile göl ve nehirlerde yapılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.10.14",
        "tanim": "Deniz ve kıyı sularında yat işletmeciliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "50.10.15",
        "tanim": "Deniz ve kıyı sularında gezi veya tur bot ve teknelerinin işletilmesi (yat işletmeciliği hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.10.16",
        "tanim": "Uluslararası denizlerde yolcuların gemilerle taşınması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.10.90",
        "tanim": "Deniz ve kıyı sularında diğer yolcu taşımacılığı (deniz taksi vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.17",
        "tanim": "Uluslararası sularda ham petrolün, petrol ürünlerinin ve kimyasalların tanker gemilerle taşınması (gazlar hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "50.20.18",
        "tanim": "Uluslararası sularda dökme kuru yük taşınması (kimyasalların taşınması hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.19",
        "tanim": "Uluslararası sularda ve kabotaj hattında çekme ve itme hizmetleri (römorkaj) (mavnaların, petrol kulelerinin vb.nin taşınması) (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.20",
        "tanim": "Uluslararası sularda frigorifik gemilerle dondurulmuş veya soğutulmuş malların taşınması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.21",
        "tanim": "Uluslararası sularda çoklu taşıma türüne uygun konteynerlerin konteyner gemileriyle taşınması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.22",
        "tanim": "Uluslararası sularda ve kabotaj hattında yük taşımacılığı gemilerinin mürettebatıyla birlikte kiralanması (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.23",
        "tanim": "Uluslararası sularda diğer dökme sıvıların tanker gemilerle taşınması (ham petrolün, petrol ürünlerinin, gazların ve kimyasalların taşınması hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.24",
        "tanim": "Uluslararası sularda gazların tanker gemilerle taşınması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "50.20.25",
        "tanim": "Kabotaj hattında ham petrolün, petrol ürünlerinin ve kimyasalların tanker gemilerle taşınması (gazlar hariç) (iç sular hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "50.20.26",
        "tanim": "Kabotaj hattında dökme kuru yük taşınması (kimyasalların taşınması hariç) (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.27",
        "tanim": "Kabotaj hattında frigorifik gemilerle dondurulmuş veya soğutulmuş malların taşınması (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.28",
        "tanim": "Kabotaj hattında çoklu taşıma türüne uygun konteynerlerin konteyner gemileriyle taşınması (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.29",
        "tanim": "Kabotaj hattında diğer sıvıların tanker gemilerle taşınması (ham petrolün, petrol ürünlerinin, gazların ve kimyasalların taşınması hariç) (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.30",
        "tanim": "Kabotaj hattında gazların tanker gemilerle taşınması (iç sular hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "50.20.90",
        "tanim": "Uluslararası sularda yapılan diğer yük taşımacılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.20.91",
        "tanim": "Kabotaj hattında yapılan diğer yük taşımacılığı (iç sular hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.30.08",
        "tanim": "İç sularda yolcu taşımacılığı (nehir, kanal ve göllerde yapılanlar, vb.) (gezinti amaçlı olanlar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.30.09",
        "tanim": "İç sularda yolcu taşıma gemilerinin ve teknelerinin mürettebatıyla birlikte kiralanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.40.05",
        "tanim": "İç sularda yük taşımacılığı (nehir, kanal ve göllerde yapılanlar, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.40.07",
        "tanim": "İç sularda yük taşıma gemi ve teknelerinin mürettebatıyla birlikte kiralanması hizmetleri (nehir, kanal ve göllerde, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "50.40.08",
        "tanim": "İç sularda çekme ve itme hizmetleri (römorkaj) (mavnaların, şamandıraların vb.nin taşınması) (nehir, kanal, göl vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "51.10.01",
        "tanim": "Hava yolu yolcu taşımacılığı (tarifeli olanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "51.10.02",
        "tanim": "Hava yolu yolcu taşımacılığı (turistik ve gezi amaçlı olanlar ile tarifesiz olanlar) (hava taksi taşımacılığı dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "51.10.03",
        "tanim": "Hava yolu yolcu taşıma araçlarının mürettebatıyla birlikte kiralanması",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "51.21.17",
        "tanim": "Hava yolu ile yük taşımacılığı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "51.22.02",
        "tanim": "Uzay taşımacılığı",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "52.10.02",
        "tanim": "Frigorifik depolama ve antrepoculuk faaliyetleri (bozulabilir gıda ürünleri dahil dondurulmuş veya soğutulmuş mallar için depolama)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.10.03",
        "tanim": "Hububat depolama ve antrepoculuk faaliyetleri (hububat silolarının işletilmesi vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.10.04",
        "tanim": "Petrol, petrol ürünleri, kimyasallar vb. depolama ve antrepoculuk faaliyetleri(gaz hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "52.10.05",
        "tanim": "Dökme sıvı depolama ve antrepoculuk faaliyetleri (yağ, şarap vb. dahil; petrol, petrol ürünleri, kimyasallar, gaz vb. hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.10.90",
        "tanim": "Diğer depolama ve antrepoculuk faaliyetleri (frigorifik depolar ile hububat, kimyasallar, dökme sıvı ve gaz depolama faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.21.04",
        "tanim": "Kara yolu taşımacılığı ile ilgili özel ve ticari araçlar için çekme ve yol yardımı faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.21.05",
        "tanim": "Demir yolu taşımacılığını destekleyici faaliyetler (demir yolu çekme ve itme hizmetleri, manevra ve makas değiştirme hizmetleri, demir yolu terminal hizmetleri vb. dahil, emanetçilik hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.06",
        "tanim": "Kara taşımacılığına yönelik emanet büroları işletmeciliği (demir yollarında yapılanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.07",
        "tanim": "Otopark ve garaj işletmeciliği (bisiklet parkları ve karavanların kışın saklanması dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.08",
        "tanim": "Otoyol, tünel ve köprü işletmeciliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.09",
        "tanim": "Kara yolu yolcu taşımacılığına yönelik otobüs terminal hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.10",
        "tanim": "Kara yolu yolcu taşımacılığına yönelik otobüs, minibüs ve taksi duraklarının işletilmesi (otobüs terminal hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.12",
        "tanim": "Kara taşımacılığını destekleyici olarak gazların sıvılaştırılması",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "52.21.13",
        "tanim": "Yolcu taşımacılığı kooperatiflerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.21.90",
        "tanim": "Kara taşımacılığını destekleyici diğer hizmetler (kamyon terminal işletmeciliği dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.22.06",
        "tanim": "Su yolu taşımacılığını destekleyici olarak liman ve su yollarının işletilmesi (limanların, iskelelerin, rıhtımların, su yolu havuzlarının, deniz terminallerinin vb. işletilmesi) (deniz feneri, fener dubası vb. işletilmesi hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.22.07",
        "tanim": "Su yolu taşımacılığını destekleyici olarak deniz feneri, fener dubası, fener gemisi, şamandıra, kanal işaretleri vb. seyir yardımcıları ile verilen hizmet faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.22.08",
        "tanim": "Deniz ve kıyı suları ile iç sularda kılavuzluk ve rıhtıma yanaştırma faaliyetleri (geminin havuzlanması ve havuzdan çıkarılması dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.22.10",
        "tanim": "Deniz ve kıyı suları ile iç sularda gemi kurtarma ve tekrar yüzdürme faaliyetleri (zor durumdaki gemilerin çekilmesi, bu gemilerin ve kargolarının kurtarılması vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.22.90",
        "tanim": "Su taşımacılığını destekleyici diğer hizmetler (Su yolu taşımacılığını destekleyici olarak deniz feneri, fener dubası, fener gemisi, şamandıra, kanal işaretleri vb. seyir yardımcıları ile verilen hizmet faaliyetleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.23.03",
        "tanim": "Havaalanı yer hizmet faaliyetleri (kargo ve bagaj yükleme boşaltma hizmetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.23.04",
        "tanim": "Havaalanı işletmeciliği (uçak pisti işletme, yolcu terminali ve havayolu şirketlerinin kendi bilet satış hizmetleri dahil; havaalanı yer hizmetleri ve bilet acentelerinin faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.23.06",
        "tanim": "Hava trafik kontrol hizmetleri (havaalanında yer alan kule ve radar istasyonları tarafından sağlanan hizmetler dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.23.07",
        "tanim": "Uzay taşımacılığını destekleyici hizmetler",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "52.23.90",
        "tanim": "Hava taşımacılığını destekleyici diğer faaliyetler (havaalanlarında yangın söndürme ve yangın önleme faaliyetleri, hava taşıtlarının çekilmesi, vb.)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "52.24.08",
        "tanim": "Su yolu taşımacılığıyla ilgili kargo ve bagaj yükleme boşaltma (elleçleme) hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.24.09",
        "tanim": "Hava yolu taşımacılığıyla ilgili kargo ve bagaj yükleme boşaltma (elleçleme) hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.24.10",
        "tanim": "Kara yolu taşımacılığıyla ilgili kargo yükleme boşaltma (elleçleme) hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.24.11",
        "tanim": "Demir yolu taşımacılığıyla ilgili kargo yükleme boşaltma (elleçleme) hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.24.90",
        "tanim": "Diğer kargo yükleme boşaltma (elleçleme) hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.25.01",
        "tanim": "Taşınan malların kasalardan, sandıklardan vb.lerinden çıkarılması, numune alınması, incelenmesi vb. faaliyetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.25.99",
        "tanim": "Başka yerde sınıflandırılmamış taşımacılığı destekleyici diğer faaliyetler (grup sevkiyatının organizasyonu, malların taşınması sırasında korunması için geçici olarak kasalara vb. yerleştirilmesi, yüklerin birleştirilmesi, gruplanması ve parçalara ayırılması, vb. dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "52.26.01",
        "tanim": "Uluslararası deniz yolu yük nakliyat acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.02",
        "tanim": "Kabotaj hattı deniz yolu yük nakliyat acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.03",
        "tanim": "Kara yolu yük nakliyat acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.04",
        "tanim": "Hava yolu yük nakliyat acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.05",
        "tanim": "Demir yolu yük nakliyat acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.06",
        "tanim": "Yük taşımacılığı kooperatiflerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.07",
        "tanim": "Yetkili gümrük müşavirliği veya gümrük müşavirliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.08",
        "tanim": "Gümrük komisyoncularının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.09",
        "tanim": "Taşıma belgelerinin ve irsaliyelerin düzenlenmesi ve tedarik edilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.26.99",
        "tanim": "Başka yerde sınıflandırılmamış taşımacılığa yönelik diğer destekleyici faaliyetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.31.01",
        "tanim": "Deniz yolu yük nakliyat komisyoncuları ve brokerlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.31.02",
        "tanim": "Kara yolu yük nakliyat komisyoncularının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.31.03",
        "tanim": "Hava yolu yük nakliyat komisyoncularının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.31.04",
        "tanim": "Demir yolu yük nakliyat komisyoncularının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "52.32.00",
        "tanim": "Yolcu taşımacılığına yönelik aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "53.10.01",
        "tanim": "Evrensel hizmet yükümlülüğü altında postacılık faaliyetleri (kargo ve kurye şirketlerinin faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "53.20.08",
        "tanim": "Gıda dağıtım faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "53.20.10",
        "tanim": "Paket ve koli gibi kargoların toplanması, sınıflandırılması, taşınması ve dağıtımı faaliyetleri (dökme yükler ve evrensel hizmet yükümlülüğü altında postacılık faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "53.30.00",
        "tanim": "Posta ve kurye faaliyetlerine yönelik aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.10.02",
        "tanim": "Otel vb. konaklama yerlerinin faaliyetleri (günlük temizlik ve yatak yapma hizmeti sağlanan yerlerin faaliyetleri) (kendi müşterilerine restoran hizmeti vermeyenler ile devre mülkler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.10.05",
        "tanim": "Otel vb. konaklama yerlerinin faaliyetleri (günlük temizlik ve yatak yapma hizmeti sağlanan yerlerin faaliyetleri) (kendi müşterilerine restoran hizmeti verenler ile devre mülkler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.20.01",
        "tanim": "Tatil ve diğer kısa süreli konaklama faaliyetleri (günlük temizlik ve yatak yapma hizmeti sağlanan oda veya süit konaklama faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.20.03",
        "tanim": "Kendine ait veya kiralanmış mobilyalı evlerde bir aydan daha kısa süreli olarak konaklama faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.20.04",
        "tanim": "Tatil amaçlı pansiyonların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.30.36",
        "tanim": "Kamp alanları ve karavan parkları",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.40.00",
        "tanim": "Konaklama için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.90.01",
        "tanim": "Öğrenci ve işçi yurtları, pansiyonlar ve odası kiralanan evlerde yapılan konaklama faaliyetleri (tatil amaçlı olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.90.02",
        "tanim": "Misafirhaneler, ordu evi, polis evi ve öğretmen evleri ile eğitim ve dinlenme tesisleri gibi konaklama yerlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "55.90.04",
        "tanim": "Evlerde ve mobilyalı veya mobilyasız dairelerde veya apartmanlarda bir yıldan daha kısa bir süre için konaklama hizmeti sağlanması faaliyetleri",
        "sinif": "az Tehlikeli"
    },
    {
        "kod": "55.90.90",
        "tanim": "Diğer konaklama yerlerinin faaliyetleri (başka bir birim tarafından işletildiğinde yataklı vagonlar vb. dahil; misafirhaneler, öğretmen evi vb. hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.01",
        "tanim": "Genel lokanta ve restoranların (içkili ve içkisiz) faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.02",
        "tanim": "Çorbacıların ve işkembecilerin faaliyetleri (imalatçıların faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.03",
        "tanim": "Döner, ciğer, kokoreç, köfte ve kebapçıların faaliyeti (garson servisi sunanlar ile self servis sunanlar dahil; imalatçıların ve al götür tesislerin faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.04",
        "tanim": "Oturacak yeri olmayan içli pide ve lahmacun fırınlarının faaliyetleri (al götür tesisi olarak hizmet verenler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.05",
        "tanim": "Pizzacıların faaliyeti (garson servisi sunanlar ile self servis sunanlar dahil; imalatçıların ve al götür tesislerin faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.06",
        "tanim": "Mantıcı ve gözlemecilerin faaliyeti (garson servisi sunanlar ile self servis sunanlar dahil; imalatçıların ve al götür tesislerinin faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.07",
        "tanim": "Börekçilerin faaliyetleri (imalatçıların faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.08",
        "tanim": "Pastanelerin ve tatlıcıların (sütlü, şerbetli vb.) faaliyeti (garson servisi sunanlar ile self servis sunanlar dahil; imalatçıların ve al götür tesislerin faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.09",
        "tanim": "Yiyecek ağırlıklı hizmet veren kafe ve kafeteryaların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.10",
        "tanim": "Dondurmacıların faaliyetleri (imalatçıların faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.11",
        "tanim": "Oturacak yeri olan fast-food (hamburger, sandviç, tost vb.) satış yerleri (büfeler dahil) tarafından sağlanan yemek hazırlama ve sunum faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.12",
        "tanim": "Oturacak yeri olmayan fast-food (hamburger, sandviç, tost vb.) satış yerleri (büfeler dahil), al götür tesisleri (içli pide ve lahmacun fırınları hariç) ve benzerleri tarafından sağlanan diğer yemek hazırlama ve sunum faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.13",
        "tanim": "Lahmacun ve pidecilik (içli pide (kıymalı, peynirli vb.)) faaliyeti (garson servisi sunanlar ile self servis sunanlar dahil; imalatçıların ve al götür tesislerin faaliyetleri ile seyyar olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.11.90",
        "tanim": "Diğer lokantaların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.12.00",
        "tanim": "Seyyar yemek hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.21.01",
        "tanim": "Özel günlerde dışarıya yemek hizmeti sunan işletmelerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.22.01",
        "tanim": "Kantinlerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.22.02",
        "tanim": "Hava yolu şirketleri ve diğer ulaştırma şirketleri için sözleşmeye bağlı düzenlemelere dayalı olarak yiyecek hazırlanması ve temini hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.22.90",
        "tanim": "Dışarıya yemek sunan diğer işletmelerin faaliyetleri (spor, fabrika, işyeri, üniversite vb. mensupları için tabldot servisi vb. dahil; özel günlerde hizmet verenler hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.30.02",
        "tanim": "Çay ocakları, kıraathaneler, kahvehaneler, kafeler (içecek ağırlıklı hizmet veren), meyve suyu salonları ve çay bahçelerinde içecek sunum faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.30.03",
        "tanim": "Lokallerde içecek sunum faaliyeti (alkollü-alkolsüz)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.30.04",
        "tanim": "Bar, meyhane ve birahanelerde içecek sunum faaliyetleri (alkollü-alkolsüz)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "56.30.05",
        "tanim": "Gazino, gece kulübü, taverna, diskotek, kokteyl salonları, vb. yerlerde içecek sunum faaliyetleri (alkollü-alkolsüz)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "56.30.08",
        "tanim": "Boza, şalgam ve sahlep sunum faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.30.90",
        "tanim": "Seyyar içecek satanlar ile diğer içecek sunum faaliyetleri (Trenlerde ve gemilerde işletilen barların faaliyetleri (alkollü-alkolsüz) dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "56.40.00",
        "tanim": "Yiyecek ve içecek hizmetleri faaliyetleri için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.11.01",
        "tanim": "Kitap yayımı (broşür, risale, ansiklopedi vb. dahil; çocuk kitaplarının, ders kitaplarının ve yardımcı ders kitaplarının yayımlanması hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.11.02",
        "tanim": "Bağımsız yazarlar tarafından kendi ürettikleri içeriklerin yayımlanması faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.11.03",
        "tanim": "Çocuk kitaplarının yayımlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.11.04",
        "tanim": "Ders kitaplarının ve yardımcı ders kitaplarının yayımlanması (sözlük, atlas, grafikler, haritalar vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.12.00",
        "tanim": "Gazetelerin yayımlanması (haftada en az dört kez yayımlananlar) (reklam gazeteleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.13.02",
        "tanim": "Eğitime destek amaçlı dergi ve süreli yayınların yayımlanması (haftada dörtten az yayımlananlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.13.03",
        "tanim": "Bilimsel, teknik, kültürel vb. dergi ve süreli yayınların yayımlanması (haftada dörtten az yayımlananlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.13.90",
        "tanim": "Diğer dergi ve süreli yayınların yayımlanması (haftada dörtten az yayımlananlar) (çizgi roman, magazin dergileri vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.19.04",
        "tanim": "Değerli kağıtların yayımlanması faaliyetleri (pul, tahvil, hisse senedi, bono veya senet vb. değerli kağıtlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.19.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer yayımcılık faaliyetleri (fotoğraf, kartpostal, tebrik kartları vb. ile katalog, poster, reklam materyali vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.21.01",
        "tanim": "Video oyunlarının yayımlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "58.29.01",
        "tanim": "Diğer yazılım programlarının yayımlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.11.04",
        "tanim": "Sinema ve reklam filmlerinin, videoların veya animasyonlu görsel-işitsel ve televizyon programları öğelerinin yapım faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "59.11.05",
        "tanim": "Video içerikleri video blog ,video podcast'lerin yapımı (fenomenler (influencerlar) ve vloggerlar tarafından yapılanlar)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "59.12.01",
        "tanim": "Sinema filmi, video ve televizyon programları çekim sonrası faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.13.02",
        "tanim": "Sinema filmi ve video dağıtım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.14.02",
        "tanim": "Sinema filmi gösterim faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.20.01",
        "tanim": "Müzik yayıncılığı faaliyetleri (basılı müzik notaları, elektronik formdaki müzikal besteler, müzikal ses diskleri, indirilebilir müzikler vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.20.02",
        "tanim": "Ses kayıt ve canlı kayıt faaliyetleri (seslerin, sözlerin ve müziğin ses kayıt stüdyosunun özel teknik ekipmanları kullanılarak kaydedilmesi ile konferans, seminer, konser vb. canlı etkinliklerde yapılan kayıt hizmetleri vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "59.20.03",
        "tanim": "Orijinal ses kayıtlarını kullanım hakkı için lisanslama faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "59.20.06",
        "tanim": "Radyo programı yapımcılık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "60.10.09",
        "tanim": "Radyo yayıncılığı ve ses dağıtım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "60.20.00",
        "tanim": "Televizyon programcılığı, yayıncılığı ve video dağıtım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "60.31.00",
        "tanim": "Haber ajanslarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "60.39.00",
        "tanim": "Diğer içerik dağıtım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.10.03",
        "tanim": "Kablosuz ağlar üzerinden internet erişiminin sağlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.10.04",
        "tanim": "Kablosuz telekomünikasyon faaliyetleri (kablosuz ağlar üzerinden internet erişiminin sağlanması ve uydu üzerinden yapılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.10.05",
        "tanim": "Uydu üzerinden telekomünikasyon faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "61.10.15",
        "tanim": "Kablolu telekomünikasyon faaliyetleri (kablolu ağlar üzerinden internet erişiminin sağlanması hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.10.17",
        "tanim": "Kablolu ağlar üzerinden internet erişiminin sağlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.10.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer telekomünikasyon faaliyetleri (uydudan izleme, iletişim telemetresi vb. uzmanlık gerektiren telekomünikasyon uygulamalarının sağlanması, çevrim içi internet erişimi sağlanması, VOIP sağlanması, vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "61.20.04",
        "tanim": "Telekomünikasyon ürünlerinin yeniden satışı ve telekomünikasyon için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.90.04",
        "tanim": "Telekomünikasyon uygulamalarına yönelik radar istasyonlarının işletilmesi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "61.90.05",
        "tanim": "İnternet kafelerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "61.90.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer telekomünikasyon faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "62.10.00",
        "tanim": "Bilgisayar programlama faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "62.20.00",
        "tanim": "Bilgisayar danışmanlığı ve bilgisayar birimleri (sistemleri) yönetimi faaliyetleri (siber güvenlik danışmanlığı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "62.90.01",
        "tanim": "Bilgisayarları felaketten kurtarma ve veri kurtarma faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "62.90.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer bilgi teknolojisi ve bilgisayar hizmet faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "63.10.00",
        "tanim": "Bilgi işlem altyapısı, veri işleme, barındırma ve ilgili faaliyetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "63.91.02",
        "tanim": "Web arama portalı faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "63.92.00",
        "tanim": "Diğer bilgi hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.11.06",
        "tanim": "Merkez bankası faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.19.01",
        "tanim": "Bankaların faaliyetleri (katılım bankaları, mevduat bankaları, kredi birlikleri vb. dahil, merkez bankası ve yatırım bankaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.19.02",
        "tanim": "Esnaf ve sanatkarlar kredi kefalet kooperatiflerinin kredi aracılık faaliyetleri ile kredi garanti fonunun faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.21.00",
        "tanim": "Holding şirketlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.22.00",
        "tanim": "Finansman tedarik şirketlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.31.00",
        "tanim": "Para piyasası ve para piyasası dışı yatırım fonlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.32.00",
        "tanim": "Servet yönetim şirketleri (trustlar), emlak ve acente hesaplarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.91.01",
        "tanim": "Finansal kiralama",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.92.01",
        "tanim": "Faktori̇ng ve tedarik zinciri̇ finansmanı faaliyetleri̇",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.92.04",
        "tanim": "Tarım kredi kooperatiflerinin kredi verme faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.92.08",
        "tanim": "Tüketici finansman şirketlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.92.90",
        "tanim": "Diğer kredi verme faaliyetleri (bankacılık sistemi dışında borç para verilmesi, uluslararası ticari finansman, mevduat kabul etmeyen uzmanlaşmış kuruluşlarca konut kredisi verilmesi, rehin karşılığında borç para verilmesi vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.99.03",
        "tanim": "Gayrimenkul yatırım ortaklığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.99.08",
        "tanim": "Yatırım bankacılığı faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.99.09",
        "tanim": "Varlık yönetim şirketlerinin faaliyetleri (mülkiyet devri yoluyla yapılanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.99.10",
        "tanim": "Menkul kıymet yatırım ortaklığı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "64.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer finansal hizmet faaliyetleri (swap, opsiyon ve diğer riskten korunma sözleşmelerinin yazılması, vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "65.11.02",
        "tanim": "Hayat sigortası",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "65.12.13",
        "tanim": "Hayat sigortası dışındaki sigortalar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "65.20.01",
        "tanim": "Reasürans",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "65.30.01",
        "tanim": "Emeklilik fonları",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.11.02",
        "tanim": "Finansal piyasaların yönetimi (emtia sözleşmeleri borsası, menkul kıymetler borsası, hisse senedi borsası vb. yönetimi dahil; kamu otoriteleri tarafından yapılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.12.01",
        "tanim": "Menkul kıymetler aracılık faaliyetleri (borsa aracılığı ve vadeli işlemler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.12.04",
        "tanim": "Döviz bürolarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.12.06",
        "tanim": "Kambiyo hizmetleri (döviz bürolarının faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.12.08",
        "tanim": "Emtia sözleşmeleri aracılık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.19.07",
        "tanim": "Finansal hizmetlere yardımcı diğer faaliyetler (Sigorta ve emeklilik fonları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.21.01",
        "tanim": "Risk ve hasar değerlemesi (sigorta eksperliği dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.22.01",
        "tanim": "Sigorta acentelerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.22.02",
        "tanim": "Sigorta brokerlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.29.01",
        "tanim": "Aktüerya faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.29.99",
        "tanim": "Başka yerde sınıflandırılmamış sigorta ve emeklilik fonuna yardımcı diğer faaliyetler (kurtarılan sigortalı eşyanın idaresi) (sigorta ve emeklilik finansmanına yönelik mali denetim faaliyetleri, merkez bankası tarafından yapılan hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.30.00",
        "tanim": "Fon yönetimi faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.11.00",
        "tanim": "Kendine ait gayrimenkulün alınıp satılması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.12.01",
        "tanim": "Bina projelerinin geliştirilmesi (satışa yönelik bina projeleri için mali, teknik ve fiziksel araçların bir araya getirilmesi suretiyle konut veya diğer amaçlı kullanıma yönelik bina projelerinin organize edilmesi) (yapı kooperatifleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.12.02",
        "tanim": "Konut yapı kooperatiflerinin faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "68.12.03",
        "tanim": "İşyeri yapı kooperatiflerinin faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "68.20.02",
        "tanim": "Kendine ait veya kiralanan gayrimenkulün kiralanması ve işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.31.01",
        "tanim": "Gayrimenkul faaliyetleri için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.32.01",
        "tanim": "Gayrimenkul değerleme (eskpertiz) , danışmanlık ve emanet aracılarının (escrow) faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.32.02",
        "tanim": "Bir ücret veya sözleşmeye dayalı olarak yapılan diğer gayrimenkul yönetimi faaliyetleri (apartman yöneticiliği hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.32.03",
        "tanim": "Bir ücret veya sözleşmeye dayalı olarak yapılan kira toplama faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "68.32.04",
        "tanim": "Bir ücret veya sözleşmeye dayalı olarak yapılan apartman yöneticiliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.01",
        "tanim": "Bilirkişi faaliyetleri (hukuki konularda)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.02",
        "tanim": "Hukuk müşavirliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.03",
        "tanim": "Hukuk danışmanlığı ve temsil faaliyetleri (avukatlık faaliyetleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.07",
        "tanim": "Noterlik faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.08",
        "tanim": "Sosyal güvenlik müşavirlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.09",
        "tanim": "Hukuki arabuluculuk ve uzlaştırma faaliyetleri (işgücü ve yönetim arasında, işletmeler arasında veya şahıslar arasında ortaya çıkan anlaşmazlığın çözümü için tahkim veya arabuluculuk hizmetleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.10",
        "tanim": "Yediemin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.10.90",
        "tanim": "Diğer hukuki hizmet faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.20.01",
        "tanim": "Mali müşavirlik hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.20.02",
        "tanim": "Muhasebe ve defter tutma faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.20.03",
        "tanim": "Vergi danışmanlığı ve vergi beyannamesinin hazırlanması faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.20.04",
        "tanim": "Yeminli mali müşavirlik faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "69.20.05",
        "tanim": "Mali denetim faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "70.10.01",
        "tanim": "İdare merkezi faaliyetleri (idare merkezi tarafından aynı şirket veya girişimin diğer birimlerine sağlanan yönetim hizmetleri ile bağlı iştiraklerini yöneten holdingler dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "70.20.01",
        "tanim": "İşletme ve diğer idari danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "70.20.02",
        "tanim": "İnsan kaynakları yönetim danışmanlığı faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.11.01",
        "tanim": "Mimarlık faaliyetleri ve mimari danışmanlık faaliyetleri (kültürel miras varlıklarının korunmasını ve restorasyonunu destekleyen mimari faaliyetler ile iç mimarlık faaliyetleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.11.02",
        "tanim": "Şehir ve bölge planlama faaliyetleri (nazım imar planı, vaziyet planı vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.11.04",
        "tanim": "Peyzaj mimarisi faaliyetleri ve peyzaj konusunda mimari danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.01",
        "tanim": "Yer yüzeyinin araştırılması ve harita yapımına yönelik mühendislik faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.03",
        "tanim": "Bina projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.04",
        "tanim": "Jeolojik, jeofizik ve ilgili araştırma ve danışmanlık hizmetlerine yönelik mühendislik faaliyetleri (petrol ve doğalgaz için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.05",
        "tanim": "Petrol ve doğalgaz çıkarım projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.06",
        "tanim": "Ulaştırma projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.07",
        "tanim": "Su, kanalizasyon ve drenaj projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.08",
        "tanim": "Sanayi ve imalat projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.09",
        "tanim": "Enerji projelerine yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.10",
        "tanim": "Mühendislik danışmanlık hizmetleri (bir projeyle bağlantılı olarak yapılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.14",
        "tanim": "Yapı denetim kuruluşları",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.12.90",
        "tanim": "Diğer projelere yönelik mühendislik ve danışmanlık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.20.05",
        "tanim": "Kara yolu taşıma araçlarının teknik muayene faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.07",
        "tanim": "Bileşim ve saflık konularında teknik test ve analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.08",
        "tanim": "Su, hava vb. kirliliği konularında teknik test ve analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.09",
        "tanim": "Fiziksel özellikler konusunda teknik test ve analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.10",
        "tanim": "Ürünlerin ruhsatlandırılması faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "71.20.11",
        "tanim": "Gıda konusunda teknik test ve analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.12",
        "tanim": "Entegre mekanik ve elektrik sistemleri konusunda teknik test ve analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.13",
        "tanim": "Polis laboratuvarlarının analiz faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "71.20.14",
        "tanim": "Adli tıp laboratuvarlarının faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "71.20.90",
        "tanim": "Diğer teknik test ve analiz faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "72.10.01",
        "tanim": "Doğal bilimler ve mühendislikle ilgili diğer araştırma ve deneysel geliştirme faaliyetleri (tarımsal araştırmalar dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "72.10.02",
        "tanim": "Biyoteknolojiyle ilgili araştırma ve deneysel geliştirme faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "72.20.01",
        "tanim": "Sosyal bilimlerle ve beşeri bilimlerle ilgili araştırma ve deneysel geliştirme faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "73.11.01",
        "tanim": "Reklam ajanslarının faaliyetleri (kullanılacak medyanın seçimi, reklamın tasarımı, sözlerin yazılması, reklam filmleri için senaryonun yazımı, satış noktalarında reklam ürünlerinin gösterimi ve sunumu vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "73.11.03",
        "tanim": "Reklam araç ve eşantiyonların dağıtımı ve teslimi faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "73.12.02",
        "tanim": "Çeşitli medya reklamları için alan ve zamanın bir ücret veya sözleşmeye dayalı olarak satışı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "73.20.03",
        "tanim": "Piyasa ve kamuoyu araştırma faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "73.30.00",
        "tanim": "Halkla ilişkiler ve iletişim faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.11.00",
        "tanim": "Endüstriyel ürün ve moda tasarımı faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.12.00",
        "tanim": "Grafik tasarım ve görsel iletişim faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.13.00",
        "tanim": "İç tasarım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.14.00",
        "tanim": "Diğer uzmanlaşmış tasarım faaliyetleri (endüstriyel ürün ve moda tasarım, iç tasarım ve grafik tasarım faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.22",
        "tanim": "Tüketicilere yönelik fotoğrafçılık faaliyetleri (pasaport, okul, düğün vb. için vesikalık ve portre fotoğrafçılığı vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.25",
        "tanim": "Hava ve su altı fotoğrafçılığı faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "74.20.26",
        "tanim": "Reklamcılık ile ilgili fotoğrafçılık faaliyetleri (reklam görselleri, broşür, gazete ilanı, katalog vb. için ticari ürünlerin, moda kıyafetlerinin, makinelerin, binaların, kişilerin vb.nin fotoğraflarının çekilmesi)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.27",
        "tanim": "Etkinlik fotoğrafçılığı ve etkinliklerin videoya çekilmesi faaliyetleri (düğün, mezuniyet, konferans, resepsiyon, moda gösterileri, spor ve diğer ilgi çekici olayların fotoğraflanması veya videoya çekilmesi)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.28",
        "tanim": "Bağımsız foto muhabirlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.29",
        "tanim": "Fotoğraf işleme faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.20.90",
        "tanim": "Diğer fotoğrafçılık faaliyetleri (fotomikrografi, mikrofilm hizmetleri, fotoğrafların restorasyonu ve rötuşlama vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.30.12",
        "tanim": "Tercüme ve sözlü tercüme faaliyetleri (işaret dili dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.91.00",
        "tanim": "Patent aracılığı ve pazarlama hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.99.01",
        "tanim": "Sanatçı, sporcu, şovmen, manken ve diğerleri için ajansların ve menajerlerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.99.02",
        "tanim": "Gemi klas müesseseleri, deniz ekspertiz ve deniz sürveyör faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.99.03",
        "tanim": "İşyeri komisyonculuğu faaliyetleri (küçük ve orta ölçekli işletmelerin alım ve satımının düzenlenmesi vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.99.04",
        "tanim": "Ekspertiz faaliyetleri (antika eşyalar, mücevherler vb. için ekspertiz hizmetleri) (deniz, gayrimenkul ve sigorta için olan ekspertiz faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "74.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer mesleki, bilimsel ve teknik faaliyetler (güvenlik danışmanlığı hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "75.00.02",
        "tanim": "Hayvan hastanelerinin faaliyetleri (evcil hayvanlar için ambulans faaliyetleri dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "75.00.04",
        "tanim": "Veterinerlik hizmetleri (hayvan hastanelerinde verilen hizmetler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "77.11.01",
        "tanim": "Motorlu hafif kara taşıtlarının ve arabaların sürücüsüz olarak kiralanması ve operasyonel leasingi (motosiklet ve motokaravan için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.11.02",
        "tanim": "Motosiklet ve motokaravanların sürücüsüz olarak kiralanması veya operasyonel leasingi (ağırlığı 3.5 tondan daha az olanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.12.01",
        "tanim": "Motorlu ağır kara taşıtlarının sürücüsüz olarak kiralanması ve operasyonel leasingi (ağırlığı 3.5 tondan daha fazla olanlar) (motokaravan için olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.12.02",
        "tanim": "Motokaravanların sürücüsüz olarak kiralanması ve operasyonel leasingi (ağırlığı 3.5 tondan daha fazla olanlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.21.02",
        "tanim": "Bisikletlerin kiralanması ve leasingi (elektrikli bisikletler dahil) (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.21.04",
        "tanim": "Eğlence ve spor amaçlı sandal, tekne, kano, yelkenli vb.nin mürettebatsız olarak kiralanması ve leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.21.90",
        "tanim": "Diğer eğlence ve spor eşyalarının kiralanması ve leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.22.01",
        "tanim": "Video kasetlerinin, plakların ve disklerin kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.22.02",
        "tanim": "Gelinlik, kostüm, tekstil, giyim eşyası, ayakkabı ve mücevherlerin kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.22.03",
        "tanim": "Müzik aletlerinin kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.22.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer kişisel ve ev eşyalarının kiralanması ve operasyonel leasingi (müzik aleti, giyim eşyası, mücevher vb. ile video kasetler, büro mobilyaları, eğlence ve spor ekipmanları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.31.01",
        "tanim": "Tarımsal makine ve ekipmanların operatörsüz olarak kiralanması ve operasyonel leasingi (çim biçme makineleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.32.01",
        "tanim": "Bina ve bina dışı inşaatlarda kullanılan makine ve ekipmanların operatörsüz olarak kiralanması ve operasyonel leasingi (kurma/sökme hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.33.01",
        "tanim": "Büro makine ve ekipmanlarının operatörsüz olarak kiralanması ve leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.33.02",
        "tanim": "Büro mobilyalarının kiralanması ve leasingi (büro sandalyesi ve masasının kiralanması dahil) (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.33.03",
        "tanim": "Bilgisayar ve çevre birimlerinin operatörsüz olarak kiralanması ve leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.34.01",
        "tanim": "Su yolu taşımacılığı ekipmanlarının operatörsüz olarak kiralanması ve operasyonel leasingi (yolcu ve yük taşımacılığı için ticari tekne ve gemiler dahil, gezinti tekneleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.35.01",
        "tanim": "Hava taşımacılığı araçlarının operatörsüz olarak kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.01",
        "tanim": "Demir yolu ulaşım ekipmanlarının operatörsüz olarak kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.02",
        "tanim": "Konteynerlerin kiralanması veya leasingi (konaklama ve büro amaçlı olanlar, birden çok taşıma türlerine uygun olanlar ve diğerleri) (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.03",
        "tanim": "Motosiklet, karavan ve kamp gereçlerinin operatörsüz olarak kiralanması veya leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.04",
        "tanim": "Maden ve petrol sahasında kullanılan ekipmanların operatörsüz olarak kiralanması veya leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.05",
        "tanim": "Motorlar ve türbinlerin operatörsüz olarak kiralanması veya leasingi (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.06",
        "tanim": "Mesleki ve bilimsel amaçlı ölçüm ve kontrol ekipmanlarının operatörsüz olarak kiralanması veya leasingi (tıbbi cihaz ve ekipmanların kiralanması dahil) (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.07",
        "tanim": "Ticari radyo, televizyon ve telekomünikasyon ekipmanları ile sinema filmi yapım ekipmanlarının operatörsüz olarak kiralanması veya operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.39.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer makine ve ekipmanların sürücüsüz kiralanması ve leasingi ile maddi malların kiralanması ve operasyonel leasingi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.40.01",
        "tanim": "Fikri mülkiyet haklarının ve benzer ürünlerin leasingi (patentli varlıklar, markalar, imtiyaz sözleşmeleri vb. dahil; telif hakkı alınmış olan çalışmalar hariç) (finansal leasing hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.51.00",
        "tanim": "Otomobillerin, motorlu karavanların ve römorkların kiralanması ve leasingine ilişkin aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "77.52.00",
        "tanim": "Diğer maddi varlıkların ve finans dışı maddi olmayan varlıkların kiralanması ve leasingi için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "78.10.01",
        "tanim": "İş bulma acentelerinin faaliyetleri (işe girecek kişilerin seçimi ve yerleştirilmesi faaliyetleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "78.10.04",
        "tanim": "Oyuncu seçme ajansları ve bürolarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "78.20.02",
        "tanim": "Geçici iş bulma acenteleri ile diğer insan kaynaklarının sağlanması faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "79.11.01",
        "tanim": "Seyahat acentesi faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "79.12.01",
        "tanim": "Tur operatörü faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "79.90.01",
        "tanim": "Turist rehberliği ve ziyaretçiler için danışmanlık faaliyetleri (gezilerle ilgili bilgi sağlanması)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "79.90.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer rezervasyon hizmetleri ve ilgili faaliyetler (turizm tanıtım faaliyetleri, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "80.01.01",
        "tanim": "Özel güvenlik faaliyetleri (kamu güvenliği hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "80.01.02",
        "tanim": "Soruşturma faaliyetleri (özel dedektiflik faaliyetleri, imza ve el yazısı tespit faaliyetleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "80.09.01",
        "tanim": "Çilingirlik hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "80.09.99",
        "tanim": "Başka yerde sınıflandırılmamış güvenlik faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "81.10.01",
        "tanim": "Tesis bünyesindeki kombine destek hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "81.21.01",
        "tanim": "Binaların genel temizliği (uzmanlaşmış temizlik faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "81.22.03",
        "tanim": "Nesne veya binaların (ameliyathaneler vb.) sterilizasyonu faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "81.22.04",
        "tanim": "Yapıların dış cepheleri için buharlı temizleme, kum püskürtme vb. uzmanlaşmış inşaat faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "81.22.05",
        "tanim": "Yeni binaların inşaat sonrası temizliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "81.22.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer bina ve endüstriyel temizlik faaliyetleri (sterilizasyon faaliyetleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "81.23.01",
        "tanim": "Böceklerin, kemirgenlerin ve diğer zararlıların imhası ve haşere kontrol faaliyetleri (tarımsal zararlılarla mücadele hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "81.23.02",
        "tanim": "Park ve caddelerin süpürülerek yıkanması, temizlenmesi faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "81.23.03",
        "tanim": "Yol ve pistlerdeki kar ve buzun kaldırılması (kum, tuz dökülmesi dahil)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "81.23.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer temizlik faaliyetleri (oto yıkama hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "81.30.06",
        "tanim": "Çevre düzenlemesi ve bakımı faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.10.01",
        "tanim": "Büro yönetimi ve destek faaliyetleri (sanal ofis, hazır ofis ve paylaşımlı ofis hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.10.02",
        "tanim": "Sanal ofis, hazır ofis ve paylaşımlı ofis yönetimi ve destek faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.20.01",
        "tanim": "Çağrı merkezlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.30.02",
        "tanim": "Kongre ve ticari gösteri organizasyonu",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.40.01",
        "tanim": "Spor, müzik, tiyatro ve diğer eğlence etkinlikleri için yer ayırma (rezervasyon) ve bilet satılması faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.40.99",
        "tanim": "Başka yerde sınıflandırılmamış işletme destek hizmetleri için aracılık hizmeti faaliyetleri (bilet rezervasyonu hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.91.00",
        "tanim": "Tahsilat ve kredi kayıt bürolarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.92.01",
        "tanim": "Tehlikesiz ürünleri paketleme faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "82.92.05",
        "tanim": "Tehlikeli ürünleri paketleme faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "82.99.02",
        "tanim": "Elektrik, gaz, su ve ısınma sayaçlarını okuma ve faturalama faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.99.04",
        "tanim": "Trafik müşavirliği",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.99.08",
        "tanim": "İş takipçiliği faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "82.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer işletme destek hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.41",
        "tanim": "Belediyelerin kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.42",
        "tanim": "Ekonomik ve sosyal planlama ile istatistik ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.43",
        "tanim": "Finansal, mali ve denetim ile ilgili kamu yönetimi hizmetleri (defterdarlık, mal müdürlükleri, vergi daireleri, Sayıştay, kamu borç ve fonlarının yönetimi dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.44",
        "tanim": "Genel personel işleri ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.45",
        "tanim": "Gümrüklerle ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.46",
        "tanim": "Muhtarların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.47",
        "tanim": "Valiliklerin ve kaymakamlıkların kamu yönetimi hizmetleri (il ve ilçe özel idarelerinin faaliyetleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.48",
        "tanim": "Yasama ve yürütme hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.11.90",
        "tanim": "Kamu için diğer destekleyici kamu yönetimi hizmetleri (merkezi kamu ihale ve tedarik hizmetleri ile haritacılık vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.12.11",
        "tanim": "Eğitime ilişkin kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.12.12",
        "tanim": "İskan ve toplum refahına ilişkin kamu yönetimi hizmetleri (su temini ve çevre koruma programları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.12.13",
        "tanim": "Sağlığa ve sosyal hizmetlere ilişkin kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.12.14",
        "tanim": "Spor, dinlence, kültür ve dine ilişkin kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.11",
        "tanim": "Çok amaçlı geliştirme projeleri ile ilgili kamu yönetimi hizmetleri (bölgesel kalkınma projeleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.12",
        "tanim": "Genel ekonomik, ticari ve işgücü ile ilgili kamu yönetimi hizmetleri (genel ekonomi politikalarının oluşturulması, teşvik faaliyetleri, patent işleri, genel istihdam politikaları, metroloji işleri, istihdam vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.13",
        "tanim": "Madencilik, doğal kaynaklar, imalat ve inşaat ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.14",
        "tanim": "Tarım, ormancılık, balıkçılık ve avcılıkla ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.15",
        "tanim": "Ticaret, otelcilik ve lokantacılık ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.16",
        "tanim": "Turizm ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.17",
        "tanim": "Ulaştırma ve iletişim ile ilgili kamu yönetimi hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.13.18",
        "tanim": "Yakıt ve enerji ile ilgili kamu yönetimi hizmetleri (enerji bakanlığı, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.21.05",
        "tanim": "Dış işleri ile ilgili kamu yönetimi hizmetleri (yurt dışı diplomatik hizmetler ve konsolosluk hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.21.06",
        "tanim": "Yurt dışı diplomatik hizmetler ve konsolosluk hizmetleri (yabancı konsolosluklar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.22.05",
        "tanim": "Askeri savunma hizmetleri (silahlı kuvvetler ve savunma ile ilgili idari hizmetler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.22.06",
        "tanim": "Sivil savunma hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.23.04",
        "tanim": "Adli sistemin yönetilmesi, cumhuriyet savcılıklarının ve icra müdürlüklerinin faaliyetleri (ceza infaz kurumlarının ve mahkemelerin faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.23.05",
        "tanim": "Ceza infaz ve tutuk evlerinin faaliyetleri (rehabilitasyon faaliyetleri dahil, eğitim faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "84.23.06",
        "tanim": "Mahkemelerin faaliyetleri (yüksek yargı organları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.24.01",
        "tanim": "Kamu düzeni ve güvenliği ile ilgili faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "84.25.01",
        "tanim": "İtfaiye hizmetleri (hava taşıtlarıyla yapılanlar ile orman yangınlarıyla mücadele ve koruma faaliyetleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "84.25.02",
        "tanim": "Hava taşıtları yoluyla yapılan itfaiye hizmetleri (orman yangınlarıyla mücadele ve koruma faaliyetleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "84.25.03",
        "tanim": "Cankurtaranlar gibi plaj gözetmenlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "84.30.01",
        "tanim": "Zorunlu sosyal güvenlik faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.10.01",
        "tanim": "Kamu kurumları tarafından verilen okul öncesi eğitim faaliyeti (okula yönelik eğitim verilmeyen gündüz bakım (kreş) faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.10.02",
        "tanim": "Özel öğretim kurumları tarafından verilen okul öncesi eğitim faaliyeti (okula yönelik eğitim verilmeyen gündüz bakım (kreş) faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.20.06",
        "tanim": "Kamu kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik ilköğretim faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.20.07",
        "tanim": "Kamu kurumları tarafından verilen ilköğretim faaliyeti (yetişkinlere yönelik okuma yazma programlarının verilmesi dahil, engelliler için verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.20.08",
        "tanim": "Özel öğretim kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik ilköğretim faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.20.09",
        "tanim": "Özel öğretim kurumları tarafından verilen ilköğretim faaliyeti (yetişkinlere yönelik okuma yazma programlarının verilmesi dahil, engelliler için verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.31.12",
        "tanim": "Kamu kurumları tarafından verilen genel ortaöğretim (ortaokul/lise) faaliyeti (engellilere yönelik verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.31.13",
        "tanim": "Kamu kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik genel ortaöğretim (ortaokul/lise) faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.31.14",
        "tanim": "Özel öğretim kurumları tarafından verilen genel ortaöğretim (ortaokul/lise) faaliyeti (engellilere yönelik verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.31.16",
        "tanim": "Özel öğretim kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik genel ortaöğretim (ortaokul/lise) faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.32.10",
        "tanim": "Kamu kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik teknik ve mesleki ortaöğretim (ortaokul/lise) faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.32.11",
        "tanim": "Kamu kurumları tarafından verilen teknik ve mesleki ortaöğretim (ortaokul/lise) faaliyeti (engellilere yönelik verilen eğitim hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "85.32.12",
        "tanim": "Özel öğretim kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik teknik ve mesleki ortaöğretim (ortaokul/lise) faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.32.13",
        "tanim": "Özel öğretim kurumları tarafından verilen teknik ve mesleki ortaöğretim (ortaokul/lise) faaliyeti (engellilere yönelik verilen eğitim hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "85.32.14",
        "tanim": "Çıraklık eğitimi",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "85.32.15",
        "tanim": "Ticari sertifika veren havacılık, yelkencilik, gemicilik vb. kursların faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "85.32.16",
        "tanim": "Ticari taşıt kullanma belgesi veren sürücü kurslarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.32.90",
        "tanim": "Mesleki amaçlı eğitim veren diğer kursların faaliyetleri (özel öğretim kurumları tarafından verilen fiziksel veya zihinsel engellilere yönelik teknik ve mesleki ortaöğretim (ortaokul/lise) faaliyetleri ile çıraklık eğitimi faaliyetleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.33.00",
        "tanim": "Ortaöğretim sonrası yükseköğretim derecesinde olmayan eğitim",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.40.01",
        "tanim": "Özel öğretim kurumları tarafından verilen yükseköğretim faaliyeti (yükseköğretim düzeyinde eğitim sağlayan konservatuvarlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.40.02",
        "tanim": "Kamu kurumları tarafından verilen yükseköğretim faaliyeti (yükseköğretim düzeyinde eğitim sağlayan konservatuvarlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.51.03",
        "tanim": "Spor ve eğlence (rekreasyon) eğitimi (fitness merkezleri tarafından sağlanan eğitimler ile temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.52.05",
        "tanim": "Kültürel eğitim (bale, dans, müzik, fotoğraf, halk oyunu, resim, drama, vb. eğitimi dahil, temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.53.01",
        "tanim": "Sürücü kursu faaliyetleri (ticari sertifika veren sürücülük, havacılık, yelkencilik, gemicilik eğitimi hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.01",
        "tanim": "Halk eğitim merkezlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.03",
        "tanim": "Bilgisayar, yazılım, veritabanı, vb. eğitimi veren kursların faaliyetleri (temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.05",
        "tanim": "Orta öğretime, yüksek öğretime, kamu personeli vb. sınavlara yönelik kurs ve etüt merkezlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.06",
        "tanim": "Biçki, dikiş, nakış, halıcılık, güzellik, berberlik, kuaförlük kurslarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.08",
        "tanim": "Kuran kursları ve diğer dini eğitim veren yerlerin faaliyetleri (temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.09",
        "tanim": "Dil ve konuşma becerileri eğitimi veren kursların faaliyetleri (temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.10",
        "tanim": "Mankenlik, modelistlik, stilistlik kurslarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.12",
        "tanim": "Muhasebe eğitimi kurslarının faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.15",
        "tanim": "Akademik özel ders verme faaliyeti (temel, orta ve yükseköğretim düzeyinde bire bir eğitim)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.16",
        "tanim": "Çocuk kulüplerinin faaliyetleri (6 yaş ve üzeri çocuklar için)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.59.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer eğitim kursu faaliyetleri (cankurtaranlık, hayatta kalma, topluluğa konuşma, hızlı okuma vb. eğitimi dahil; yetişkin okuma yazma programları ile temel, orta ve yükseköğretim düzeyinde verilen eğitim hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.61.00",
        "tanim": "Kurslara ve eğitmenlere yönelik aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "85.69.00",
        "tanim": "Eğitimi destekleyici faaliyetler (eğitim rehberlik, danışmanlık (yurt dışı eğitim danışmanlığı dahil), test değerlendirme, öğrenci değişim programlarının organizasyonu, yaprak test ve soru bankası hazırlama gibi eğitimi destekleyen öğrenim dışı faaliyetler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "86.10.04",
        "tanim": "Kamu kurumları tarafından verilen insan sağlığına yönelik özel ihtisas gerektiren yataklı hastane hizmetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.10.05",
        "tanim": "Kamu kurumları tarafından verilen insan sağlığına yönelik yataklı hastane hizmetleri (devlet üniversite hastaneleri dahil; özel ihtisas hastaneleri ile dişçilik, ambulansla taşıma, tıbbi laboratuvar test faaliyetleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.10.12",
        "tanim": "Özel sağlık kurumları tarafından verilen insan sağlığına yönelik özel ihtisas gerektiren yataklı hastane hizmetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.10.13",
        "tanim": "Özel sağlık kurumları tarafından verilen insan sağlığına yönelik yataklı hastane hizmetleri (özel veya vakıf üniversite hastaneleri dahil; dişçilik, ambulansla taşıma, tıbbi laboratuvar testleri faaliyetleri hariç)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.21.02",
        "tanim": "Aile ve toplum sağlığı merkezleri tarafından sağlanan yatılı olmayan genel hekimlik uygulama faaliyetleri (yatılı hastane faaliyetleri ile ebeler, hemşireler ve fizyoterapistlerce gerçekleştirilen paramedikal faaliyetler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.21.03",
        "tanim": "Özel sağlık kurumları tarafından polikliniklerde sağlanan yatılı olmayan genel hekimlik uygulama faaliyetleri (özel muayene ve yatılı hastane faaliyetleri ile ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.21.04",
        "tanim": "Özel muayenehanelerde sağlanan yatılı olmayan genel hekimlik uygulama faaliyetleri (hastane ve poliklinik faaliyetleri ile ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.21.05",
        "tanim": "Ortak sağlık ve güvenlik birimlerinin (OSGB) faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.21.90",
        "tanim": "Diğer yatılı olmayan genel hekimlik uygulama faaliyetleri (ev, iş yeri, okul vb. yerlerde sağlananlar dahil; ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri ile OSGB'lerin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.22.02",
        "tanim": "Özel muayenehanelerde sağlanan uzman hekimlik ile ilgili yatılı olmayan uygulama faaliyetleri (hastane ve poliklinik faaliyetleri ile ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.22.05",
        "tanim": "Özel sağlık kurumları tarafından poliklinik ve yatılı olmayan tıp merkezlerinde sağlanan uzman hekimlik ile ilgili uygulama faaliyetleri (yatılı hastane faaliyetleri ile ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.22.06",
        "tanim": "Aile ve toplum sağlığı merkezleri tarafından sağlanan yatılı olmayan uzman hekimlik uygulama faaliyetleri (yatılı hastane faaliyetleri ile ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.22.07",
        "tanim": "Diyaliz merkezleri (hastane dışı)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.22.90",
        "tanim": "Diğer yatılı olmayan uzman hekimlik uygulama faaliyetleri (ev, iş yeri, okul vb. yerlerde sağlananlar dahil; ebe, hemşire ve fizyoterapistlerin paramedikal faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.23.01",
        "tanim": "Özel sağlık kurumları tarafından sağlanan diş hekimliği uygulama faaliyetleri (yatılı hastane faaliyetleri ile diş hijyenistleri gibi paramedikal diş sağlığı personelinin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.23.03",
        "tanim": "Özel muayenehanelerde sağlanan diş hekimliği uygulama faaliyetleri (yatılı hastane faaliyetleri ile diş hijyenistleri gibi paramedikal diş sağlığı personelinin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.23.05",
        "tanim": "Kamu kurumları tarafından sağlanan diş hekimliği uygulama faaliyetleri (yatılı hastane faaliyetleri ile diş hijyenistleri gibi paramedikal diş sağlığı personelinin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.91.01",
        "tanim": "Tıbbi laboratuvar faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.91.02",
        "tanim": "Tanı amaçlı görüntüleme faaliyetleri (analiz veya yorumlama olmaksızın)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.92.00",
        "tanim": "Ambulansla hasta taşıma",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.93.00",
        "tanim": "Psikolog ve psikoterapistlerin faaliyetleri (tıp doktorları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "86.94.01",
        "tanim": "Ebe, sağlık memuru, sünnetçi, iğneci, pansumancı vb.leri tarafından verilen hizmetler (tıp doktorları dışında yetkili kişilerce sağlanan gebelik süresince ve doğum sonrası izleme ve tıbbi işlemleri kapsayan aile planlaması hizmetleri dahil) (hastane dışı)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.94.02",
        "tanim": "Hemşirelik hizmetleri (evdeki hastalar için bakım, koruma, anne bakımı, çocuk sağlığı ve hemşirelik bakımı alanındaki benzeri hizmetler dahil; hemşireli yatılı bakım tesislerinin faaliyetleri ile tıp doktorlarının hizmetleri hariç) (hastane dışı)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.95.00",
        "tanim": "Fizyoterapi hizmetleri (tıp doktorları dışında yetkili kişilerce sağlanan fizyoterapi, ergoterapi vb. alanlardaki hizmetler) (hastane dışı)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.96.00",
        "tanim": "Geleneksel, tamamlayıcı ve alternatif tıp faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "86.97.00",
        "tanim": "Tıp, dişçilik ve diğer insan sağlığı hizmetlerine yönelik aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "86.99.01",
        "tanim": "Kan merkezleri ile kan, sperm ve organ bankalarının faaliyetleri (hastane dışı)",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "86.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer insan sağlığı faaliyetleri (kan merkezleri ile kan, sperm ve organ bankalarının faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "87.10.01",
        "tanim": "Hemşireli yatılı bakım faaliyetleri (hemşireli bakım evlerinin, hemşireli huzur evlerinin faaliyetleri dahil; sadece asgari düzeyde hemşire bakımı sağlanan yaşlı evlerinin, yetimhanelerin, yurtların faaliyetleri ile evlerde sağlanan hizmetler hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "87.20.02",
        "tanim": "Zihinsel rahatsızlığı veya madde kullanımı teşhisi olan kişilere yönelik yatılı bakım faaliyetleri (hastanelerin faaliyetleri ile yatılı sosyal hizmet faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "87.30.02",
        "tanim": "Yaşlılara ve bedensel engellilere yönelik yatılı bakım faaliyetleri (destekli yaşam tesisleri, hemşire bakımı olmayan huzurevleri ve asgari düzeyde hemşire bakımı olan evlerin faaliyetleri dahil, yaşlılar için hemşire bakımlı evlerin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "87.91.00",
        "tanim": "Yatılı bakım faaliyetleri için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "87.99.00",
        "tanim": "Başka yerde sınıflandırılmamış diğer yatılı bakım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "88.10.02",
        "tanim": "Yaşlılar ve bedensel engelliler için barınacak yer sağlanmaksızın verilen sosyal hizmetler (yatılı bakım faaliyetleri ile engelli çocuklara yönelik gündüz bakım (kreş) faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "88.91.01",
        "tanim": "Çocuk gündüz bakım (kreş) faaliyetleri (engelli çocuklar için olanlar ile bebek bakıcılığı dahil; okul öncesi eğitim faaliyetleri ile çocuk kulüpleri (6 yaş ve üzeri çocuklar için) hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "88.99.07",
        "tanim": "Barınacak yer sağlanmaksızın mesleki rehabilitasyon hizmetleri (bedensel engelliler için rehabilitasyon hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "88.99.09",
        "tanim": "Barınacak yer sağlanmaksızın çocuk ve gençlere yönelik rehabilitasyon hizmetleri (zihinsel engelliler için olanlar dahil, bedensel engellilere yönelik olanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "88.99.99",
        "tanim": "Başka yerde sınıflandırılmamış barınacak yer sağlanmaksızın verilen diğer sosyal yardım hizmetleri (aile danışmanlığı ve rehberliği, borç danışmanlığı, sosyal hizmet için para toplama, evlat edindirme, evsiz, afetzede ve mültecilere geçici barınak sağlama, yardım için uygun kişi belirleme vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.11.00",
        "tanim": "Edebiyat eseri oluşturma ve müzikal kompozisyon faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.12.00",
        "tanim": "Görsel sanatlar yaratıcılık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.13.00",
        "tanim": "Diğer sanatsal yaratıcılık faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.20.01",
        "tanim": "Bağımsız aktör, aktrist ve dublörlerin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "90.20.02",
        "tanim": "Bağımsız müzisyen, ses sanatçısı, konuşmacı, sunucu vb.lerin faaliyetleri (müzik grupları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.20.03",
        "tanim": "Canlı tiyatro, opera, bale, müzikal, konser vb. yapımların sahneye konulması faaliyetleri (illüzyon gösterileri, kukla gösterileri ve kumpanyalar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.20.04",
        "tanim": "Sirklerin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "90.20.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer gösteri sanatları",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.31.00",
        "tanim": "Sanat tesislerinin ve alanlarının (mekanlarının) işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "90.39.01",
        "tanim": "Sanat ve gösteri sanatlarına yönelik yönetmenlerin ve yapımcıların faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "90.39.90",
        "tanim": "Sanat ve gösteri sanatlarına yönelik diğer destek faaliyetleri (sanat ve gösteri sanatlarına yönelik yönetmenlerin ve yapımcıların faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "91.11.00",
        "tanim": "Kütüphane faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "91.12.00",
        "tanim": "Arşiv faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "91.21.00",
        "tanim": "Müze ve koleksiyonculuk faaliyetleri (müzelerde ve özel koleksiyonlarda yer alan eserlerin konservasyonu faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "91.22.00",
        "tanim": "Tarihi alan ve anıt faaliyetleri (tarihi alanların ve yapıların işletilmesi, korunması dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "91.30.00",
        "tanim": "Kültürel mirasın konservasyonu, restorasyonu ve diğer destek faaliyetleri (müzeler ve özel koleksiyonlar dahil",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "91.41.00",
        "tanim": "Botanik ve hayvanat bahçesi faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "91.42.00",
        "tanim": "Tabiatı koruma faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "92.00.01",
        "tanim": "Müşterek bahis faaliyetleri (at yarışı, köpek yarışı, futbol ve diğer spor yarışmaları konusunda bahis hizmetleri)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "92.00.02",
        "tanim": "Loto vb. sayısal şans oyunlarına ilişkin faaliyetler (piyango biletlerinin satışı dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "92.00.03",
        "tanim": "Kumarhanelerin faaliyetleri (çevrim içi olanlar dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.11.01",
        "tanim": "Spor tesislerinin işletilmesi (hipodromların işletilmesi hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.11.02",
        "tanim": "Hipodromların işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.12.01",
        "tanim": "Atıcılık ve okçuluk kulüplerinin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "93.12.03",
        "tanim": "Futbol, voleybol, basketbol ve hentbol kulüplerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.12.90",
        "tanim": "Diğer spor kulüplerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.13.01",
        "tanim": "Fitness merkezlerinin faaliyetleri (yoga, pilates, tai chi stüdyolarının faaliyetleri vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.19.01",
        "tanim": "Kendi hesabına bireysel çalışan atlet, hakem, zaman tutucu, antrenör, spor eğitmeni vb. sporcuların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.19.02",
        "tanim": "Spor etkinlikleri yapımcılarının faaliyetleri ile bu etkinliklerin kendi tesisleri olmayan kuruluşlar tarafından düzenlenmesi faaliyetleri (spor kulüpleri tarafından yapılanlar hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.19.03",
        "tanim": "Spor ve eğlence amaçlı sporlara ilişkin destek faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "93.19.04",
        "tanim": "Spor ligleri ve düzenleyici birimlerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.19.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer spor amaçlı faaliyetler",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "93.21.01",
        "tanim": "Eğlence parkları ve tema parklarının faaliyetleri (bağımsız sağlayıcılar tarafından mekanik at ve arabaların, oyunların ve gösterilerin işletilmesi hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "93.29.01",
        "tanim": "Plaj alanlarının işletilmesi (bu tesislerin bütünleyici bir parçası olan soyunma odası, dolap, sandalye, kano, deniz motosikleti vb. kiralanması dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.02",
        "tanim": "Düğün, balo ve kokteyl salonlarının işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.03",
        "tanim": "Oyun makinelerinin işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.07",
        "tanim": "Marina vb. dinlence amaçlı ulaştırma tesislerinin işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.08",
        "tanim": "Bilardo salonlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.10",
        "tanim": "Dinlence (rekreasyon) parklarının faaliyetleri (konaklamalı olanlar ile eğlence parkları ve tema parklarının işletilmesi hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.11",
        "tanim": "Elektronik spor (e-spor) oyun merkezlerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.12",
        "tanim": "Sanatsal olmayan etkinliklerin organizasyonuyla ilgili görsel-işitsel ekipmanların ve özel efektlerin teknik planlanması, temini, kurulumu ve işletilmesi",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "93.29.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer eğlence ve dinlence (rekreasyon) faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "94.11.03",
        "tanim": "Esnaf ve sanatkar odaları, birlikleri ve üst kuruluşlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.11.04",
        "tanim": "Çiftçi ve ziraat odaları, birlikleri ve üst kuruluşlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.11.05",
        "tanim": "Ticaret ve sanayi odaları, deniz ticaret odaları ve üst kuruluşlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.11.06",
        "tanim": "İşveren sendikalarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.11.90",
        "tanim": "Diğer iş ve işveren odaları, birlikleri ve üst kuruluşlarının faaliyetleri (işçi, işveren ve memur sendikaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.12.01",
        "tanim": "Baroların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.12.05",
        "tanim": "Mesleki birlikler, dernekler ve odaların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.12.90",
        "tanim": "Diğer profesyonel meslek kuruluşlarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.20.01",
        "tanim": "Sendikaların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.91.02",
        "tanim": "Dini kuruluşların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.92.02",
        "tanim": "Siyasi kuruluşların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.01",
        "tanim": "Üyelik gerektiren, çevre ve doğal hayatın korunmasına yönelik dernek ve birliklerin faaliyetleri (vahşi yaşamı koruma kuruluşları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.02",
        "tanim": "Üyelik gerektiren gençlik dernek ve birliklerinin faaliyetleri (öğrenci birlikleri ile izci birlik ve kulüpleri dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.03",
        "tanim": "Üyelik gerektiren yurtsever dernek ve birliklerinin faaliyetleri (savaş gazisi birlikleri vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.04",
        "tanim": "Üyelik gerektiren hayvanları koruma dernek ve birliklerinin faaliyetleri (hayvanları koruma derneği, vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.05",
        "tanim": "Üyelik gerektiren kadın hakları koruma dernek ve birliklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.08",
        "tanim": "Okul aile birlikleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.09",
        "tanim": "Üyelik gerektiren, kültür, dayanışma ve eğlence dernek ve birliklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.12",
        "tanim": "Üyelik gerektiren ideoloji ve düşünce kuruluşlarının ve derneklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.13",
        "tanim": "Üyelik gerektiren sivil arama ve kurtarma dernek ve birliklerinin faaliyetleri (sivil savunma faaliyetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.14",
        "tanim": "Üyelik gerektiren bireysel özgürlük ve insan hakları dernek ve birliklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.15",
        "tanim": "Üyelik gerektiren gönüllü sağlık dernek ve birliklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.16",
        "tanim": "Engellilere, etnik gruplara ve azınlıklara yönelik üyelik gerektiren birlik ve kuruluşların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.17",
        "tanim": "Üyelik gerektiren, toplumsal hayatı geliştirme ve iyileştirmeye yönelik oluşturulan birlik ve kuruluşların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.18",
        "tanim": "Üyelik gerektiren, tüketici haklarını savunan birlikler ve kuruluşların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.19",
        "tanim": "Havacılığın geliştirilmesine yönelik, üyelik gerektiren kuruluş ve derneklerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.20",
        "tanim": "Üye olunan derneklerin üst kuruluşları ve üst birlikleri (iş, işveren ve mesleki birlik ve derneklerin üst kuruluşları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.21",
        "tanim": "Üyelik gerektiren yardım kuruluşlarının ve derneklerinin faaliyetleri (doğal afetlerde zarar görenler, evsizler, fakirler için organizasyonlar vb.) (arama ve kurtarma hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.22",
        "tanim": "Üyelik gerektiren eğitim ve araştırma birlik ve derneklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.23",
        "tanim": "Üyelik gerektiren konut ve kalkınma birlik ve derneklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.24",
        "tanim": "Üyelik gerektiren mezun dernek ve birliklerinin faaliyetleri (profesyonel meslek kuruluşları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "94.99.99",
        "tanim": "Üyelik gerektiren, başka yerde sınıflandırılmamış diğer üye olunan kuruluşların faaliyetleri (klasik araba birlikleri, kiracı birlikleri vb. dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.10.01",
        "tanim": "Bilgisayarların ve bilgisayar çevre birimlerinin onarımı (ATM'ler ve pos cihazları dahil)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.10.02",
        "tanim": "İletişim araç ve gereçlerinin onarımı (kablosuz telefonlar, telsizler, cep telefonları, çağrı cihazları, ticari kameralar vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.10.03",
        "tanim": "Bilgisayarların ve bilgisayar çevre birimlerinin yenilenmesi hizmeti faaliyetleri (dizüstü bilgisayarlar, masaüstü bilgisayarlar, modemler, oyun konsolları)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.10.04",
        "tanim": "İletişim araç ve gereçlerinin yenilenmesi hizmeti faaliyetleri (cep telefonları, akıllı telefonlar)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.21.01",
        "tanim": "Tüketici elektroniği ürünlerinin onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.22.01",
        "tanim": "Evde kullanılan elektrikli cihazların onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.22.02",
        "tanim": "Ev ve bahçe gereçlerinin bakım ve onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.22.03",
        "tanim": "Termosifon, şofben, banyo kazanı vb. onarım ve bakımı (merkezi ısıtma kazanlarının (boylerler) onarımı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.23.01",
        "tanim": "Ayakkabı ve deri eşyaların onarım ve bakımı (deri giyim eşyası hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.24.01",
        "tanim": "Mobilyaların ve ev döşemelerinin onarım ve bakımı (halı ve kilim onarımı hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.25.01",
        "tanim": "Saatlerin onarımı (kronometreler dahil, devam kayıt cihazları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.25.02",
        "tanim": "Mücevherlerin onarımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.25.03",
        "tanim": "Saatlerin yenilenmesi hizmeti faaliyetleri (telefon özelliği olmayan akıllı saatler)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.02",
        "tanim": "Giyim eşyası ve ev tekstil ürünlerinin onarımı ve tadilatı (deri giyim eşyaları hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.03",
        "tanim": "Spor araç ve gereçleri ile kamp malzemelerinin bakımı ve onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.04",
        "tanim": "Anahtar çoğaltma hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.05",
        "tanim": "Bisiklet onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.06",
        "tanim": "Müzik aletlerinin onarım ve bakımı (piyano akordu dahil, tarihi müzik aletleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.07",
        "tanim": "Deri ve deri bileşimli giyim eşyaları ile kürk giyim eşyalarının onarımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.29.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer kişisel ve ev eşyalarının onarım ve bakımı",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.31.01",
        "tanim": "Motorlu kara taşıtlarının genel onarım ve bakımı faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.31.02",
        "tanim": "Motorlu kara taşıtlarının lastik onarımı faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.31.03",
        "tanim": "Motorlu kara taşıtlarının yağlama, yıkama, cilalama vb. faaliyetlerİ",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.31.04",
        "tanim": "Motorlu kara taşıtlarının karoser ve kaporta onarımı vb. faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.31.05",
        "tanim": "Motorlu kara taşıtlarının boyanması faaliyetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "95.31.06",
        "tanim": "Motorlu kara taşıtlarının elektrik sistemlerinin onarım faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "95.31.07",
        "tanim": "Motorlu kara taşıtların koltuk ve döşemelerinin onarım ve bakımı faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.31.08",
        "tanim": "Motorlu kara taşıtlarına yakıt sistemi (benzin, dizel, LPG, CNG, LNG vb.) montajı ve bakımı hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.32.00",
        "tanim": "Motosikletlerin onarım ve bakımı",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "95.40.00",
        "tanim": "Bilgisayarların, kişisel eşyalar ve ev eşyalarının, motorlu kara taşıtlarının ve motosikletlerin onarım ve bakımı için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.10.01",
        "tanim": "Giyim eşyası ve diğer tekstil ürünlerini ütüleme hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.10.02",
        "tanim": "Çamaşırhane hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.10.03",
        "tanim": "Kuru temizleme hizmetleri",
        "sinif": "Çok Tehlikeli"
    },
    {
        "kod": "96.10.04",
        "tanim": "Halı ve kilim yıkama hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.10.90",
        "tanim": "Diğer tekstil temizleme hizmetleri ile giyim eşyası ve diğer tekstil ürünlerini boyama ve renklendirme hizmetleri (imalat aşamasında yapılanlar hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.21.01",
        "tanim": "Kadınlar için kuaför işletmelerinin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.21.02",
        "tanim": "Erkekler için kuaför ve berber işletmelerinin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.22.01",
        "tanim": "Güzellik salonlarının faaliyetleri (cilt bakımı, kaş alma, ağda, manikür, pedikür, makyaj, kalıcı makyaj vb.nin bir arada sunulduğu salonlar) (sağlık bakım hizmetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.22.02",
        "tanim": "Sadece manikür ve pedikür hizmeti sunan salonların faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.22.03",
        "tanim": "Sadece ağdacılık hizmeti sunan salonların faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.23.01",
        "tanim": "Hamam, sauna, vb. yerlerin faaliyetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.23.02",
        "tanim": "Zayıflama salonu, masaj salonu, solaryum vb. yerlerin işletilmesi faaliyetleri (form tutma salonlarının ve diyetisyenlerin faaliyetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.23.03",
        "tanim": "Kaplıca, ılıca, içmeler, spa merkezleri, vb. yerlerin faaliyetleri (konaklama hizmetleri hariç)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.30.01",
        "tanim": "Cenaze işleri ile ilgili faaliyetler (cenaze yıkama yerlerinin işletilmesi, cenazenin nakli, yıkama hizmetleri, defin hizmetleri vb.)",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.30.02",
        "tanim": "Mezarlıkların satış hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.40.00",
        "tanim": "Kişisel hizmetler için aracılık hizmeti faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.91.00",
        "tanim": "Ev içi kişisel hizmet faaliyetlerinin sağlanması",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.01",
        "tanim": "Eskort ve refakat hizmetleri (güvenlik hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.02",
        "tanim": "Hamallık hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.99.03",
        "tanim": "Kendi hesabına çalışan yamak, garson vb. hizmet sunanların faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.04",
        "tanim": "Ev hayvanları ve terk edilmiş hayvanlar için bakım hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.99.05",
        "tanim": "Kendi hesabına çalışan valelerin hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.06",
        "tanim": "Fal , astroloji ve spiritualist hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.07",
        "tanim": "Genel tuvaletlerin işletilmesi faaliyeti",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.08",
        "tanim": "Arzuhalcilerin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.09",
        "tanim": "Tanıştırma bürolarının ve evlendirme ajanslarının hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.10",
        "tanim": "Jeton ile çalışan kişisel hizmet makinelerinin işletilmesi faaliyetleri (jetonlu makinelerle vesikalık fotoğraf, emanet dolapları, tartı, tansiyon ölçümü vb. hizmetler dahil; oyun ve kumar makineleri ile çamaşırhane hizmetleri hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.11",
        "tanim": "Ayakkabı boyama hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.12",
        "tanim": "Genelev hizmetleri",
        "sinif": "Tehlikeli"
    },
    {
        "kod": "96.99.13",
        "tanim": "Şecere bulma faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.14",
        "tanim": "Nikah salonlarının hizmetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "96.99.99",
        "tanim": "Başka yerde sınıflandırılmamış diğer hizmet faaliyetleri (dövme ve piercing hizmetleri vb.)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "97.00.10",
        "tanim": "Ev içi çalışan personelin işverenleri olarak hanehalklarının faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "98.10.01",
        "tanim": "Hanehalkları tarafından kendi kullanımlarına yönelik olarak üretilen ayrım yapılmamış mallar",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "98.20.01",
        "tanim": "Hanehalkları tarafından kendi kullanımlarına yönelik olarak üretilen ayrım yapılmamış hizmetler",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "99.00.15",
        "tanim": "Uluslararası örgütler ve temsilciliklerinin faaliyetleri",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.13.02",
        "tanim": "Kendi adına menkul sermaye iradı faaliyetleri (temettü, banka faizi, iştirak kazançları vb. dahil; ücret geliri elde etme hariç)",
        "sinif": "Az Tehlikeli"
    },
    {
        "kod": "66.13.03",
        "tanim": "Ücret geliri elde etme faaliyetleri (huzur hakkı vb.)",
        "sinif": "Az Tehlikeli"
    }
];