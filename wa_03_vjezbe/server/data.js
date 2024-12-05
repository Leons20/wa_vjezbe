class Proizvod{
    constructor(id, naziv, cijena, velicine, opis, slike, karakteristike, dostupne_boje){
        this.id = id;
        this.naziv = naziv;
        this.cijena = cijena;
        this.velicine = velicine;
        this.opis = opis;
        this.slike = slike;
        this.karakteristike = karakteristike;
        this.dostupne_boje = dostupne_boje;
    }
}

const proizvodi = [
    new Proizvod(
        1, 'Obična crna majica', 100, ['XS', 'S', 'M', 'L'],
        'Kvalitetna pamučna majica.', 
        [
            'https://freshcleantees.com/cdn/shop/files/CREWNECKSBlack_737x980.jpg?v=1714777751',
            'https://isto.pt/cdn/shop/files/Classic_T-shirt_Black_1_4b42b483-c2cf-46f6-805c-90bd905b4338.webp?v=1685716490',
            'https://www.activetruth.com.au/cdn/shop/files/CLASSIC-BAMBOO-T-SHIRT-BACK-BLACK_grande.png?v=1711585087'
        ],
        { materijal: 'pamuk', težina: '200g', održavanje: 'ručno pranje' },
        ['crna']
    ),
    new Proizvod(
        2, 'Levi\'s 501 traperice', 110, ['S', 'M', 'L'],
        'Originalne Levi\'s 501 traperice.',
        [
            'https://lsco.scene7.com/is/image/lsco/295020228-alt3-pdp-lse?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=2000&hei=1840',
            'https://static.qns.digital/img/p/2/5/8/7/3/2/1/2587321.jpg'
        ],
        { materijal: 'denim', težina: '500g', održavanje: 'strojno pranje' },
        ['plava']
    ),
    new Proizvod(
        3, 'Zimska kapa', 40, 'onesize',
        'Topla vunena kapa za zimu.',
        [
            'https://malizakladi.hr/media/catalog/product/cache/ee595ad2b94fe9d840a6c7a940b85399/j/a/jamiks-zimska-kapa-kelsi-grey-jze141j563-001.jpg',
            'https://apismarket.hr/image_style/product_image/Documents/Products/156046/158011_retrc346-black_ash-a1.jpg.webp?1728378091'
        ],
        { materijal: 'vuna', težina: '100g', održavanje: 'ručno pranje' },
        ['siva']
    ),
    new Proizvod(
        4, 'Čarape Adidas', 20, ['34-36', '37-39', '40-42'],
        'Sportske čarape s logotipom Adidas.',
        [
            'https://www.futbolemotion.com/imagesarticulos/219676/grandes/calcetines-adidas-adicolor-white-bold-gold-orange-0.webp',
            'https://www.buzzsneakers.hr/files/thumbs/files/images/slike-proizvoda/media/GD3/GD3575/images/thumbs_800/GD3575_800_800px.jpg'
        ], 
        { materijal: 'pamuk', težina: '50g', održavanje: 'strojno pranje' },
        ['bijela']
    ),
    new Proizvod(
        5, 'Tenisice Nike', 200, ['38', '39', '40', '41', '42', '43', '44', '45'],
        'Sportske tenisice s vrhunskom udobnošću.',
        [
            'https://www.sportvision.hr/files/thumbs/files/images/slike_proizvoda/media/DM0/DM0113-100/images/thumbs_800/DM0113-100_800_800px.jpg.webp',
            'https://www.buzzsneakers.hr/files/thumbs/files/images/slike-proizvoda/media/DZ4/DZ4510-100/images/thumbs_800/DZ4510-100_800_800px.jpg'
        ],
        { materijal: 'sintetika', težina: '700g', održavanje: 'brisanje vlažnom krpom' },
        ['bijela']
    )
];

export { Proizvod, proizvodi };