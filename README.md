# Cloud Computing - Getaway (G7)

## Autores

- [Tomas Alvarez Escalante (60127)](https://github.com/tomalvarezz)
- [Lucas Agustin Ferreiro (61595)](https://github.com/lukyferreiro)
- [Roman Gomez Kiss (61003)](https://github.com/rgomezkiss)

## Requisitos

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
- [AWS Cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Node.js](https://nodejs.org/en/download/prebuilt-installer)

## Ejecución del proyecto

1. Crear archivo `terraform.tfvars` con las siguientes variables:
    - `aws_region`: region de AWS a deployar.
    - `project_name`: nombre del proyecto (debe ser unico).
    - `admin_password`: contraseña del administrador.

2. Configurar las credenciales del usuario de AWS a utilizar en el archivo ~/.aws/credentials.
3. Ejecutar `deploy.sh` (Linux) o `deploy.bat` (Windows)

Básicamente, el deploy consiste en crear la carpeta /build del frontend que será pusheada en el bucket S3 para hostear la página web y luego aplicar los comandos de terraform para desplegar la arquitectura. Los comandos que realiza el ejecutable son:

```bash
cd frontend && npm install && npm run build
```

```bash
terraform -chdir=backend init
```

```bash
terraform -chdir=backend apply -auto-approve
```

Tras aplicar esto último, podremos observar en consola el link al sitio web, el link a la API y las credenciales del Cognito User Pool. Estas variables deberan ser escritas en un archivo `.env` dentro de la carpeta `/frontend` con el siguiente formato:

- `REACT_APP_USER_POOL_ID`=XXX
- `REACT_APP_CLIENT_ID`=XXX
- `REACT_APP_API_URL`=XXX
- `REACT_APP_GOOGLE_MAPS_API_KEY`=XXX

Nota: La variable REACT_APP_GOOGLE_MAPS_API_KEY es utilizada para mostrar la ubicacion de las experiencias en un mapa. Se provee el valor utilizado por nosotros AIzaSyDYTmGoct4rNAA0rD3ZVcIqMLuu82Zruqg.

Tras esto se deberá realizar el `npm run build` de la aplicación nuevamente y desplegar la arquitectura con `terraform apply` para establecer el link a la API y las credenciales de Cognito (esto es únicamente para actualizar el frontend con el link y las credenciales).

Por ultimo, se debera ingresar a la consola de AWS y ejecutar manualmente la funcion lambda "location_data_loader" para poblar la tabla de localidades. Queda como mejora realizar esto automaticamente.

## Descripción de módulos utilizados

### Módulo vpc

Módulo encargado de crear una VPC con subredes privadas, recibiendo como variable la cantidad de AZ a desplegar según las que estén disponibles en la región. También crea las tablas de ruteo para dichas subredes y los Gateway VPC endpoints necesarios (para comunicarse con el S3 de imágenes y con DynamoDB).

### Módulo static site

Módulo utilizado de `terraform-aws-modules/s3-bucket/aws` para la configuración del bucket para el sitio estático y los logs de este. Este módulo también se encarga de la subida de los archivos del sitio, recibiendo el path al /build del frontend para recorrer todos los archivos y subirlos a S3 con su correspondiente MIME Type.

### Módulo image bucket

Módulo utilizado de `terraform-aws-modules/s3-bucket/aws` para la configuración del bucket para las imagenes.

### Módulo dynamodb

Módulo utilizado para crear una tabla de DynamoDB. Recibe un objeto **table** donde se declara el nombre de la tabla, la PK, la SK, los GSI y los LSI correspondientes.

### Módulo cognito

Módulo utilizado para configurar un User Pool para gestionar la autenticación de usuarios externos dentro de la aplicación. Se habilitan flujos de OAuth y la integración con proveedores de identidad como Cognito. También se otorgan permisos para que el pool invoque a la función lambda posterior a la confirmación de usuarios. Por último, se define un usuario administrador, donde se especifican su correo, contraseña y su rol "admin".

### Módulo waf

Módulo encargado de crear una Web Application Firewall (WAF) para proteger la API de posibles ataques de denegación de servicio (DoS) y tráfico malicioso. Este módulo implementa reglas basadas en límites de solicitudes (rate-based rules) para mitigar ataques de IPs tanto de países específicos como de otros países globalmente, permitiendo bloquear IPs que excedan los umbrales de solicitudes configurados.

### Módulo lambda

Módulo utilizado para definir la creación de una función lambda. El módulo se encarga de empaquetar el código fuente (mediante la función **archive_file**) en un archivo ZIP y desplegarlo en una función lambda; y decimos que es configurable en el sentido de que permite el empaquetamiento ya sea desde un archivo único o una carpeta completa. El módulo permite definir el nombre de la función, el rol de IAM asociado, el entorno de ejecución (runtime), las variables de entorno, y especificar configuraciones de red como subnets y security groups para ejecutar la función en una VPC. Además, el módulo está configurado para recrear la función antes de eliminar la versión anterior, evitando así tiempos de inactividad de la función y minimizando cualquier posible impacto en los servicios dependientes de la función Lambda.

### Módulo api gw

Módulo utilizado para crear y desplegar una API REST que se integra con funciones Lambda como endpoints REST y utiliza un Cognito User Pool para autenticación. Utiliza un archivo OpenAPI mediante el cual se define la estructura de la API, sus métodos, responses, headers e integración dinámica con las funciones Lambda. El módulo también gestiona permisos para que API Gateway pueda invocar las Lambdas correspondientes y habilita el CORS para las gateway responses de la API.

#### Archivo OpenAPI

API Gateway ofrece extensiones para utilizar junto con OpenAPI. Por un lado, se utiliza la propiedad `x-amazon-apigateway-integration` para realizar la integracion del tipo **aws_proxy** con la funcion lambda encargada de manejar la logica de negocio correspondiente al endpoint solicitado. Ademas, para asegurar la correcta validación de las solicitudes entrantes, se implementaron validadores de solicitud mediante la propiedad `x-amazon-apigateway-request-validators`, donde se establece un validador llamado **all**, que garantiza que tanto el body de la solicitud como los parámetros sean validados antes de ser procesados (para aplicar dicho validador a todos los métodos se utiliza la extensión `x-amazon-apigateway-request-validator`). Tambien se implementó un Cognito User Pool Authorizer con la extensión `x-amazon-apigateway-authorizer` para autenticar las solicitudes a la API con Cognito. La configuración se define a través de la propiedad `x-amazon-apigateway-authtype`, que especifica el tipo de autenticación como **cognito_user_pools**.

## Descripción de funciones utilizadas

- <ins>**cidrsubnet**</ins>: usado para particionar el CIDR asignado a la VPC de forma programática en función de la cantidad de subredes a utilizar.
  - [modules/vpc/main.tf](backend/modules/vpc/main.tf#L17)
- <ins>**fileset**</ins>: usado para recorrer el directorio provisto con los archivos del sitio estático y levantar todos los archivos asociados a una extensión.
  - [modules/static_site/locals.tf](backend/modules/static_site/locals.tf#L20)
- <ins>**flatten**</ins>: usado para unificar una lista de listas en una única lista.
  - [modules/static_site/locals.tf](backend/modules/static_site/locals.tf#L18)
- <ins>**filemd5**</ins>: usado para hashear el contenido de cada archivo que se carga al sitio estático.
  - [modules/static_site/upload.tf](backend/modules/static_site/locals.tf#L9)
- <ins>**sha1**</ins> y <ins>**jsonencode**</ins>: usadas en conjunto para detectar cambios de contenido en la API definida en [api.openapi.yml](backend/resources/api.openapi.yml) para así realizar un deploy de esta.
  - [modules/api_gw/main.tf](backend/modules/api_gw/main.tf#L27)
- <ins>**file**</ins>: usado para leer el archivo [api.openapi.yml](backend/resources/api.openapi.yml)
- <ins>**merge**</ins>: usado para unificar dos mapas en un único mapa. Se usa para juntar los ARN de las lambdas y del user pool de cognito que son reemplazados en [api.openapi.yml](backend/resources/api.openapi.yml).
  - [modules/api_gw/data.tf](backend/modules/api_gw/data.tf#L3)
  - [modules/api_gw/data.tf](backend/modules/api_gw/data.tf#L2)
- <ins>**lookup**</ins>: usado para devolver el valor de un elemento de un mapa a partir de su clave (en caso de que no existe, se retorna un valor default).
- <ins>**index**</ins>: usado para obtener la posición de la regla actual de la lista **managed_rules**, y asignar esa posición más un valor (10) como la prioridad de la regla dentro de la configuración del WAF.
  - [modules/waf/main.tf](backend/modules/waf/main.tf#83)

## Descripción de meta-argumentos utilizados

- <ins>**count**</ins>: se utilizó para crear las subredes privadas dinámicamente según la cantidad de AZs especificadas.especificadas.
- <ins>**for_each**</ins>: se utilizó para:
  - Facilitar la creación de Lambdas utilizando nuestro módulo propio.
  - Realizar la asignación de permisos de las Lambdas invocadas por la API GW.
  - Iterar sobre varias gateway responses de API GW para aplicarle los headers de CORS.
  - Facilitar la creación de las tablas de DynamoDB utilizando nuestro módulo propio.
  - Facilitar la creación de los Gateway VPC Endpoints en nuestro módulo propio de VPC.
- <ins>**depends_on**</ins>: se utilizó para:
  - Asegurarse de que el módulo de Cognito y WAF se terminen de crear para utilizar los respectivos ARN's en el módulo de API GW.
  - Asegurarse de que el recurso aws_api_gateway_rest_api esté creado antes de realizar el deploy de la API.
  - Asegurarse de que el user pool client de Cognito esté creado antes de crear el usuario admin.
  - Asegurarse de que el archivo ZIP que contiene el código de la Lambda se haya creado correctamente antes de asignarlo como filename a la función.
- <ins>**lifecycle**</ins>: se utilizó para especificarle a Terraform que el recurso de API GW y el recurso de función Lambda se deben crear de nuevo antes de eliminar el recurso existente. De esta forma se evitan tiempos de inactividad de la función y de la API al minimizar cualquier posible impacto en los servicios dependientes de estos recursos.

## Diagrama de arquitectura

![Arquitectura](assets/arquitectura.jpg)
