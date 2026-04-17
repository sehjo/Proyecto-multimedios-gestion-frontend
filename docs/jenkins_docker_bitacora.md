# Guia de Replicacion QA: Jenkins + Docker (Frontend y Backend)

Fecha: 2026-03-16

---

## IMPORTANTE: LEE ESTO ANTES DE EMPEZAR

**¿Por qué parece que no hay que instalar ni 명령어 de Docker manualmente para el frontend?**
¡Porque esa es exactamente la magia de Jenkins! Al crear el job y darle "Build Now", Jenkins lee el archivo `Jenkinsfile`. Ese archivo ya tiene las instrucciones (`docker build`, `docker run`) y Jenkins hace todo el trabajo pesado por ti. Tú solo miras cómo se ejecuta.

Jenkins fue configurado y levantado desde el **repositorio del backend** (`ccss_consultory_bk`).
Para el frontend **no se instala Jenkins de nuevo**. Solo se crea un job nuevo en el Jenkins que ya esta corriendo.

Orden obligatorio:
1. Ir al repositorio del backend.
2. Levantar Jenkins y Docker desde ahi.
3. Desplegar el backend primero.
4. Solo despues regresar a este repo y crear el job del frontend.

---

## Pasos para replica completa (en orden exacto de ejecucion)

### Paso 1. Verificar prerequisitos

Ejecutar en PowerShell:

```powershell
node -v
npm -v
wsl --status
wsl -l -v
docker --version
docker compose version
docker ps
```

Notas:
1. Si Docker no responde, abrir Docker Desktop y esperar que quede en running.
2. Si WSL no aparece en version 2, corregir eso antes de seguir.

### Paso 2. Validar que Jenkins y Backend ya esten activos

> IMPORTANTE: Se asume que ya se siguio la guia del backend (`docs/backend_jenkins_docker_guia.md`) y que Jenkins ya esta corriendo, configurado y con el backend desplegado.

Ejecutar:

```powershell
docker ps
curl http://localhost:8000/up
```

Resultado esperado:
1. Contenedores jenkins, ccss-backend-app y ccss-mysql visibles y corriendo.
2. Jenkins responde en http://localhost:8080.
3. /up responde correctamente (Application up).

### Paso 3. Crear el job del frontend en Jenkins

> CRITICO: Jenkins ya esta corriendo. No instalar Jenkins de nuevo.
> Solo crear un nuevo job de pipeline en el Jenkins existente.

En Jenkins:
1. Nueva Tarea.
2. Nombre: H-CCSS-docker-jenkins (o el nombre acordado).
3. Tipo: Pipeline.
4. En **Pipeline** -> **Definition**: seleccionar `Pipeline script from SCM`.
5. **SCM**: seleccionar `Git`.
6. **Repository URL**: `https://github.com/voluntarios/ccss_consultory_fnt.git`.
7. **Credentials**: seleccionar la credencial `H-github-ccss`.
8. **Branches to build** (Branch Specifier): `*/feat/deploy-front` (asegúrate que concuerde con tu rama).
9. **Script Path**: `Jenkinsfile`.
10. Hacer clic en **Save**.
11. Hacer clic en **Build Now**.

Notas:
1. El build de Docker sucede en stage Build Docker Image.
2. El despliegue sucede en stage Deploy Container.
3. Validar que el build termine en SUCCESS.

### Paso 4. Validar frontend desplegado

Pruebas:
1. Abrir http://localhost:5173
2. Abrir http://localhost:5173/login
3. Abrir http://localhost:5173/patients

Notas:
1. Si sale 404 de Nginx en rutas SPA, verificar fallback en nginx/default.conf.

### Paso 5. Evidencia final para QA

Entregar:
1. Captura build SUCCESS frontend.
2. Captura build SUCCESS backend.
3. Captura frontend en /login sin 404.
4. Salida de curl a /up.
5. Salida de docker ps con contenedores activos.

---

## 1) Objetivo para QA
Permitir que cualquier persona de QA pueda replicar el entorno completo y validar que:

1. Frontend despliega correctamente en Docker por Jenkins.
2. Backend despliega correctamente en Docker por Jenkins.
3. Base de datos MySQL se provisiona y conecta bien con backend.
4. Rutas SPA del frontend funcionan (incluye rutas como /login).
5. API y frontend responden en puertos esperados.

## 2) Arquitectura utilizada

1. Jenkins en contenedor Docker (puerto 8080).
2. Job frontend separado y job backend separado.
3. Frontend en contenedor Nginx con build de Vite.
4. Backend en contenedor PHP/Laravel.
5. MySQL en contenedor dedicado.
6. Red Docker compartida: ccss-net.

## 3) URLs esperadas

1. Jenkins: http://localhost:8080
2. Frontend: http://localhost:5173
3. Backend: http://localhost:8000
4. Health backend: http://localhost:8000/up

## 4) Requisitos previos

1. Docker Desktop activo.
2. WSL2 habilitado.
3. Jenkins ya levantado en contenedor.
4. Credencial de GitHub creada en Jenkins:
	- Tipo: Username with password
	- Username: usuario GitHub
	- Password: token PAT de GitHub
	- ID: H-github-ccss
5. Acceso a repos frontend y backend.

## 4.1) Momento exacto donde se crea el job y se construye Docker

1. El job se crea en Jenkins antes de cualquier build:
   - Jenkins -> Nueva Tarea -> Pipeline -> nombre del job -> Save.
2. En la configuracion del job se pega el Jenkinsfile (Pipeline script).
3. Al presionar Build Now, Jenkins ejecuta stages en orden.
4. La imagen Docker se crea en el stage Build Docker Image con docker build.
5. El contenedor se levanta en el stage Deploy Container con docker run.

Importante:
1. Jenkins no es un Docker registry.
2. En este flujo, la imagen queda construida localmente en el host Docker de Jenkins.
3. Si se necesita compartir imagen con otros ambientes, hay que agregar un stage de push a Docker Hub/GHCR.

## 5) Pipeline Frontend (resumen funcional)

Resultado actual: SUCCESS.

Flujo:
1. Checkout rama feat/deploy-front con credencial H-github-ccss.
2. Build imagen Docker frontend.
3. Deploy contenedor ccss-frontend-app en puerto 5173.

Correccion aplicada importante para QA:
1. Se agrego configuracion Nginx SPA fallback para evitar 404 en /login y otras rutas cliente.
2. Archivos usados:
	- [Dockerfile](Dockerfile)
	- [nginx/default.conf](nginx/default.conf)

Comportamiento esperado:
1. http://localhost:5173 carga app.
2. http://localhost:5173/login NO debe mostrar 404 de Nginx.

## 6) Pipeline Backend (resumen funcional)

Resultado observado en log: pipeline completo exitoso.

Flujo:
1. Checkout rama feat/deploy-backend desde repo backend.
2. Build imagen ccss-backend.
3. Provision de MySQL (contenedor ccss-mysql) en red ccss-net.
4. Deploy backend (contenedor ccss-backend-app) en puerto 8000.
5. Migracion y seeding con artisan migrate:fresh --seed --force.
6. Smoke test con curl a /up desde el contenedor backend.

Conclusiones del log:
1. MySQL queda vivo y accesible.
2. Migraciones y seeders terminan OK.
3. Backend responde Application up.

## 7) Pruebas de QA obligatorias

### 7.1 Verificacion de contenedores
Ejecutar:

powershell
docker ps

Debe incluir:
1. jenkins
2. ccss-frontend-app
3. ccss-backend-app
4. ccss-mysql

### 7.2 Verificacion frontend
1. Abrir http://localhost:5173
2. Abrir http://localhost:5173/login
3. Abrir otra ruta de cliente (ejemplo /patients)

Resultado esperado:
1. Respuesta 200 y carga de app.
2. Sin pagina 404 de Nginx.

### 7.3 Verificacion backend
Ejecutar:

powershell
curl http://localhost:8000/up

Resultado esperado:
1. Estado 200
2. Mensaje Application up

### 7.4 Verificacion de login API
Ejecutar:

bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@ccss.cr","password":"Admin1234!"}'

Resultado esperado:
1. Respuesta exitosa con token (segun implementacion actual de backend).

## 8) Errores comunes y solucion

1. Error: 404 Not Found en /login del frontend.
	- Causa: Nginx sin fallback SPA.
	- Solucion: usar try_files $uri $uri/ /index.html en nginx/default.conf y rebuild frontend.

2. Error: CredentialId ... could not be found.
	- Causa: ID en pipeline distinto al ID real de Jenkins.
	- Solucion: usar exactamente H-github-ccss.

3. Error: Invalid username or token.
	- Causa: token GitHub invalido/expirado o credencial mal guardada.
	- Solucion: regenerar PAT y actualizar credencial en Jenkins.

4. Error: failed to read dockerfile.
	- Causa: build ejecutandose en carpeta incorrecta.
	- Solucion: ejecutar docker build desde la raiz correcta del repo.

5. Error SQLSTATE HY000 2002 connection refused.
	- Causa: backend intentando DB_HOST 127.0.0.1 dentro de contenedor.
	- Solucion: usar DB_HOST=ccss-mysql en red ccss-net.

6. Error: `fatal: not in a git directory` o fallos en checkout (SCM).
	- Causa: El workspace temporal de Jenkins quedó corrupto por ejecuciones anteriores (ej. un `deleteDir()` viejo).
	- Solucion rápida (ejecutar en PowerShell para limpiar cache y workspace del frontend):
	  ```powershell
	  docker exec -u 0 jenkins sh -c "rm -rf /var/jenkins_home/caches/git-*"
	  docker exec -u 0 jenkins sh -c "rm -rf /var/jenkins_home/workspace/H-CCSS-docker-jenkins*"
	  docker restart jenkins
	  ```
	  Luego intentar el "Build Now" de nuevo.

## 9) Comandos de referencia para replicar

### 9.1 Validacion de entorno

powershell
node -v
npm -v
wsl --status
wsl -l -v
docker --version
docker compose version
docker ps

### 9.2 Levantar Jenkins

powershell
docker volume create jenkins_home
docker run -d --name jenkins --restart unless-stopped -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

### 9.3 Habilitar Docker dentro de Jenkins

powershell
docker stop jenkins
docker rm jenkins
docker run -d --name jenkins --user root --restart unless-stopped -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts
docker exec jenkins bash -lc "apt-get update && apt-get install -y docker.io"
docker exec jenkins sh -c "docker --version"

### 9.4 Comandos ejecutados por pipeline frontend

bash
docker build -t ccss-frontend:latest .
docker rm -f ccss-frontend-app || true
docker run -d --name ccss-frontend-app -p 5173:80 ccss-frontend:latest

### 9.5 Comandos ejecutados por pipeline backend

bash
docker build -t ccss-backend:latest -f init/Dockerfile init
docker network inspect ccss-net || docker network create ccss-net
docker rm -f ccss-mysql || true
docker run -d --name ccss-mysql --network ccss-net -e MYSQL_ROOT_PASSWORD=root_ccss_123 -e MYSQL_DATABASE=db_ccss -e MYSQL_USER=ccss_user -e MYSQL_PASSWORD=ccss_pass_123 mysql:8.0
docker rm -f ccss-backend-app || true
docker run -d --name ccss-backend-app --network ccss-net -p 8000:8000 -e DB_CONNECTION=mysql -e DB_HOST=ccss-mysql -e DB_PORT=3306 -e DB_DATABASE=db_ccss -e DB_USERNAME=ccss_user -e DB_PASSWORD=ccss_pass_123 -e SESSION_DRIVER=file -e CACHE_STORE=file -e QUEUE_CONNECTION=sync ccss-backend:latest
docker exec ccss-backend-app php artisan migrate:fresh --seed --force
docker exec ccss-backend-app sh -lc "curl -fsS http://127.0.0.1:8000/up"

## 10) Evidencia minima que QA debe entregar

1. Captura de build SUCCESS de frontend.
2. Captura de build SUCCESS de backend.
3. Captura de http://localhost:5173/login cargando app (sin 404 Nginx).
4. Captura o salida de curl a http://localhost:8000/up con respuesta correcta.
5. Salida de docker ps con los 4 contenedores clave.

## 11) Estado final esperado

1. Frontend accesible en puerto 5173.
2. Backend accesible en puerto 8000.
3. Base MySQL activa en red ccss-net.
4. Jenkins operativo para redeploy con Build Now.
5. Entorno replicable por QA usando este documento.

<!-- Seccion de pasos completos al inicio del documento -->
