# Privacy — WhatsApp AI business communication section (2026-11-02)

Nueva sección §12a en las tres declaraciones de privacidad, para cubrir el
sistema de comunicación por WhatsApp de Salas UG con asistencia de IA antes de
que reciba el primer mensaje de un cliente real.

| Commit | Página |
|---|---|
| `d76b179` | `/datenschutz/` (DE, original vinculante) |
| `3072baf` | `/privacy/` (EN) |
| `68599d7` | `/es/privacidad/` (ES) |

Tres archivos tocados, ninguno más. `/impressum/` sin cambios.

---

## Decisión de numeración: §12a, no renumerar

La decisión estructural de la sesión. Las páginas van numeradas 1–19 (más un
`14a` ya existente) y cada apartado es un `<section class="legal">` con su `h2`.

Insertar la sección nueva como §13 y correr 13→20 habría obligado a reescribir
todas las referencias internas:

```
$ grep -o 'Abschnitt [0-9a-z]*' datenschutz/index.html | sort | uniq -c
   4 Abschnitt 3      1 Abschnitt 7     1 Abschnitt 10
   2 Abschnitt 12     6 Abschnitt 13    2 Abschnitt 14    3 Abschnitt 14a
```

Son 19 referencias solo en DE, más las equivalentes en EN y ES. El riesgo de
dejar una suelta en un documento legal no compensa.

**El `14a` que ya existía es el precedente de la propia página** para insertar
sin tocar la numeración. La sección nueva es `12a`, detrás de §12 Formulario de
contacto, donde además le corresponde temáticamente: §11 correo, §12
formulario, §12a WhatsApp — los tres canales de contacto seguidos.

Orden verificado en el DOM de los tres idiomas: `12. → 12a. → 13.`

---

## Resolución de duplicados

El punto 5 del encargo. Cuatro solapamientos posibles, resueltos así:

### Ihre Rechte → referencia cruzada, no se duplica

§4 «Ihre Rechte als betroffene Person» ya enumera **los seis derechos completos
con su artículo**: Art. 15, 16, 17, 18, 20 y 21 DSGVO. Es exactamente el mismo
contenido que traía el texto facilitado.

El texto del encargo preveía este caso («If the current /datenschutz/ already
has a global "Ihre Rechte" section, don't duplicate — instead reference it»).
Aplicado: §12a lleva un `h3` «Ihre Rechte» cuyo cuerpo remite a §4, pero
**conserva la cadena `Art. 15–21 DSGVO` verbatim**, que era requisito.

> Für die über WhatsApp verarbeiteten Daten gelten dieselben Betroffenenrechte
> wie für jede andere Verarbeitung durch uns: … nach Art. 15–21 DSGVO. Siehe
> Abschnitt 4 — Ihre Rechte als betroffene Person.

### Autoridad de control → referencia cruzada, no se duplica

El texto facilitado cerraba con el párrafo de la Berliner Beauftragte für
Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin. **§6 ya
contiene esa autoridad con esa misma dirección**, y además con el matiz legal
completo (Mitgliedstaat des Aufenthalts / Arbeitsplatzes / Orts des Verstoßes).

Repetirla habría creado dos direcciones de autoridad en el mismo documento, con
el riesgo de que diverjan al actualizar una sola. §12a remite a §6.

### Hosting → subsección propia, no toca §7

§7 «Hosting und Content Delivery Network» es **Cloudflare, para el sitio web**.
Hetzner es **el backend de WhatsApp**: otro proveedor, otro servicio, otro
ámbito de datos. Meterlo en §7 habría mezclado dos cosas distintas bajo un
encabezado que dice CDN.

Va como `h3` «Hosting und Speicherort (WhatsApp-Daten)» dentro de §12a, con el
ámbito marcado en el propio título.

### Speicherdauer → subsección propia, §16 ya lo prevé

§16 abre con:

> Soweit innerhalb dieser Erklärung **keine speziellere Speicherdauer genannt
> wird**, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck …

Es decir: la página ya está construida para que apartados concretos declaren su
propio plazo, y §16 actúa de cláusula residual. La subsección «Speicherdauer
(WhatsApp-Nachrichten)» es precisamente esa *speziellere Speicherdauer*.

**No se tocó §16.** Su cláusula residual ya remite correctamente sin necesidad
de enumerar cada excepción; añadir un puntero habría sido ruido.

---

## Estructura antes / después

Idéntica en los tres idiomas (solo cambian los títulos).

```
antes                                después
 …                                    …
 11. Kontaktaufnahme per E-Mail        11. Kontaktaufnahme per E-Mail
 12. Kontaktformular                   12. Kontaktformular
                                       12a. Geschäftskommunikation über WhatsApp   <- nuevo
                                            ├ (intro + datos + base jurídica)
                                            ├ h3 Einsatz eines KI-gestützten Assistenzsystems
                                            ├ h3 Hosting und Speicherort (WhatsApp-Daten)
                                            ├ h3 Empfänger und Auftragsverarbeiter
                                            ├ h3 Speicherdauer (WhatsApp-Nachrichten)
                                            └ h3 Ihre Rechte  -> remite a §4 y §6
 13. Reichweitenmessung mit GA4        13. Reichweitenmessung mit GA4
 …                                     …
```

| Idioma | `h2` | `h3` |
|---|---|---|
| DE | 12a. Geschäftskommunikation über WhatsApp | Einsatz eines KI-gestützten Assistenzsystems · Hosting und Speicherort (WhatsApp-Daten) · Empfänger und Auftragsverarbeiter · Speicherdauer (WhatsApp-Nachrichten) · Ihre Rechte |
| EN | 12a. Business communication via WhatsApp | Use of an AI-assisted system · Hosting and storage location (WhatsApp data) · Recipients and processors · Retention period (WhatsApp messages) · Your rights |
| ES | 12a. Comunicación de negocio por WhatsApp | Uso de un sistema de asistencia basado en IA · Alojamiento y lugar de almacenamiento (datos de WhatsApp) · Destinatarios y encargados del tratamiento · Plazo de conservación (mensajes de WhatsApp) · Sus derechos |

---

## Términos legales conservados verbatim

Comprobado **sobre el texto renderizado**, no sobre el fuente: el HTML parte
líneas dentro de las frases, así que un `grep` sobre el archivo da falsos
negativos. La comprobación lee `innerText` del `<section id="whatsapp">` en
Chrome headless.

| Cadena | DE | EN | ES |
|---|---|---|---|
| `Art. 6 Abs. 1 lit. b DSGVO` | ✅ | ✅ | ✅ |
| `Art. 6 Abs. 1 lit. f DSGVO` | ✅ | ✅ | ✅ |
| `Art. 22 DSGVO` | ✅ | ✅ | ✅ |
| `Art. 15–21 DSGVO` | ✅ | ✅ | ✅ |
| `Art. 28 DSGVO` | ✅ | ✅ | ✅ |
| `Auftragsverarbeitung` | ✅ | ✅ | ✅ |
| `Industriestr. 25, 91710 Gunzenhausen` | ✅ | ✅ | ✅ |
| `Meta Platforms Ireland Ltd.` | ✅ | ✅ | ✅ |
| `Amazon Web Services EMEA SARL` | ✅ | ✅ | ✅ |
| `Hetzner Online GmbH` | ✅ | ✅ | ✅ |
| `Salas UG` | ✅ | ✅ | ✅ |
| `Amazon Bedrock` | ✅ | ✅ | ✅ |

`Auftragsverarbeitung` se mantiene en alemán en EN y ES con una glosa corta
entre paréntesis — *(processing on behalf of a controller)* / *(tratamiento por
encargo)* — para no traducir el término y que siga siendo legible.

La dirección de la autoridad de control (`Alt-Moabit 59–61, 10555 Berlin`) no
está en §12a **a propósito**: vive en §6, al que §12a remite. Ver «Resolución
de duplicados».

---

## Decisiones de integración ambiguas

### 1. `h3`: elemento nuevo en la página

La página **no tenía ningún `h3`**. Su convención para estructura interna es
`<p><strong>Etiqueta.</strong> texto</p>`, como en §13.

El contenido facilitado trae cinco bloques con título propio. Resolverlos con
`<strong>` habría producido el apartado más largo del documento sin jerarquía
navegable. El propio encargo menciona «h2/h3 hierarchy» entre las convenciones
a respetar, así que se introdujo `h3` con una regla `.legal h3` que sigue la
escala tipográfica existente (17px / 700, entre el `h2` de clamp(18–22px) y el
cuerpo de 16.5px).

**Es el único elemento nuevo introducido en el documento.**

### 2. Arreglo de espaciado que toca apartados preexistentes

Al renderizar se vio que el párrafo que sigue a una lista queda **pegado, a 0px**:
`.legal ul` solo declara margen superior y `.legal p + p` no aplica cuando el
hermano anterior es un `<ul>`.

Medido antes del arreglo:

```
§4    0px   <-- pegado      (preexistente)
§8    0px   <-- pegado      (preexistente)
§12a  0px   <-- pegado  ×2  (heredado por la sección nueva)
```

**No es un defecto introducido aquí**, pero la sección nueva lo heredaba.
Limitar el arreglo a `#whatsapp` habría dejado §12a con 16px y §4/§8 con 0px —
inconsistente dentro del mismo documento. Se añadió `.legal ul + p{margin-top:16px}`.

**Esto cambia el renderizado de §4 y §8, que no estaban en el encargo.** Queda
anotado aquí por si se prefiere revertir a un arreglo con ámbito. Después:

```
/datenschutz/      4=16px  8=16px  12a=16px  12a=16px
/privacy/          4=16px  8=16px  12a=16px  12a=16px
/es/privacidad/    4=16px  8=16px  12a=16px  12a=16px
```

### 3. Alcance del responsable en §2 — NO tocado, requiere criterio jurídico

**Esto sí conviene mirarlo antes de que entre el primer cliente.**

§2 «Verantwortliche Stelle» abre acotando su alcance:

> Verantwortlich für die Datenverarbeitung **auf dieser Website** im Sinne des
> Art. 4 Abs. 7 DSGVO ist: Salas UG (haftungsbeschränkt) …

El tratamiento de WhatsApp **no ocurre en esta web**. Tal como queda, el
documento describe en §12a un tratamiento que la cláusula de responsable de §2
no abarca por su propia redacción.

No se modificó, por dos razones: el texto facilitado era el autoritativo y no
incluía cambio en §2, y redactar de nuevo la cláusula de responsable de un
documento vinculante no es una decisión que deba tomarse de paso. El mismo
matiz aparece en §1 «Datenschutz auf einen Blick».

Si se confirma, el cambio es pequeño —ampliar el alcance de «auf dieser
Website» a la web **y** la comunicación comercial— pero es texto vinculante y
debería decidirse expresamente.

---

## Verificación

| Comprobación | Resultado |
|---|---|
| `/datenschutz/`, `/privacy/`, `/es/privacidad/` renderizan limpio | HTTP 200, 0 errores JS, 0 peticiones fallidas ✅ |
| Desbordamiento horizontal | ninguno, a 1280px y a 390px ✅ |
| Referencias DSGVO verbatim en los 3 idiomas | 12/12 en cada uno, sobre texto renderizado ✅ |
| Orden de apartados | `12. → 12a. → 13.` en los 3 ✅ |
| Sin duplicar §4 Ihre Rechte / §6 autoridad / §7 Cloudflare / §16 Speicherdauer | referencia cruzada o ámbito distinto, detallado arriba ✅ |
| Destinos de las referencias cruzadas existen | §4 y §6 presentes con el título citado, en los 3 ✅ |
| `/impressum/` | diff vacío ✅ |
| «Last updated» actualizado | DE November 2026 · EN November 2026 · ES noviembre de 2026 ✅ |
| JSON-LD / Schema.org afectado | 0 líneas `ld+json` en el diff; estas 3 páginas no llevan bloque ✅ |
| Archivos tocados | solo los 3 ✅ |

---

## Después del push

**No hace falta refrescar la preview social.** Ninguna meta description, title,
`og:*` ni `twitter:*` cambió en esta sesión — el diff solo contiene el cuerpo
de las tres declaraciones, su CSS y la fecha de versión.

---

## Pendiente, no es de esta sesión

- **§2 / §1 acotan el alcance a «auf dieser Website»** — ver «Decisiones de
  integración ambiguas», punto 3. Es lo único de este trabajo que puede
  necesitar una decisión jurídica antes de que S-Mobility reciba el primer
  mensaje real.
- El texto facilitado menciona que la política «describe un portafolio». Con
  §12a ya cubre el tratamiento de mensajes de WhatsApp, el asistente de IA,
  Bedrock y Hetzner. Lo que sigue sin cubrir es cualquier tratamiento que no
  pase por esos canales.
