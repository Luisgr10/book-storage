
# BookStorage

plicación técnica para la gestión de almacenamiento de libros. Este proyecto está compuesto por un frontend desarrollado con Expo y React Native, y un backend construido con Express y Firebase.



## Tecnologías Usadas

En el desarrollo de **Book Storage** se han utilizado las siguientes tecnologías:

### Frontend

- ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)  

  
- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  


- ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  


- ![React Navigation](https://img.shields.io/badge/React_Navigation-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
 

### Backend

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)  


- ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)  
 

- ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)  


- ![Nodemon](https://img.shields.io/badge/Nodemon-76d04b?style=for-the-badge&logo=nodemon&logoColor=white)  
  

### Otros

- ![dotenv](https://img.shields.io/badge/Dotenv-000000?style=for-the-badge&logo=dotenv&logoColor=white)  
 





## Requisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org) (versión LTS recomendada)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase](https://firebase.google.com) (para las credenciales de Firebase)

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Clonar el Repositorio

Clona el repositorio a tu máquina local y accede al directorio del proyecto:

```bash
git clone https://github.com/Luisgr10/book-storage.git
cd book-storage
```
### 2. Instala las dependencias:

```bash
npm install
```

#### 1. Crea el archivo .env para el backend:

Copia el archivo .env.example a un nuevo archivo llamado .env en la raíz del directorio.

#### 2. Configura las variables:

Abre el archivo .env en la raíz del directorio backend y reemplaza los valores de ejemplo con tus credenciales de Firebase y la ruta a tu archivo firebase.json.

```bash
### Ruta al archivo de credenciales de Firebase
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/firebase.json"

### Credenciales de Firebase
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
````

## Uso
Para iniciar la aplicación, puedes usar los siguientes comandos:

```bash
//Frontend
npm run start
````
Iniciar el servidor de desarrollo:

```bash
//Backend
npm run dev
```

## Scripts Disponibles

En el proyecto, puedes ejecutar los siguientes scripts:

- npm run start: Inicia la aplicación con Expo
- npm run android: Inicia la aplicación en un dispositivo Android
- npm run ios: Inicia la aplicación en un dispositivo iOS
- npm run web: Inicia la aplicación en un navegador web
- npm run dev: Inicia el servidor de desarrollo con nodemon
## API Reference

### Obtener todos los libros

```http
  GET /books
  ```

###  Obtener un libro 
```http
  GET /book/:id
```
### Crear un libro 
```http
  POST /book
````
### Actualizar un libro 
```http
  PUT /book/:id
````
### Eliminar un libro 
```http
  DELETE /book/:id
```

### Subir multiples libros 
```http
  POST /uploadBooks
```



## Authors

- [@luisgr10](https://www.github.com/luisgr10)

