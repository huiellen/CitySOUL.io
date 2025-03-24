// cultural-data.js - Cultural data and thematic collections

// Sample data for demonstration - with Esquimalt, Canada coordinates
const CULTURAL_DATA = [
    {
        id: 1,
        title: "Fisgard Lighthouse National Historic Site",
        description: "Built in 1860, Fisgard Lighthouse is the first permanent lighthouse on Canada's west coast. It guided mariners into Esquimalt Harbour and stands as a testament to the region's rich maritime heritage.",
        category: "Architecture",
        period: "1850-1880",
        district: "Esquimalt",
        location: { lat: 48.430746, lng: -123.434543 },
        images: ["images/fisgard-lighthouse/fisgard1.jpg", "images/fisgard-lighthouse/fisgard2.jpg"],
        audio: true,
        tags: ["lighthouse", "maritime", "heritage", "national historic site"],
        contributor: "Parks Canada"
    },
    {
        id: 2,
        title: "Fort Rodd Hill National Historic Site",
        description: "A 19th-century coastal artillery fort built to defend Victoria and the Esquimalt Naval Base. The site includes gun batteries, underground magazines, command posts, and barracks that showcase Canada's military history.",
        category: "Military",
        period: "1890-1910",
        district: "Esquimalt",
        location: { lat: 48.431890, lng: -123.433432 },
        images: ["images/fort-rodd-hill/fort-rodd1.jpg", "images/fort-rodd-hill/fort-rodd2.jpg"],
        audio: true,
        tags: ["military", "fortress", "heritage", "defense"],
        contributor: "Parks Canada"
    },
    {
        id: 3,
        title: "CFB Esquimalt Naval & Military Museum",
        description: "Located at Naden on Canadian Forces Base Esquimalt, this museum houses artifacts, documents, and photographs that tell the story of the naval and military presence on Canada's West Coast since the 1850s.",
        category: "Museum",
        period: "1940-1960",
        district: "Esquimalt",
        location: { lat: 48.436944, lng: -123.414444},
        images: ["images/naval-museum/museum1.jpg", "images/naval-museum/museum2.jpg"],
        audio: true,
        tags: ["navy", "military", "museum", "artifacts"],
        contributor: "CFB Esquimalt"
    },
    {
        id: 4,
        title: "Lekwungen Traditional Territory - Songhees Point",
        description: "Known as 'p'álәc'әs' in the Lekwungen language, this sacred site was where cradle-boards were traditionally placed after infants had learned to walk. Today, it represents the rich indigenous heritage of the Songhees and Esquimalt Nations.",
        category: "Indigenous",
        period: "Pre-1850",
        district: "Victoria Harbour",
        location: { lat: 48.427702, lng: -123.383662},
        images: ["images/songhees-point/songhees1.jpg"],
        audio: true,
        tags: ["indigenous", "Lekwungen", "Songhees", "heritage"],
        contributor: "Songhees Nation"
    },
    {
        id: 5,
        title: "Esquimalt Graving Dock",
        description: "The largest non-military ship building and repair facility on the West Coast of the Americas, this historic dock represents Esquimalt's continuing maritime importance and industrial heritage.",
        category: "Maritime",
        period: "1880-1900",
        district: "Esquimalt",
        location: { lat: 48.431890, lng: -123.434543 },
        images: ["images/graving-dock/graving-dock1.jpg"],
        audio: false,
        tags: ["maritime", "industrial", "shipbuilding", "engineering"],
        contributor: "Township of Esquimalt"
    },
    {
        id: 6,
        title: "Garry Oak Learning Meadow",
        description: "Located at Fort Rodd Hill, this area showcases one of the rarest land ecosystems in Canada. The Garry Oak ecosystem is culturally significant to Indigenous peoples and represents the natural heritage of the region.",
        category: "Natural",
        period: "2000-2020",
        district: "Esquimalt",
        location: { lat: 48.430478, lng: -123.433290 },
        images: ["images/garry-oak/garry-oak1.jpg"],
        audio: false,
        tags: ["ecosystem", "conservation", "indigenous plants", "natural heritage"],
        contributor: "Parks Canada"
    },
    {
        id: 7,
        title: "Seven Signs of the lək̓ʷəŋən",
        description: "Bronze casts of cedar carvings by Songhees Master Carver Butch Dick mark significant cultural sites throughout the area. Each represents the spindle whorls used by Coast Salish women and connects to the ongoing cultural heritage of the Lekwungen-speaking peoples.",
        category: "Indigenous",
        period: "1990-2010",
        district: "Victoria",
        location: { lat: 48.425, lng: -123.367 },
        images: ["images/lekwungen-signs/spindle-whorl1.jpg"],
        audio: true,
        tags: ["indigenous art", "Lekwungen", "cultural markers", "heritage"],
        contributor: "Songhees Nation"
    }
];

// Thematic collections
const THEMATIC_COLLECTIONS = [
    {
        id: 1,
        title: "Esquimalt's Military Legacy",
        description: "Exploring the evolution of naval and military presence in Esquimalt from the 1800s to present day",
        image: "images/thematic/military-legacy.jpg",
        items: [2, 3, 5]
    },
    {
        id: 2,
        title: "Indigenous Heritage of the lək̓ʷəŋən People",
        description: "Honoring the Songhees and Esquimalt Nations whose ancestral lands we now share",
        image: "images/thematic/indigenous-heritage.jpg",
        items: [4, 6, 7]
    },
    {
        id: 3,
        title: "Maritime History",
        description: "Celebrating Esquimalt's deep connection to the sea and its role in Canada's maritime history",
        image: "images/thematic/maritime-history.jpg",
        items: [1, 5]
    },
    {
        id: 4,
        title: "National Historic Sites",
        description: "Exploring federally recognized sites of historical significance in the Esquimalt region",
        image: "images/thematic/historic-sites.jpg",
        items: [1, 2]
    }
];

// Export both arrays for use in other modules
export { CULTURAL_DATA, THEMATIC_COLLECTIONS };