# Calenda Rent a Car

MVP de plataforma de alquiler autónomo de vehículos con Next.js 15 + Firebase.

## Funcional ya en el código

- Landing responsive y PWA/manifest.
- Registro e inicio de sesión con Firebase Authentication.
- Perfil de conductor con teléfono, DNI/NIE y permiso.
- Catálogo real de vehículos desde Firestore.
- Ficha de vehículo y cálculo de precio por días.
- Creación de reservas con franja de inicio/fin.
- Colección pública `availability` separada para comprobar solapamientos sin exponer datos de otros clientes.
- Área `Mis reservas`.
- Flujo de inspección inicial y final con 8 fotos obligatorias.
- Fotos almacenadas en Firebase Storage por usuario/reserva.
- Panel administrador con resumen, flota, reservas y clientes.
- Alta y edición de vehículos.
- El formulario de alta viene preparado para un Citroën C4 Cactus gasolina 2017.
- Confirmación manual, pago manual de prueba, inicio/finalización y cancelación desde admin.
- Campos preparados para `trackerId`, telemática e inmovilizador.
- Reglas de Firestore y Storage con separación cliente/admin.

## Pendiente de proveedores/hardware externos

Estas partes están representadas en la interfaz pero deliberadamente NO ejecutan acciones reales todavía:

1. Pago con Stripe y gestión real de fianza.
2. Verificación automática de DNI/carnet.
3. Integración FMC130 + CAN-CONTROL/IMMO.
4. Apertura/cierre real del coche.
5. Autorización de arranque por franja horaria.
6. Telemetría GPS/CAN real.
7. Geofence de devolución.
8. Seguro/contratos/facturación y lógica comercial definitiva.

No se expone un endpoint público de apertura del coche hasta disponer de un backend telemático autenticado y credenciales de servidor.

## Configuración de Firebase

Proyecto: `calenda-rent-a-car`.

En Firebase Console:

1. **Authentication → Sign-in method → Email/Password**: activar.
2. Crear **Cloud Firestore**.
3. Crear **Firebase Storage**.
4. Desplegar `firestore.rules`.
5. Desplegar `storage.rules`.

El archivo `lib/firebase.ts` ya contiene la configuración web del proyecto suministrada para este proyecto.

## Crear el primer administrador

Por seguridad ningún usuario puede convertirse a sí mismo en administrador desde la aplicación.

1. Registra tu cuenta normalmente en `/registro`.
2. Firebase Console → Firestore → colección `users`.
3. Abre el documento de tu UID.
4. Cambia `role` de `cliente` a `admin`.
5. Recarga `/admin`.

A partir de ahí el administrador puede asignar otros administradores desde `/admin/clientes`.

## Primer vehículo

En `/admin/vehiculos` el formulario arranca con:

- Citroën C4 Cactus
- Año 2017
- Gasolina
- Manual
- 5 plazas

Solo hay que añadir matrícula, dirección, precio definitivo y demás datos. `trackerId`, `telematicsEnabled` e `immobilizerEnabled` se usarán cuando se instale el hardware.

## Estados de una reserva

`pendiente → confirmada → activa → finalizada`

También puede pasar a `cancelada` antes de iniciar.

En el MVP el administrador marca el pago y los cambios de estado. Más adelante estos pasos se automatizan con Stripe, las inspecciones y el backend telemático.

## Inspecciones

Cada inspección exige estas 8 fotos:

- Frontal
- Trasera
- Lateral izquierdo
- Lateral derecho
- Esquina delantera
- Esquina trasera
- Interior
- Cuadro / combustible / kilómetros

Ruta de Storage:

`booking-inspections/{uid}/{bookingId}/{tipo}/...`

## Desarrollo

```bash
npm install
npm run dev
```

Build de producción:

```bash
npm run build
npm start
```

## Seguridad antes de producción

El MVP permite probar el flujo completo de software, pero antes de alquilar coches a clientes reales hay que mover a servidor la lógica crítica de precios/disponibilidad, integrar pagos, verificar identidad y carnet, añadir auditoría de órdenes telemáticas y realizar pruebas de seguridad. La inmovilización debe impedir un nuevo arranque cuando el vehículo esté detenido; nunca debe cortar un motor que esté circulando.
