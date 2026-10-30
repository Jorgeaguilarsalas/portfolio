# Inventario técnico-descriptivo de un portafolio web — referencia Koray Önal

**Fecha de análisis:** 30 de octubre de 2026  
**Material observado:** grabación de pantalla de 87,75 s, 2940 × 1600 px y 60 fps.  
**Idioma de la interfaz observada:** alemán.  
**Objeto:** documentar fielmente estructura, jerarquía visual, animaciones, navegación, patrones de interacción y recursos creativos visibles para permitir un análisis posterior independiente.  
**Restricción:** NO contiene recomendaciones, puntuaciones ni propuestas de implementación para otro portafolio.

## 1. Alcance y niveles de certeza

- **Observación directa:** contenido, posición, apariencia y cambios de estado identificables en la grabación.
- **Terminología técnica descriptiva:** nombres de patrones de UX/UI y motion design compatibles con esas observaciones, sin afirmar que se usó una tecnología específica.
- **Estimación visual:** dimensiones y colores son aproximados, calculados sobre fotogramas comprimidos de una captura de escritorio; no equivalen a especificaciones CSS reales.
- **No comprobado:** DOM, librerías, frameworks, algoritmos de partículas, accesibilidad, rendimiento real, funcionamiento móvil, enlaces no abiertos y comportamiento de componentes que no se manipularon.

## 2. Arquitectura de información y secuencia

El referente se presenta como un portafolio profesional de **Koray Önal**, descrito en el encabezado como **Freiberuflicher Senior UX Designer**. Predomina una experiencia de página larga con navegación por secciones; en la grabación, al pasar el cursor por enlaces se alcanzan a ver destinos con fragmentos de URL como `#services`, `#prozess` y `#kontakt`, consistentes con navegación por anclas. También se observa un bloque específico y más amplio de UX-Audit durante un desplazamiento rápido; no se establece si corresponde a otra ruta o a un bloque dentro de la misma experiencia.

**Orden de bloques visibles en el recorrido principal:**

1. **Cabecera/navegación:** enlaces `ÜBER MICH`, `LEISTUNGEN`, `UX-AUDIT`, `ARBEITSWEISE`, `ERFAHRUNG`, `KONTAKT`; selector textual `DE` / `EN`. En buena parte del recorrido aparece una versión con monograma pequeño a la izquierda y CTA a la derecha.
2. **Hero / presentación:** monograma geométrico KO de gran escala, titular «Verstehen. Vertiefen. Vereinfachen.», identificación profesional en texto gris y botón «Kontakt aufnehmen».
3. **Prueba social por marcas:** rótulo `VERTRAUEN VON` seguido de una secuencia horizontal de logotipos, entre ellos Röhrle, BIKE24, AutoScout24, HolidayCheck y Sixt.
4. **Manifiesto/introducción personal:** bloque oscuro con retrato recortado a la derecha y cita grande a la izquierda («Gute UX entsteht nicht im Vorbeigehen. Sie braucht Zeit, Tiefe und echte Daten.»).
5. **Leistungen / servicios:** título y tres tarjetas paralelas: `Enterprise direkt`, `B2B Mittelstand`, `Agenturverstärkung`, cada una con lista de prestaciones.
6. **Producto/servicio destacado:** tarjeta negra mucho más ancha «UX-Audit mit Senior-Review», con explicación del flujo, texto enlazado subrayado en lima, imagen de reporte, CTA «UX-Audit ansehen» y precio visible de `299 €` con nota de precio fijo e IVA incluido.
7. **Arbeitsweise / proceso:** cuatro pasos numerados en una cuadrícula 2 × 2: `Business verstehen`, `UX Perspektive einlegen`, `Komplexität vereinfachen`, `Kontinuierlich iterieren`; cada paso contiene un pequeño diagrama de puntos y líneas y un párrafo.
8. **Experiencia y capacidades:** titular a tres líneas «Senior Erfahrung. Solides Handwerk. Mit KI beschleunigt.»; bloques en dos columnas, entre ellos `Erfahrung & Methode`, `Handwerk`, `KI im Designprozess`, `Prototyping`.
9. **Stimmen / testimonios:** tres citas en tarjetas con forma de globo de diálogo, seguidas de nombre, cargo, empresa y pequeños avatares o iniciales.
10. **Ventures / proyectos:** tarjetas editoriales de proyectos, entre ellos `Cumo Drivers Club`, `KDM Zeitloses Design` y `Creative Table`. Se ven imágenes de cabecera, logotipos, descripciones y enlaces/CTAs «Case Study lesen» y «Website besuchen» en los dos primeros.
11. **Kontakt / contacto:** encabezado, introducción, formulario con nombre, apellido, email, teléfono opcional y mensaje, elemento Cloudflare de verificación y CTA «Nachricht senden».
12. **Footer de marca:** retorno del gran monograma KO sobre la malla de partículas, línea divisoria, crédito de autor, pequeños logotipos y enlaces `Impressum`, `Datenschutz`, `LinkedIn`.

**Bloque adicional identificado durante los saltos de navegación (aprox. 82,5 s):** composición de UX-Audit a dos columnas. A la izquierda, titular grande «UX-Audit für deine Website. Von KI durchlaufen, von mir geprüft.», descripción y CTA «Audit anfragen» junto a `299 €`; a la derecha, dos simulaciones superpuestas de páginas de un informe (`UX-Review`) con rótulo de ejemplo. Su cabecera muestra un CTA «Audit anfragen». No fue posible determinar si ese bloque se encontraba en el mismo recorrido normal o en una vista adicional.

## 3. Sistema visual

### 3.1. Color

- **Fondo dominante:** antracita casi negro, aproximadamente `#19191B` según fotogramas.
- **Tarjetas y áreas enfatizadas:** negro más profundo, cerca de `#000000` a `#060606`.
- **Titulares y logotipo:** blanco roto casi puro (`#F9F9F9` aproximadamente).
- **Texto secundario:** gama de grises medios y claros, inferior en contraste al titular.
- **Acento:** verde lima muy luminoso, próximo a `#BDF905` en fotogramas observados. Se usa para CTAs, subrayados de navegación/enlaces, nodos de diagramas y microetiquetas.
- **Divisores y contornos:** líneas grises de muy baja intensidad, visibles en cabecera, cuadrículas y footer.
- **Fotografía:** aparece a color en el proyecto automovilístico y el mosaico de interfaces; fotografía desaturada o blanco y negro en otro proyecto. La mayor parte de la UI conserva colorimetría monocroma.

### 3.2. Tipografía y escala

- Familia visual **sans-serif neo-grotesca o grotesca contemporánea**, con trazos relativamente uniformes; la familia exacta no es verificable.
- **Titular hero:** peso muy alto (visualmente bold/extrabold), gran escala, ocupando alrededor de dos líneas y una porción importante del ancho disponible. El ritmo surge de tres verbos cortos con punto.
- **Titulares de sección:** grandes, blancos y más compactos que el hero; entre una y tres líneas según sección.
- **Subtítulos de tarjetas:** negrita con tamaño claramente superior al cuerpo.
- **Cuerpo:** gris, peso regular, interlineado holgado. El texto del manifiesto es blanco y más grande.
- **Navegación:** mayúsculas, tamaño pequeño frente al resto de la página, espaciado entre letras perceptible (*letter spacing/tracking*), distribuida horizontalmente.
- **Precios y números:** aumento fuerte de tamaño y peso; `299 €` funciona como ancla visual en la tarjeta del producto.
- La jerarquía se apoya principalmente en **escala, peso, contraste y posición**, sin proliferación de familias tipográficas ni de colores.

### 3.3. Espaciado, retícula y alineaciones

- El contenido se ubica dentro de una **retícula de ancho amplio con márgenes laterales constantes**, aproximadamente 3–4 % del ancho de la pantalla en la captura.
- Predomina la **alineación izquierda**, con excepciones en el manifiesto (cita alineada hacia el retrato) y composición de imágenes.
- **Espacio negativo abundante** entre secciones; no hay divisores intensos a todo ancho excepto cabecera/footer y separadores delicados.
- Se alternan retículas **de tres columnas** (servicios y testimonios), **dos columnas** (proceso, experiencia, proyectos y oferta UX-Audit) y bloques de ancho completo (hero, franja de logos, encabezados, footer).
- Hay **variación de densidad vertical**: grandes vacíos seguidos de áreas compactas con tarjetas, listas y datos.
- Los proyectos iniciales se presentan en una composición a dos columnas **ligeramente desfasadas verticalmente**, no como una cuadrícula absolutamente uniforme.

### 3.4. Formas y componentes

- **Logomark KO:** emblema geométrico de gran tamaño con barra vertical, pieza angular y aro circular; blanco sólido, sin degradados evidentes.
- **Pill buttons:** botones de extremos muy redondeados, fondo verde lima y etiqueta negra. Botones secundarios negros/transparencia con borde fino gris y texto blanco, también de tipo píldora.
- **Cards:** superficies negras sobre fondo antracita, radios de esquina visibles y generosos; sin sombras llamativas ni efecto de cristal.
- **Testimonial speech bubbles:** tres tarjetas negras con pequeña punta triangular inferior, simulando bocadillos de diálogo.
- **Separadores finos:** líneas rectas grises en encabezado, proceso, bloques de experiencia y footer.
- **Inputs:** campos muy oscuros, rectangulares y con poca ornamentación; etiquetas colocadas encima de cada campo. El área de mensaje es un rectángulo alto.
- **Mini diagramas:** dibujos geométricos en blanco/gris/lima construidos visualmente con nodos, líneas, rectángulos, cruceta y círculo.

## 4. Motion design y animación, por fenómeno

### 4.1. Red ambiental de partículas

**Observación:** en hero, sección de retrato y footer aparecen puntos pequeños dispersos sobre el fondo oscuro, unidos en determinadas zonas por segmentos muy finos de baja opacidad. Algunas líneas forman triángulos o polígonos irregulares. Se observan nodos blancos/grises y algunos verde lima con halo. La configuración cambia lentamente incluso cuando el contenido principal está quieto. Cerca del monograma, la estructura llega a concentrarse formando una malla más densa.

**Nombres técnicos apropiados:** *connected-particle field*, *particle network background*, *node-edge graph visualization*, *proximity-link mesh*, *ambient procedural motion*, *low-opacity line mesh*. Los términos describen el aspecto; **no** confirman Canvas, SVG, WebGL, Three.js ni un algoritmo concreto.

### 4.2. Partículas que bordean la marca

**Observación:** el KO grande se presenta sólido y blanco, pero hay pequeños puntos lima alrededor del contorno y del círculo. Esos puntos varían de posición/estado a lo largo de la intro. La animación de malla se sitúa por detrás y alrededor del logotipo.

**Nombres técnicos:** *brand-adjacent particle accents*, *contour particle effect*, *animated graphic identity*. No puede determinarse si los puntos siguen matemáticamente un *path* o solo están superpuestos.

### 4.3. Aparición progresiva de secciones

**Observación:** en la llegada a la cita del retrato, el texto comienza más apagado y posteriormente aparece blanco y legible. En saltos rápidos se ven titulares y tarjetas momentáneamente más grises antes de adquirir contraste pleno. En particular, alrededor de 82,9–83,9 s, la sección Arbeitsweise pasa de una presentación atenuada a una visualización clara.

**Nombres técnicos:** *scroll-triggered reveal*, *opacity fade-in*, *entrance transition*, *scroll-activated content animation*. No es posible comprobar la curva de *easing*, los umbrales exactos ni si se emplea IntersectionObserver.

### 4.4. Diagramas que se construyen en el proceso

**Observación:** al volver mediante navegación a Arbeitsweise, las ilustraciones de cada paso aparecen primero como una nube de puntos desconectados. En los siguientes fotogramas se agrupan y terminan formando diagramas lineales precisos: cruceta o eje con nodos, secuencia de cuadrados con puntos, líneas horizontales/verticales y un anillo. En las figuras terminadas persisten detalles en verde lima.

**Nombres técnicos:** *particle-to-diagram transition*, *point-cloud assembly*, *node-and-edge formation*, *diagram reveal animation*, *motion graphics for process steps*. La secuencia es observable; no se confirma si se logra por interpolación de coordenadas, SVG *stroke animation*, morphing o recambio entre capas.

### 4.5. Navegación animada entre anclas

**Observación:** cerca de 78,8–80,0 s se activa el enlace «Leistungen» mientras se ve el footer. La pantalla atraviesa por instantes otras secciones (testimonios/proyectos/proceso) antes de detenerse sobre el título y las tarjetas de servicios. No se observa un corte súbito a una imagen independiente. Después se utiliza la barra para ir a Arbeitsweise y se aprecia el proceso de aparición de sus diagramas.

**Nombres técnicos:** *in-page anchor navigation*, *programmatic/smooth scrolling behavior*, *section jump with scroll transition*, *scroll offset for fixed header*. El desplazamiento tiene fotogramas intermedios; no se ha verificado el método nativo o programado.

### 4.6. Cabecera con estados visuales

**Observación:** al inicio, cuando el KO gigante está visible, la barra superior muestra los enlaces y `DE`/`EN`, sin el KO pequeño ni el CTA en algunos fotogramas. Al abandonar la zona inicial, el KO pequeño aparece a la izquierda y «Kontakt aufnehmen» a la derecha. Cerca del footer, donde vuelve el KO grande, reaparece la modalidad sin el logo pequeño/CTA. Durante el desplazamiento rápido de regreso se observan estados intermedios del símbolo.

**Nombres técnicos:** *persistent/sticky header*, *scroll-dependent header state*, *contextual navigation chrome*, *conditional brand/CTA display*, *responsive header transitions* en sentido visual. Que sea `position: sticky` o `position: fixed` no se puede verificar por vídeo.

### 4.7. Indicador de hover en navegación

**Observación:** al colocar el cursor sobre «LEISTUNGEN» y luego «ERFAHRUNG», surge una línea inferior verde lima bajo la etiqueta; al mover el cursor, cambia el enlace subrayado. Se observa cursor de mano sobre enlaces.

**Nombres técnicos:** *hover underline indicator*, *accent-colored link affordance*, *navigation microinteraction*. No se verifican *focus* de teclado ni estado *active* permanente; el subrayado observado puede corresponder solamente a *hover*.

### 4.8. Banda horizontal de logotipos

**Observación:** los logos están dispuestos horizontalmente con separaciones regulares; algunos se repiten a ambos lados. Entre fotogramas la secuencia ocupa posiciones horizontales distintas, aunque el vídeo también presenta desplazamiento vertical.

**Nombres técnicos:** *logo strip*, *client-logo marquee*, *horizontal infinite ticker* como descripción probable del efecto de desplazamiento. La repetición es directamente observable; la continuidad infinita y la velocidad autónoma exacta no se verificaron de forma concluyente.

### 4.9. Otros movimientos y sus límites

- Los elementos gráficos principales no presentan explosiones de color ni cambios tridimensionales visibles.
- No se observa un carrusel de proyectos operado mediante flechas ni una animación de hover sobre las imágenes; no quiere decir que no existan.
- No se verifica *parallax* independiente de capas, *scroll-snap*, *page transitions* entre rutas, efectos de sonido, animación de texto letra por letra, ni gestos táctiles.
- El vídeo no permite afirmar tecnologías concretas como GSAP, Framer Motion, Lottie, WebGL, CSS keyframes o Three.js.

## 5. Descripción detallada de módulos

### 5.1. Hero / above the fold (0–17 s)

La primera pantalla combina una cabecera horizontal discreta, mucho espacio vacío y un monograma de gran formato situado en el lado izquierdo. Debajo se lee el mensaje principal «Verstehen. Vertiefen. Vereinfachen.» en blanco, peso muy alto y dos líneas. El nombre, especialidad, propuesta hacia empresas y disponibilidad remota se presentan con tipografía gris. El botón principal «Kontakt aufnehmen» queda bajo el párrafo, alineado a la izquierda. La parte derecha de la pantalla se deja mayormente vacía. El fondo de partículas responde como elemento visual ambiental, no como un panel separado. Al bajar, la cabecera se conserva mientras cambia su contenido de marca.

**Patrones:** *hero branding*, *oversized typographic statement*, *primary CTA*, *asymmetric negative-space composition*, *animated brand motif*.

### 5.2. Logos + manifiesto personal (18–28 s)

Una franja separada por áreas de fondo antracita muestra «VERTRAUEN VON» sobre una hilera de marcas en gris claro. Debajo surge un panel negro de retrato/afirmación. La fotografía de una persona con gafas y polo oscuro ocupa la derecha; no está en una tarjeta rectangular con borde explícito, sino integrada en el fondo negro. La cita blanca queda a su izquierda y se distribuye en varias líneas. Detrás persisten líneas y nodos de baja visibilidad.

**Patrones:** *client-logo trust strip*, *social proof*, *editorial quote and portrait*, *cut-out/isolated subject on dark background*, *scroll-reveal quotation*.

### 5.3. Servicios (29–32 s; retorno 79–81 s)

Sección «Leistungen» con título grande y tres tarjetas negras, de ancho similar, ubicadas en una sola fila sobre fondo antracita. Cada tarjeta contiene encabezado blanco y lista con pequeños marcadores circulares. Sus esquinas son redondeadas y la separación entre tarjetas es clara. La información tiene estructura comparable, pero el texto está ajustado a cada segmento de cliente.

**Patrones:** *three-column service cards*, *segmented audience/value proposition*, *bullet-list card content*, *card grid*.

### 5.4. Tarjeta de UX-Audit (32–37 s)

Módulo negro de ancho casi completo y esquinas redondeadas. A la izquierda, un título y párrafo gris; en el párrafo hay una frase verde lima subrayada. Debajo aparece el botón lima «UX-Audit ansehen». A la derecha, una miniatura alta de un reporte oscuro y, por debajo, el precio `299 €` en blanco grande con leyenda secundaria en verde. El contraste entre texto, captura y precio forma una composición comercial a dos columnas.

**Patrones:** *featured service/product card*, *two-column promotional panel*, *report mockup*, *price anchor*, *primary CTA*, *inline accent link*.

### 5.5. Proceso (38–44 s; repetición 83–84 s)

Título «Arbeitsweise» y cuatro unidades que forman una retícula 2 × 2. En la parte alta de cada unidad hay un número grande con punto, un diagrama pequeño situado hacia la derecha y una línea horizontal superior. A continuación, título de paso blanco y explicación gris. Los pasos son: negocio, perspectiva UX, simplificación, iteración. Los cuatro diagramas no son pictogramas estándar: poseen una estética coherente de nodos y conectores geométricos con detalles lima.

**Patrones:** *numbered process framework*, *two-by-two process grid*, *custom animated line icons*, *diagram-led explanation*.

### 5.6. Experiencia / método (44–49 s)

Titular en tres líneas con construcción breve y rítmica. Bajo él, dos columnas de contenido textual. Cada subbloque comienza con una pequeña barra horizontal blanca de extremos redondeados, luego un título como «Erfahrung & Methode» o «Handwerk», seguido por un párrafo gris largo. La segunda fila contiene contenido sobre IA en el proceso de diseño y prototipado. Esta zona no utiliza tarjetas negras individuales para cada párrafo; organiza el texto directamente sobre el fondo con separaciones amplias.

**Patrones:** *editorial two-column text grid*, *capability pillars*, *micro-rule section marker*, *typographic hierarchy without cards*.

### 5.7. Testimonios (50–53 s)

Título grande «Stimmen». Tres rectángulos negros redondeados en línea, con la pequeña cola triangular en la parte inferior. Dentro de cada uno hay una cita blanca, sin fotografías grandes. Por debajo, fuera del bocadillo, aparece un pequeño avatar circular (en una tarjeta, iniciales), nombre, cargo y entidad empresarial en distintos niveles de gris. Los tres testimonios son de longitud variable y conservan apariencia visual uniforme.

**Patrones:** *testimonial cards*, *speech-bubble UI*, *avatar attribution*, *three-column social proof*.

### 5.8. Ventures / proyectos (54–68 s)

Encabezado «Ventures» y composición editorial de proyectos con abundante espacio entre columnas. Dos proyectos ocupan una fila asimétrica: el primero usa una fotografía a color de automóviles deportivos en una carretera; el segundo, una fotografía en blanco y negro de dos personas sentadas en un interior. Ambas imágenes poseen esquinas redondeadas. Bajo cada imagen aparecen un símbolo de marca, un título fuerte, un párrafo y dos CTAs: botón lima «Case Study lesen» y botón de contorno «Website besuchen» con icono de flecha diagonal externa. Más abajo se alcanza a ver «Creative Table», acompañado por una captura visual tipo mosaico de páginas web y un icono en forma de C.

**Patrones:** *editorial project showcase*, *asymmetric two-column portfolio layout*, *rounded cover images*, *project brand lockup*, *paired primary/secondary actions*, *external-link affordance*, *case study entry points*.

**Límite:** no se abre ninguna case study ni website externo en la grabación; no se describe la estructura de esas páginas.

### 5.9. Formulario de contacto (69–72 s)

Título «Kontakt» de gran tamaño y texto introductorio mediano que explica el contacto y ubicación de oficina. Formulario alineado a la izquierda y más estrecho que la pantalla: dos columnas para `Vorname` / `Nachname`, después `Email` / `Rufnummer (optional)`, seguido de `Nachricht` con caja de texto ancha y alta. Fondo de campos cercano al negro y etiquetas grises sobre los campos. Se ve un recuadro Cloudflare con señal `Success!` y, debajo, el botón verde «Nachricht senden».

**Patrones:** *two-column contact form*, *label-above-input*, *multi-line textarea*, *anti-bot verification widget*, *primary form submit CTA*.

**Límite:** el texto `Success!` pertenece visualmente al componente de verificación Cloudflare; **no permite afirmar que se haya enviado el formulario**.

### 5.10. Footer de marca (73–79 s)

El monograma KO reaparece enorme y blanco ocupando la parte inferior izquierda/central del viewport, con una malla de partículas más concentrada a su alrededor y otra dispersa en la mitad derecha. Una línea horizontal gris delimita el footer inferior. En la base aparecen crédito de autor a la izquierda, tres iconos/logos centrados y los enlaces `Impressum`, `Datenschutz`, `LinkedIn` a la derecha. La composición visual se parece a un segundo hero de marca, sin titular ni CTA principal dentro del área grande.

**Patrones:** *brand-driven footer*, *bookend composition* (marca grande al principio y al final), *ambient motion in closing section*, *multi-zone footer*, *legal/social utility links*.

### 5.11. Módulo amplio de UX-Audit observado durante navegación acelerada (alrededor de 82,5 s)

Aparece una variante de presentación de UX-Audit con titular a tres líneas, párrafo gris, botón lima «Audit anfragen» y precio destacado. La mitad derecha contiene **capas superpuestas de documentos/mockups**: una página oscura de portada delante y una página gris clara parcialmente visible detrás, con separación espacial y sombra discreta. Una leyenda pequeña identifica el documento como reporte de ejemplo. La barra superior muestra en ese momento el CTA «Audit anfragen», distinto del «Kontakt aufnehmen» de otras secciones.

**Patrones:** *split-hero product section*, *layered document mockups*, *overlapping visual stack*, *contextual header CTA*. La grabación no establece si la variación del CTA responde a la sección, a la ruta o a otra condición.

## 6. Interacción y microdetalles visibles

| Elemento | Estado observable | Nombre técnico |
|---|---|---|
| Navegación superior | Permanece visible durante el scroll | Persistent / sticky navigation |
| Monograma en cabecera | Se muestra en estados interiores y no siempre cuando se ve el monograma gigante | Conditional header branding |
| Botón de cabecera | Aparece «Kontakt aufnehmen» en recorrido habitual; «Audit anfragen» en vista de UX-Audit | Contextual CTA label |
| Elementos del menú | Línea inferior verde al apuntar con el cursor | Hover underline microinteraction |
| Enlaces internos | Salto a secciones con recorrido visible por contenido intermedio | Anchored smooth-scroll-like navigation |
| Titulares/cita | Se atenúan y adquieren opacidad al entrar | Scroll reveal / fade-in |
| Iconos del proceso | Puntos dispersos que se conectan hasta formar diagramas | Particle/line diagram assembly |
| Fondo | Nodos y aristas tenuemente animados | Ambient connected-particle mesh |
| Logos de clientes | Repetición horizontal con posiciones cambiantes | Logo marquee-like strip |
| Casos de proyecto | Botón lima + botón de contorno con flecha diagonal | Primary/secondary CTA pair |
| Contacto | Campos por pares y widget de verificación | Two-column form + anti-bot widget |

## 7. Lenguaje creativo: recursos concretos, sin evaluarlos

1. **Motivo gráfico reutilizado:** el monograma KO aparece en escala monumental en hero y footer, y a escala reducida en cabecera.
2. **Motivo generativo aparente:** la misma gramática de puntos, aristas y nodos lima aparece en fondos y pequeños diagramas, aunque no se verifica que compartan código.
3. **Narrativa visual en capas:** afirmación inicial → prueba social → retrato/manifiesto → servicios → proceso → competencias → testimonios → trabajos → contacto.
4. **Contraste entre masa tipográfica y silencio visual:** los títulos muy grandes conviven con superficies prácticamente vacías.
5. **Información comercial integrada en portafolio:** un servicio concreto de UX-Audit tiene visualización de producto, plazo indicado, precio y CTA, además de la explicación general de servicios.
6. **Tratamiento editorial de proyectos:** imágenes de carácter distinto (fotografía a color, retrato monocromático, captura de interfaz) en retícula asimétrica.
7. **Testimonios literalmente representados como voz:** tarjetas con forma de bocadillo y atribución externa.
8. **Cuatro pasos convertidos en sistema de iconografía animada:** diagramas abstractos propios en lugar de iconos convencionales.
9. **Consistencia de CTA:** mismo acento lima para acciones principales y estilo delineado para acciones secundarias.
10. **Cierre circular de identidad:** el final recupera el lenguaje visual con el que comienza la navegación.

## 8. Marcas de tiempo de la grabación

| Intervalo aprox. | Qué se ve | Movimiento o transición notable |
|---|---|---|
| 0–12 s | Hero KO, titular, descripción | Partículas/red cambian suavemente mientras el sitio queda casi quieto |
| 12–18 s | Desplazamiento hero y cabecera | Aparición de marca pequeña y CTA de cabecera; desplazamiento vertical |
| 18–22 s | Franja de clientes, comienzo del retrato | Repetición de logos; comienza aparición de cita |
| 22–28 s | Retrato + cita | Texto de cita pasa de atenuado a visible; nodos de fondo |
| 29–32 s | Tarjetas de servicios | Entradas/separación de módulos durante scroll |
| 32–37 s | Promoción UX-Audit | Tarjeta negra de ancho amplio con mockup y precio |
| 38–44 s | Proceso de cuatro pasos | Diagramas lineales y jerarquía numerada |
| 44–49 s | Experiencia, método, handwerk, IA, prototipado | Continuidad de grid editorial |
| 50–53 s | Testimonios | Tres tarjetas tipo bocadillo, atribución inferior |
| 54–68 s | Ventures y Creative Table | Imágenes y tarjetas editoriales en dos columnas |
| 69–72 s | Contacto | Campos, verificación Cloudflare y botón de envío |
| 73–79 s | Footer con KO grande | Red de nodos animada; desaparición del logo pequeño en cabecera |
| 79–81 s | Clic en «Leistungen» desde footer | Scroll acelerado pasando por secciones hasta servicios; hover lima |
| 82–83 s | Paso por UX-Audit y salto a «Arbeitsweise» | Vista promocional a dos columnas; cambio momentáneo de CTA de cabecera |
| 83–84 s | Trabajo/proceso recuperado | Texto atenuado que gana opacidad y nubes de puntos que forman diagramas |
| 84–87,75 s | Navegación a «Erfahrung» y «Kontakt» | Subrayado lima al hover y saltos de sección |

## 9. Aspectos que la grabación no permite verificar

- Nombre real de fuente o pesos CSS exactos; códigos de color oficiales, unidades `rem`, breakpoints o padding real.
- Estructura HTML, semántica ARIA, tab order, navegación por teclado y comportamiento de lector de pantalla.
- Adaptación responsive para tablet/móvil; la grabación solo muestra una vista de escritorio panorámica.
- Rendimiento de animación, consumo de CPU/GPU, tratamiento `prefers-reduced-motion` o *fallbacks*.
- Si los gráficos son Canvas 2D, SVG, WebGL, vídeo, imágenes animadas o combinación.
- Si el scroll usa CSS `scroll-behavior`, JavaScript o una librería; solo se observa la transición visual.
- Si los enlaces de proyectos abren pestaña, modal, caso local o URL externa; los destinos no se visitaron.
- Si los logos se desplazan indefinidamente y a qué velocidad exacta.
- Función del selector DE/EN y calidad/alcance de traducciones, porque no se pulsa.
- Validaciones del formulario y resultado de un envío real, porque no se introducen ni mandan datos.
- Resolución/formato reales de fotografía, contenido de los informes de UX-Audit, ni existencia de una galería adicional.

## 10. Vocabulario indexable para Claude

**Arquitectura:** one-page portfolio, anchor navigation, persistent header, hero, social proof, service cards, featured offer, process grid, capabilities grid, testimonial section, editorial project showcase, contact form, brand footer.  
**UI:** dark theme, near-black surfaces, neon-lime accent, neo-grotesque typography, oversized headline, asymmetrical composition, negative space, pill CTA, secondary outlined CTA, rounded cards, fine separators, speech-bubble cards, layered mockups.  
**Motion:** ambient particle network, node-edge graph, proximity-link mesh, scroll reveal, opacity tween, particle-to-diagram assembly, hover underline, smooth-scroll-like anchor transition, context-dependent header state, marquee-like logo strip.  
**Arte e identidad:** geometric KO monogram, repeated brand motif, connected-node visual language, editorial portrait, photographic contrast, abstract process iconography, bookend brand composition.

**Fin del inventario.** Este archivo describe lo observable y deliberadamente no determina si los elementos deberían copiarse, modificarse o descartarse en otro portafolio.
