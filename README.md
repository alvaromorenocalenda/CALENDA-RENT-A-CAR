# Calenda Rent a Car

Base inicial de la plataforma de alquiler autónomo de vehículos.

## Incluido en esta primera versión

- Landing responsive.
- Buscador visual de vehículos.
- Catálogo de vehículos de demostración.
- Registro e inicio de sesión con Firebase Authentication.
- Creación del perfil de usuario en Firestore.
- Panel administrador inicial.
- Configuración de Firebase para Auth, Firestore y Storage.
- Reglas iniciales de Firestore y Storage.

## Firebase

Proyecto configurado: `calenda-rent-a-car`.

Antes de probar registro/login en producción:

1. Firebase Console > Authentication > Sign-in method.
2. Activar `Email/Password`.
3. Crear Firestore Database.
4. Crear Firebase Storage.
5. Desplegar las reglas incluidas en `firestore.rules` y `storage.rules`.

## Desarrollo local

```bash
npm install
npm run dev
```

## Próximas fases

1. Vehículos y disponibilidad reales desde Firestore.
2. Reservas por fecha/hora y prevención de solapamientos.
3. Área privada del cliente y `Mis reservas`.
4. Verificación de DNI/carnet.
5. Pagos y fianza.
6. Inspección fotográfica inicial/final.
7. Geolocalización y zona permitida de devolución.
8. Integración telemática para GPS, apertura/cierre e inmovilización.
9. Historial de eventos y auditoría.
10. Panel administrador completo.

> Nota: los vehículos, matrículas y estados mostrados actualmente son datos de demostración. Los botones de control remoto del panel admin están deshabilitados hasta integrar el hardware/servidor telemático.
