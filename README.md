# 🏓 Pádel Relámpago

Sistema de gestión de torneos de pádel con almacenamiento local. Perfecto para gestión personal de torneos sin necesidad de servidor.

## ✨ Características

- 🎯 **Gestión completa de torneos** (crear, editar, eliminar)
- 📊 **Panel de control** con estadísticas
- 🏆 **Múltiples formatos** de torneo (eliminación simple, doble, etc.)
- 💾 **Almacenamiento local** - funciona offline
- 🚀 **Despliegue fácil** en Vercel
- 📱 **Responsive** - funciona en móviles
- ⚡ **Sin backend** - cero costos de servidor

## 🚀 Despliegue Rápido

### Opción 1: Vercel (Recomendado)
```bash
# 1. Clona el repositorio
git clone <tu-repo>
cd padel-relampago

# 2. Instala dependencias
npm run install:all

# 3. Construye el proyecto
npm run build

# 4. Sube a Vercel
vercel --prod
```

### Opción 2: Desarrollo Local
```bash
# 1. Instala dependencias
npm run install:all

# 2. Ejecuta en modo desarrollo
npm run dev

# 3. Abre http://localhost:5173
```

## 📁 Estructura del Proyecto

```
padel-relampago/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios de almacenamiento
│   │   ├── types/          # Tipos TypeScript
│   │   └── App.tsx         # Componente principal
│   ├── package.json
│   └── vite.config.ts
├── package.json            # Configuración raíz
└── README.md
```

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React Query + Zustand
- **Routing**: React Router
- **Build**: Vite
- **Almacenamiento**: localStorage
- **Despliegue**: Vercel

## 📊 Funcionalidades

### 🏆 Gestión de Torneos
- ✅ Crear torneos con fechas y formato
- ✅ Editar información del torneo
- ✅ Cambiar estado (Borrador, Inscripciones, En Progreso, Completado)
- ✅ Eliminar torneos
- ✅ Buscar y filtrar torneos

### 📈 Panel de Control
- ✅ Estadísticas en tiempo real
- ✅ Vista de torneos activos
- ✅ Acciones rápidas
- ✅ Resumen de equipos y partidos

### 🎯 Formatos de Torneo
- ✅ Eliminación Simple
- ✅ Eliminación Doble
- ✅ Round Robin
- ✅ Sistema Suizo

## 💾 Almacenamiento Local

Los datos se guardan en el navegador usando localStorage:

```javascript
// Ejemplo de uso
const tournaments = JSON.parse(localStorage.getItem('padel-tournaments') || '[]');
localStorage.setItem('padel-tournaments', JSON.stringify(newTournaments));
```

### Estructura de Datos
```javascript
{
  "padel-tournaments": [
    {
      "id": "torneo-123",
      "name": "Torneo de Verano",
      "description": "Torneo para todos los niveles",
      "startDate": "2024-07-15T10:00:00Z",
      "endDate": "2024-07-20T18:00:00Z",
      "maxTeams": 16,
      "status": "REGISTRATION",
      "format": "SINGLE_ELIMINATION",
      "createdBy": "system",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "_count": {
        "teams": 0,
        "matches": 0
      }
    }
  ],
  "padel-users": [...],
  "padel-teams": [...],
  "padel-matches": [...]
}
```

## 🎨 Personalización

### Colores y Temas
Edita `frontend/src/index.css` para cambiar los colores:
```css
:root {
  --primary-color: #4f46e5; /* Indigo */
  --secondary-color: #10b981; /* Green */
  --accent-color: #8b5cf6; /* Purple */
}
```

### Datos de Ejemplo
Los datos de ejemplo se cargan automáticamente en `frontend/src/services/storageService.ts`:
```javascript
export const initializeSampleData = () => {
  // Agrega aquí tus torneos de ejemplo
};
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecuta en modo desarrollo

# Construcción
npm run build        # Construye para producción
npm run preview      # Previsualiza la build

# Instalación
npm run install:all  # Instala todas las dependencias
```

## 📱 Uso

1. **Crear Torneo**: Ve a "Crear Torneo" y completa el formulario
2. **Gestionar**: Usa la lista de torneos para editar o eliminar
3. **Ver Detalles**: Haz clic en cualquier torneo para ver su información
4. **Cambiar Estado**: Usa los botones de estado en la página de detalles

## ⚠️ Limitaciones

- 📱 **Datos locales**: No se sincronizan entre dispositivos
- 👥 **Sin colaboración**: Cada usuario tiene su propia copia
- 💾 **Límite de almacenamiento**: Depende del navegador (~5-10MB)
- 🔄 **Sin backup automático**: Los datos se pierden al limpiar el navegador

## 🚀 Próximas Funcionalidades

- [ ] Gestión de equipos y jugadores
- [ ] Generación automática de brackets
- [ ] Seguimiento de partidos en tiempo real
- [ ] Estadísticas detalladas
- [ ] Exportar datos a CSV/PDF
- [ ] Modo offline mejorado
- [ ] Backup/restore de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
- 📧 Crea un issue en GitHub
- 💬 Abre una discusión
- 📖 Revisa la documentación

---

**¡Disfruta gestionando tus torneos de pádel! 🏓** 