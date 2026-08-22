// ============================================================
// Search index for the alt-history archive.
// Every entry on Timeline / Figures / Events / Realms / Chronicle
// that should be findable via the search box needs one object here.
//
// HOW TO ADD A NEW ENTRY TO SEARCH:
//   1. Add the object below (copy an existing one as a template).
//   2. Fields:
//        title   - shown as the result heading
//        meta    - small line under the title (dates, etc.)
//        tag     - category badge: "Timeline" | "Figure" | "Event" | "Realm"
//        page    - the .html file the entry lives on (e.g. "figures.html")
//        id      - the id= on that entry's <div class="entry" id="...">
//                   block, so the search result can link straight to it.
//                   Use null if the entry has no id (plain timeline rows
//                   without their own anchor).
//        excerpt - a sentence or two of the entry's text, used for
//                   matching and shown as a preview.
//   3. Save the file. No build step — refresh the page to test.
// ============================================================
const ARCHIVE_INDEX = [

  {
    "title": "Sabira bint Yusef",
    "meta": "c. 1148 – c. 1213 · Founder, Sabirid Dynasty",
    "tag": "Figure",
    "page": "figures.html",
    "id": "sabira-bint-yusef",
    "excerpt": "Sabira bint Yusef (Arabic: صابرة بنت يوسف‎, Ṣābira bint Yūsuf; c. 1148 – c. 1213), often referred to in later Sabirid sources as Sabira the Liberator..."
  },

  {
    "title": "Baldwin IV",
    "meta": "1161 – c. 1179 · Last Crusader King of Jerusalem",
    "tag": "Figure",
    "page": "figures.html",
    "id": "baldwin-iv",
    "excerpt": "Baldwin IV (1161 – c. 1179), known in Crusader annals as Baldwin the Leper and in the historiography of the Jasmine Throne as Baldwin the Defeated, was the..."
  },

  {
    "title": "Amina III",
    "meta": "1847 – 1906 · Empress of the Jasmine Empire",
    "tag": "Figure",
    "page": "figures.html",
    "id": "amina-iii",
    "excerpt": "Amina III bint Harun (1 October 1847 – 12 June 1906) was the Empress of the Jasmine Empire from 1878 until her death in 1906. She is remembered as the..."
  },

  {
    "title": "First Great Asian War",
    "meta": "1874 – 1882",
    "tag": "Event",
    "page": "events.html",
    "id": "first-great-asian-war",
    "excerpt": "The First Great Asian War (1874–1882), also known as the War of the Crescent and Dragon, was a global conflict fought between the Eastern Concord,..."
  },

  {
    "title": "The Balkan War of 1891",
    "meta": "1891 – 1893",
    "tag": "Event",
    "page": "events.html",
    "id": "the-balkan-war-of-1891",
    "excerpt": "The Balkan War of 1891 (1891–1893) was a short but destructive conflict fought primarily between the Kingdom of Prussia and the Jasmine Empire in the..."
  },

  {
    "title": "Fall of Prussia",
    "meta": "1893",
    "tag": "Event",
    "page": "events.html",
    "id": "fall-of-prussia",
    "excerpt": "The Fall of Prussia refers to the collapse of the Kingdom of Prussia in 1893, following its defeat and exhaustion in the Balkan War of 1891–1893. Once..."
  },

  {
    "title": "The Jasmine Empire's Revolts of the 1890s",
    "meta": "1890s",
    "tag": "Event",
    "page": "events.html",
    "id": "the-jasmine-empire-s-revolts-of-the-1890s",
    "excerpt": "The Revolts of the 1890s were a series of uprisings, strikes, and rebellions that shook the Jasmine Empire following its costly participation in the Balkan..."
  },

  {
    "title": "Road to the Second Great Asian War",
    "meta": "1906 – 1932",
    "tag": "Event",
    "page": "events.html",
    "id": "road-to-the-second-great-asian-war",
    "excerpt": "The Road to the Second Great Asian War (1906–1932) refers to the period of mounting global tensions that culminated in the outbreak of the Second Great..."
  },

  {
    "title": "Second Great Asian War",
    "meta": "1932 – 1956",
    "tag": "Event",
    "page": "events.html",
    "id": "second-great-asian-war",
    "excerpt": "The Second Great Asian War (1932–1956) was a global conflict fought between the Hilāl Bloc — the Jasmine Empire, Qing Dynasty, Mongol Empire, and Iberia —..."
  },

  {
    "title": "Tianming Rebellion",
    "meta": "Late 17th century",
    "tag": "Event",
    "page": "events.html",
    "id": "tianming-rebellion",
    "excerpt": "The Tianming Rebellion (Chinese: 天命之乱; Tiānmìng zhī Luàn; lit. “Disorder of the Heavenly Mandate”) was a major anti-Qing uprising that contributed to the..."
  },

  {
    "title": "The Chronicles of the Reign of the Mother",
    "meta": "Primary source · compiled c. 1563",
    "tag": "Event",
    "page": "chronicle.html",
    "id": "chronicle-of-the-reign-of-the-mother",
    "excerpt": "The six books of the Sabirid primary source on Baldwin’s fall and Sabira’s rise — from the Waning of Baldwin through the Liberation War, the taking of Jerusalem, and the Mother’s legacy."
  },

  {
    "title": "Sabirid Dynasty",
    "meta": "Founded 1178 · Levant",
    "tag": "Realm",
    "page": "realms.html",
    "id": "sabirid-dynasty",
    "excerpt": "The Sabirid dynasty, also known as the House of Sabira or the Jasmine Dynasty, was the ruling house of the state later known as the Imperial Throne of..."
  },

  {
    "title": "Jasmine Empire",
    "meta": "1178 – 1956 · Middle East & N. Africa",
    "tag": "Realm",
    "page": "realms.html",
    "id": "jasmine-empire",
    "excerpt": "The Jasmine Empire, formally known as The Imperial Throne of Jasmine, and also referred to historically as the Sabirid Empire, was a major world empire that..."
  },

  {
    "title": "Empire of Iberia",
    "meta": "1707 – mid-20th c. · Iberian Peninsula",
    "tag": "Realm",
    "page": "realms.html",
    "id": "empire-of-iberia",
    "excerpt": "The Empire of Iberia (Spanish: Imperio de Iberia, Portuguese: Império Ibérico) was a dual monarchy that ruled Spain and Portugal and their overseas colonies..."
  },

  {
    "title": "Empire of Gaul",
    "meta": "Founded 1799 · France",
    "tag": "Realm",
    "page": "realms.html",
    "id": "empire-of-gaul",
    "excerpt": "The Empire of Gaul (French: Empire de Gaule) was a European empire established in 1799, following the collapse of the Bourbon monarchy and the rise of a new..."
  },

  {
    "title": "Britannic Commonwealth",
    "meta": "Founded 1820 · Britain",
    "tag": "Realm",
    "page": "realms.html",
    "id": "britannic-commonwealth",
    "excerpt": "The Britannic Commonwealth was a republican state founded in 1820 after the collapse of the English monarchy during the Industrial Riots. It retained much..."
  },

  {
    "title": "Norse Union of Odin",
    "meta": "Founded 1857 · Scandinavia",
    "tag": "Realm",
    "page": "realms.html",
    "id": "norse-union-of-odin",
    "excerpt": "The Norse Union of Odin (Old Norse: Óðins Samfylking Norðurlanda) was a pan-Scandinavian monarchy established in 1857 following the Norse National..."
  },

  {
    "title": "Kingdom of Ireland",
    "meta": "Founded 1649 · Ireland",
    "tag": "Realm",
    "page": "realms.html",
    "id": "kingdom-of-ireland",
    "excerpt": "The Kingdom of Ireland (Irish: Ríogacht na hÉireann) was a sovereign monarchy established in 1649 after the successful expulsion of English forces during..."
  },

  {
    "title": "Qing Dynasty",
    "meta": "1636 – 17th c. collapse · China",
    "tag": "Realm",
    "page": "realms.html",
    "id": "qing-dynasty",
    "excerpt": "The Qing dynasty (Chinese: 清朝; Qīng Cháo), officially the Great Qing, was a Manchu-led imperial dynasty that ruled China from 1636 until the effective..."
  },

  {
    "title": "Fu Dynasty",
    "meta": "1649 – early 21st c. · China",
    "tag": "Realm",
    "page": "realms.html",
    "id": "fu-dynasty",
    "excerpt": "The Fu dynasty (Chinese: 傅朝; pinyin: Fù Cháo), retrospectively known as the Later Fu by modern historians, was the ruling dynasty of China from 1649 until..."
  },

  {
    "title": "Preußischer Volksbund",
    "meta": "1889 – reorganized · Central Europe",
    "tag": "Realm",
    "page": "realms.html",
    "id": "preu-ischer-volksbund",
    "excerpt": "The Prussian People's Commonwealth (German: Preußischer Volksbund), commonly known as the People's Prussia, was a republican state that existed in Central..."
  },

  {
    "title": "Heretical Austrian State",
    "meta": "Sacred Babenberg Realm · Central Europe",
    "tag": "Realm",
    "page": "realms.html",
    "id": "heretical-austrian-state",
    "excerpt": "The Sacred Babenberg Realm (Latin: Sacrum Regnum Foederis), commonly referred to by foreign powers as the Heretical Austrian State (Latin: Haereticus..."
  },

  {
    "title": "Life in the Eternal Sabirid State",
    "meta": "1956 – 2012 · Society & culture",
    "tag": "Realm",
    "page": "realms.html",
    "id": "life-in-the-eternal-sabirid-state",
    "excerpt": "Life inside the Eternal Sabirid State (1956–2012) was marked by strict ideological control, ethnic exclusion, and pervasive propaganda. Citizens lived under..."
  },

  {
    "title": "The Age of Inspiration",
    "meta": "Late 12th c. – 1783",
    "tag": "Timeline",
    "page": "timeline.html",
    "id": null,
    "excerpt": "A long era of intellectual, cultural, and scientific flourishing across the Middle East and beyond, laying the foundations of the later Jasmine Empire."
  }

];
