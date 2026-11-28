// Arte oficial de terceros usado bajo su política de contenido de fans.
// Los archivos solo se reescalan y se convierten a WebP: sin recortes ni retoques.
const SUPERCELL_POLICY = 'https://supercell.com/en/fan-content-policy/';
export const SUPERCELL_NOTICE = 'This material is unofficial and is not endorsed by Supercell. For more information see Supercell\'s Fan Content Policy: www.supercell.com/fan-content-policy.';

// Ilustraciones generadas con IA (autorizadas por dirección en VX-MEDIA-001, 28/11/2026).
// Se identifican siempre como tales: no son fotografías de pruebas, capturas reales ni material oficial.
export const AI_CAPTION = 'Imagen ilustrativa generada con IA para Vélix. No muestra un producto, una prueba ni una captura reales.';

export const officialMedia = {
  'clash-royale': {
    alt: 'Arte oficial de Clash Royale: el Bandido Jefe y su banda avanzan entre polvo y hojas',
    caption: 'Arte oficial de Clash Royale («Key_Art_Boss_Bandit_Evo_Executioner») del Supercell Fan Kit. © Supercell.',
    kind: 'official', owner: 'Supercell', policy: SUPERCELL_POLICY, notice: SUPERCELL_NOTICE,
  },
  'clash-tactics': {
    alt: 'Arte oficial de Merge Tactics de Clash Royale con el Rey, la Princesa y otras tropas',
    caption: 'Arte oficial de Merge Tactics («MergeTactics_KeyART») del Supercell Fan Kit. © Supercell.',
    kind: 'official', owner: 'Supercell', policy: SUPERCELL_POLICY, notice: SUPERCELL_NOTICE,
  },
  'art-28-fortnite-emparejamiento': {
    alt: 'Router wifi con cuatro antenas y luces de estado encendidas sobre un escritorio de madera',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-001', original: '9cf65242-image.png', sha256: '39a7f0d7164824c49299f52b5483a606d6247e84acecbb3dbb3d954b9079eaae', size: '1671x941' },
  },
  'art-36-perdida-fps': {
    alt: 'Teléfono en una base de carga con el indicador de batería al 67 % junto a un portátil',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-001', original: '12eecd8f-image.png', sha256: '996292aa1816ea93406c946edb30bb808025dde6a9e38b465636c515924537c1', size: '1671x941' },
  },
  'art-44-tamano-juegos': {
    alt: 'Teléfono sobre un escritorio con la pantalla de almacenamiento: 114 GB usados de 128 GB',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-001', original: 'cc41ef8a-image.png', sha256: '5eaf735ebc4848a8ddf71de1d1388028feea92643b5ed392119a3aabbd009d66', size: '1672x941' },
  },
  'art-47-mando-telefono': {
    alt: 'Teléfono en horizontal con un juego de carreras en pantalla junto a un mando de consola blanco',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-001', original: '506430fb-image.png', sha256: '62a1b8fe0cb6e62190d456c77deb4f3eee6dc4516e7a5b5513eee1dca6a04adc', size: '1672x941' },
  },
  'art-42-gpu-telefono': {
    alt: 'Teléfono abierto sobre una mesa con la placa, el procesador, la cámara y la batería a la vista',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-002', original: 'fb16d5da-image.png', sha256: 'd11087d81980dcd9eb33077b5acfdd021aab7425e5331db1fd29708c2ee1ff5a', size: '1672x941' },
  },
  'art-41-120hz-30fps': {
    alt: 'Teléfono en horizontal con una escena de carreras dividida en dos mitades etiquetadas «30 FPS» y «120 Hz»',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-002', original: 'e32ca09b-image.png', sha256: '222393321cdda019ed0b59525331d825e92b2a87432b28ebd93b0fd056f6d9c4', size: '1672x941' },
  },
  'art-01-roblox-error-280': {
    alt: 'Mano sosteniendo un teléfono con la pantalla de actualización de software y un mando al fondo',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-002', original: '5ce23939-image.png', sha256: '7159179742fb603baf492cbb969f728347a0bd283354614159a964a83bc3893d', size: '1670x941' },
  },
  'art-27-minecraft-copia-mundo': {
    alt: 'Teléfono con una copia de seguridad de un mundo en curso junto a un portátil con un paisaje de bloques',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-002', original: '6e7b62e0-image.png', sha256: '565cb7141173758a5a91aa566140a6eb01058d2b7e04ae7bede999eb38faf5c7', size: '1670x942' },
  },
  'art-43-vulkan-opengl': {
    alt: 'Dos teléfonos en horizontal con la misma escena de juego: a la izquierda se ve borrosa y a la derecha nítida',
    caption: AI_CAPTION,
    kind: 'ia', owner: 'Vélix (imagen generada con IA, aportada por dirección)',
    provenance: { receivedAt: '2026-11-28', lot: 'VX-MEDIA-002', original: 'df95b403-image.png', sha256: '104cdbaf526cb150c35a544e8a4f2f3812f963534b3ce86febb8b993c18ced41', size: '1671x941' },
  },
};
