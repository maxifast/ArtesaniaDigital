/**
 * Maestros Data Registry
 * Shared data layer between the artisan dashboard (artesano.js) and the public storefront.
 * Static artisans are hardcoded here. Dynamic artisans created via the dashboard
 * are stored in localStorage under 'artesano_registry' and merged at runtime.
 */

(function () {
    // Static (pre-existing) artisans
    const staticMaestros = [
        {
            id: 'maria-ruiz',
            name: 'María Ruiz',
            initials: 'MR',
            region: 'Granada, Andalucía',
            specialty: 'Cerámica Nazarí',
            bio: 'Cuarta generación de alfareros granadinos. María aprendió el oficio de su abuelo en las cuevas del Sacromonte, donde la arcilla roja se moldea al ritmo del flamenco. Cada pieza lleva consigo la herencia de la cerámica nazarí del siglo XIV.',
            quote: '"Mis manos son solo un puente entre la tierra y el alma del que la poseerá."',
            online: true,
            img: 'assets/images/artisan-hands.png',
            products: [1, 2, 3, 5, 7, 9] // IDs from data.js
        },
        {
            id: 'jose-perez',
            name: 'José Pérez',
            initials: 'JP',
            region: 'Valencia',
            specialty: 'Terracota Mediterránea',
            bio: 'José trabaja en su taller familiar en el barrio del Carmen de Valencia desde 1998. Sus piezas de terracota capturan el espíritu del Mediterráneo: cálidas, sólidas y con historia.',
            quote: '"El barro no miente. Cada grieta es una historia, cada curva es una emoción."',
            online: false,
            img: 'assets/images/artisan-hands.png',
            products: [4, 6, 8]
        },
        {
            id: 'patricia-molina',
            name: 'Patricia Molina',
            initials: 'PM',
            region: 'Ubrique, Cádiz',
            specialty: 'Marroquinería Premium',
            bio: 'Desde Ubrique, la capital mundial del cuero, Patricia crea piezas que rivalizan con las grandes casas europeas. Cada bolso y cartera lleva meses de trabajo manual con piel seleccionada.',
            quote: '"En Ubrique decimos que el cuero tiene memoria. Recuerda cada mano que lo toca."',
            online: true,
            img: 'assets/images/artisan-hands.png',
            products: [10, 11]
        },
        {
            id: 'fernando-ruiz',
            name: 'Fernando Ruiz',
            initials: 'FR',
            region: 'Jaén, Andalucía',
            specialty: 'Talla en Olivo',
            bio: 'Fernando rescata olivos centenarios que ya no producen aceituna y les da una segunda vida como esculturas y objetos funcionales. Su taller en la Sierra de Cazorla huele a madera noble y aceite.',
            quote: '"Un olivo de 300 años merece ser arte, no leña."',
            online: true,
            img: 'assets/images/artisan-hands.png',
            products: [12]
        },
        {
            id: 'inmaculada-rios',
            name: 'Inmaculada Ríos',
            initials: 'IR',
            region: 'La Granja, Segovia',
            specialty: 'Cristal Soplado',
            bio: 'En la Real Fábrica de Cristales de La Granja, Inmaculada aprendió las técnicas de soplado que se remontan al siglo XVIII. Hoy aplica esas mismas técnicas para crear piezas contemporáneas.',
            quote: '"El cristal soplado es como la música: no puedes parar a mitad de nota."',
            online: true,
            img: 'assets/images/artisan-hands.png',
            products: []
        },
        {
            id: 'joaquin-blanco',
            name: 'Joaquín Blanco',
            initials: 'JB',
            region: 'Albacete',
            specialty: 'Forja de Navajas',
            bio: 'Albacete y las navajas son sinónimos. Joaquín es uno de los últimos maestros cuchilleros que forja cada hoja a mano, siguiendo una tradición que los árabes trajeron a estas tierras.',
            quote: '"Cada navaja que sale de mi fragua lleva el fuego de mil años de tradición."',
            online: true,
            img: 'assets/images/artisan-hands.png',
            products: []
        }
    ];

    // Merge static + dynamic (from dashboard registrations via localStorage)
    function getAllMaestros() {
        let dynamic = [];
        try {
            const saved = localStorage.getItem('artesano_registry');
            if (saved) dynamic = JSON.parse(saved);
        } catch (e) { }
        return [...staticMaestros, ...dynamic];
    }

    function getMaestroById(id) {
        return getAllMaestros().find(m => m.id === id) || null;
    }

    function getMaestroProducts(maestroId) {
        const maestro = getMaestroById(maestroId);
        if (!maestro) return [];

        // Get products from data.js (global catalog)
        let catalogProducts = [];
        if (window.appProducts && maestro.products) {
            catalogProducts = window.appProducts.filter(p => maestro.products.includes(p.id));
        }

        // Get products created via dashboard (localStorage)
        let dashboardProducts = [];
        try {
            const saved = localStorage.getItem('artesano_products');
            if (saved) {
                const all = JSON.parse(saved);
                dashboardProducts = all.filter(p => p.artisanId === maestroId);
            }
        } catch (e) { }

        return [...catalogProducts, ...dashboardProducts];
    }

    function registerMaestro(maestroData) {
        let dynamic = [];
        try {
            const saved = localStorage.getItem('artesano_registry');
            if (saved) dynamic = JSON.parse(saved);
        } catch (e) { }
        // Check if already exists
        if (!dynamic.find(m => m.id === maestroData.id)) {
            dynamic.push(maestroData);
            localStorage.setItem('artesano_registry', JSON.stringify(dynamic));
        }
    }

    // Expose globally
    window.MaestrosData = {
        getAll: getAllMaestros,
        getById: getMaestroById,
        getProducts: getMaestroProducts,
        register: registerMaestro,
        static: staticMaestros
    };
})();
