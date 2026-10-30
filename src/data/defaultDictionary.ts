import { CouplePhrase } from '../types';

export const DEFAULT_DICTIONARY: CouplePhrase[] = [
  {
    id: 'phrase-1',
    phrase: 'No me pasa nada',
    toneContext: 'Dicho con mirada fija al frente y respiración contenida',
    literalMeaning: 'Mi estado fisiológico y anímico se encuentra en perfecta normalidad sin perturbación alguna.',
    emotionalMeaning: 'Sí me pasa algo, estoy acumulando frustración, pero me da miedo o pereza expresarlo directamente, o siento que después de conocerme deberías haberte dado cuenta solo.',
    recommendedAction: 'No insistas con un interrogatorio judicial. Dale un abrazo sincero, dile suavemente "aquí estoy para cuando quieras hablar" y prepárale o cómprale su botana/bebida favorita sin pedir nada a cambio.',
    dangerLevel: 'alto',
    category: 'emociones'
  },
  {
    id: 'phrase-2',
    phrase: 'Como quieras',
    toneContext: 'Dicho encogiéndose de hombros y mirando la pantalla',
    literalMeaning: 'Cedo la potestad de la decisión de manera democrática e imparcial a tu libre albedrío.',
    emotionalMeaning: 'No me da igual. Tengo una preferencia muy clara e interiorizada, pero quiero poner a prueba tu nivel de conexión e iniciativa para ver si eliges lo que a mí me hace feliz.',
    recommendedAction: 'No elijas lo más fácil para ti. Propón dos opciones que sepas que le encantan ("¿Qué tal el restaurante italiano que querías o pedimos sushi en casa?") y asume la logística.',
    dangerLevel: 'medio',
    category: 'planes'
  },
  {
    id: 'phrase-3',
    phrase: '¿Te vas a poner eso?',
    toneContext: 'Mirada de escaneo vertical de 3 segundos con arqueo de ceja izquierda',
    literalMeaning: 'Pregunta inocua sobre tu selección textil para cotejar con las condiciones meteorológicas del día.',
    emotionalMeaning: 'Esa combinación de ropa me parece terrible para el lugar al que vamos y desentona con el contexto, pero no quiero sonar como tu madre controladora. Por favor, cámbiate antes de que salgamos por esa puerta.',
    recommendedAction: 'No te pongas a la defensiva. Mírate al espejo con humor y di: "¿Crees que otra camisa o zapato combine mejor? Dame tu asesoría de imagen oficial". Te evitarás 3 horas de caras raras.',
    dangerLevel: 'medio',
    category: 'ropa'
  },
  {
    id: 'phrase-4',
    phrase: 'No te preocupes, yo lo hago',
    toneContext: 'Dicho con un suspiro profundo y recogiendo los platos de golpe',
    literalMeaning: 'Asumo la responsabilidad doméstica con total alegría y satisfacción de servicio.',
    emotionalMeaning: 'Me siento solo/a y sobrecargado/a con la carga mental y las tareas de la casa en este instante. Si de verdad te levantas y lo haces tú ahora mismo con buena actitud, me harás inmensamente feliz.',
    recommendedAction: 'Levántate de inmediato. Dile con una sonrisa: "Ni hablar, déjamelo a mí, ve a sentarte o descansar un rato". Y haz la tarea completa (incluyendo secar y guardar los trastes, no a medias).',
    dangerLevel: 'alto',
    category: 'hogar'
  },
  {
    id: 'phrase-5',
    phrase: 'Tú sabrás',
    toneContext: 'Dicho en un tono seco, casi inaudible, cortando de raíz la conversación',
    literalMeaning: 'Confío ciegamente en tu criterio, sabiduría y madurez para resolver esta situación.',
    emotionalMeaning: 'Sé perfectamente que estás a punto de cometer un error garrafal. Te he dado una última oportunidad de rectificar por tu cuenta. Si sigues adelante, afrontarás consecuencias diplomáticas severas.',
    recommendedAction: 'ALTO EL FUEGO. No respondas "Pues sí sé". Detén lo que estabas haciendo, acércate y di: "A ver, siento que esto te incomoda y me importa lo que opinas. Hablemos dos minutos en serio".',
    dangerLevel: 'critico',
    category: 'comunicacion'
  },
  {
    id: 'phrase-6',
    phrase: 'Haz lo que quieras',
    toneContext: 'Sonrisa congelada y vuelta de espaldas inmediata',
    literalMeaning: 'Te otorgo libertad absoluta para ejercer tu albedrío existencial.',
    emotionalMeaning: 'Si haces exactamente lo que estás a punto de hacer, consideraré que mis deseos, nuestro tiempo juntos o mi sensibilidad no son tu prioridad.',
    recommendedAction: '¡Es una trampa! No hagas lo que querías hacer. Reevalúa el plan e incluye a tu pareja o busca un consenso amigable antes de ejecutar cualquier movimiento.',
    dangerLevel: 'nuclear',
    category: 'comunicacion'
  },
  {
    id: 'phrase-7',
    phrase: 'Está bien',
    toneContext: 'Monosílabo neutro con mirada esquiva o en mensaje de WhatsApp sin emojis',
    literalMeaning: 'Manifiesto mi conformidad y satisfacción con el acuerdo alcanzado.',
    emotionalMeaning: 'No está nada bien, pero me he rendido momentáneamente de intentar explicar mi punto de vista porque siento que no me estás escuchando.',
    recommendedAction: 'Haz una pausa en la discusión. No asumas que ganaste el debate. Pregunta con empatía real: "Sé que dijiste que está bien, pero me quedé con la sensación de que no te convence del todo. ¿Qué te gustaría que hiciéramos?".',
    dangerLevel: 'alto',
    category: 'comunicacion'
  },
  {
    id: 'phrase-8',
    phrase: 'No tengo hambre (pero mírame comer de tu plato)',
    toneContext: 'Manos extendidas lentamente hacia tus papas fritas',
    literalMeaning: 'Mi nivel de apetito es estrictamente cero calorías.',
    emotionalMeaning: 'No quería pedir comida entera por culpa o indecisión, pero la comida de tu plato se ve 300% más atractiva que cualquier menú del mundo. El 40% de tus papas ahora me pertenecen por derecho conyugal.',
    recommendedAction: 'Empuja amablemente el plato hacia el centro de la mesa o dale una porción generosa en una servilleta. Ni se te ocurra quejarte con "¡Pero si te pregunté si querías pedir!". La comida compartida es amor.',
    dangerLevel: 'bajo',
    category: 'comida'
  },
  {
    id: 'phrase-9',
    phrase: 'Hablamos luego',
    toneContext: 'Cierre abrupto de llamada o mensaje dejado en visto por 40 minutos',
    literalMeaning: 'Reagendemos nuestro intercambio verbal para una franja horaria más propicia.',
    emotionalMeaning: 'Estoy procesando un enfado considerable o me sentí herido/a, y prefiero enfriarme antes de decir algo hiriente o estallar.',
    recommendedAction: 'Dale su espacio durante 1 o 2 horas sin bombardear con 15 mensajes de "¿estás enojado/a?". Envía un solo mensaje conciliador: "Tómate tu tiempo, te quiero y cuando quieras platicar con calma me avisas".',
    dangerLevel: 'alto',
    category: 'comunicacion'
  },
  {
    id: 'phrase-10',
    phrase: 'Ok.',
    toneContext: 'Dos letras acompañadas del punto final más amenazante de la historia humana',
    literalMeaning: 'Aprobación fonética del término en inglés Okay.',
    emotionalMeaning: 'Ese punto final equivale a un portazo con sonido envolvente Dolby Atmos. Indica distanciamiento protocolar y descontento agudo.',
    recommendedAction: 'No respondas con un sticker gracioso. Llama por teléfono o envía un audio afectuoso disipando la tensión con ternura.',
    dangerLevel: 'critico',
    category: 'comunicacion'
  },
  {
    id: 'phrase-11',
    phrase: 'Qué rápido te arreglaste...',
    toneContext: 'Dicho mientras la otra persona lleva 45 minutos maquillándose o eligiendo calzado',
    literalMeaning: 'Elogio a tu excepcional eficiencia y velocidad motriz matutina.',
    emotionalMeaning: 'Siento que le pusiste cero esfuerzo a tu aspecto para un evento que a mí me importaba, o siento envidia de que yo tardé una hora y tú te pusiste lo primero que viste.',
    recommendedAction: 'Agrega un detalle extra (perfume, arreglarte el cabello, una chaqueta o accesorio lindo) y dile lo radiante que se ve su arreglo.',
    dangerLevel: 'medio',
    category: 'ropa'
  },
  {
    id: 'phrase-12',
    phrase: '¿Quién te estaba escribiendo?',
    toneContext: 'Tono casual pero con mirada clavada en el reflejo de la pantalla de tu móvil',
    literalMeaning: 'Curiosidad sociológica general sobre tu red de contactos contemporánea.',
    emotionalMeaning: 'Vi que sonreíste o te ocultaste al recibir un mensaje y mi detector de inseguridad/curiosidad se activó al 100%. Necesito transparencia para quedarme en paz.',
    recommendedAction: 'Sin actitud defensiva ni esconder la pantalla, dile con naturalidad: "Ah, era [Nombre / Meme de grupo / Mamá], mira este chiste malo que mandaron". La apertura inmediata desactiva cualquier película mental.',
    dangerLevel: 'medio',
    category: 'celos_curiosidad'
  }
];
