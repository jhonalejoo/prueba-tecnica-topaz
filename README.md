# Prueba Tecnica Topaz

Aplicacion React Native basada en DummyJSON.

## Decisiones tecnicas

### Estado: Zustand + React Query

Se eligio Zustand junto con TanStack Query.

- Zustand queda reservado para estado global de UI y negocio local, como favoritos.
- React Query resuelve cache, sincronizacion, paginacion infinita, estados de carga y reintentos sobre datos remotos.
- Esta separacion evita sobrecargar el store con estado de networking y mantiene cada responsabilidad en la capa correcta.

### Persistencia local: MMKV

Se eligio `react-native-mmkv` para favoritos por rendimiento y simplicidad.

- La lectura y escritura son sincronas y rapidas para un dato pequeno y frecuente como favoritos.
- Permite que la pestaña de Favoritos renderice solo desde almacenamiento local, sin backend ni cloud.
- Se integra bien con Zustand mediante persistencia custom, manteniendo actualizacion reactiva entre pantallas.

### Networking: axios

Se eligio axios por tres motivos concretos.

- Permite centralizar `baseURL`, `timeout` e interceptores en un cliente unico.
- Simplifica el manejo consistente de errores HTTP, de red y timeout.
- Soporta `AbortController` mediante `signal`, que se integra bien con React Query para cancelar requests al desmontar componentes o invalidar queries.

### Cache de imagenes: @d11/react-native-fast-image

Se usa `@d11/react-native-fast-image` para cache nativo de imagenes remotas y mejor estabilidad en listas largas frente al componente `Image` base.

## Alcance implementado

- Bottom Tab Navigator con 3 tabs.
- Stack Navigator anidado para Productos.
- Tipado de navegacion con `RootTabParamList` y `ProductsStackParamList`.
- Pantalla de productos con:
  - `FlatList`
  - paginacion infinita con `limit` y `skip`
  - busqueda con debounce de 400 ms
  - filtro por categoria cargado desde API
  - exclusividad entre busqueda y categoria
  - estados de carga, error, vacio y reintento
  - indicador y toggle de favoritos
  - navegacion al detalle
- Error Boundary global basico.
- Cliente HTTP centralizado con manejo normalizado de errores.
- Persistencia local de favoritos con MMKV.

## Endpoints usados

- `GET /products`
- `GET /products/{id}`
- `GET /products/search?q=`
- `GET /products/categories`
- `GET /products/category/{cat}`

## Ejecutar el proyecto

```sh
npm install
```

Para iOS, despues de instalar dependencias JS:

```sh
cd ios
bundle exec pod install
```

Luego:

```sh
npm start
npm run ios
```

o

```sh
npm run android
```

## Nota de entorno

React Native 0.81 pide Node `>= 20.19.4`. En este workspace se detecto Node `20.17.0`, que instala paquetes con warning de engine. Conviene subir Node antes de ejecutar la app en local para evitar problemas de toolchain.
