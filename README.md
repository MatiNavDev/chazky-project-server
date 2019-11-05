## Chasky-Project-server (MERN)

Este proyecto busca poder simular que distintos usuarios quieran viajar y que otros vehiculos quieran
aceptar viajes. El mismo fue realizado utilizando Node.JS + Express para el entorno backend + MongoDB 
como base de datos, utilizando ATLAS como servicio CLOUD para alojar dicha base.

### Objetivo

La idea de esta aplicacion es poder ir eligiendo usuarios y vehiculos e ir combinando los distintos requerimientos y si el vehiculo acepta testear si puede aceptar otros usuarios.


### Estrategias utilizadas

#### Collecciones de la BD

Se utilizo un __Factory__ lo que permitia compartir de mejor manera metodos en comunes de las distintas conexiones buscando
seguir con los valores del principio "DRY". Esto permite tener una solucion mas robusta y capaz de extenderse, reduciendo
duplicacion de codigo y ademas permitiendo una facil creacion de una instancia de la coleccion.

### Respuestas al FRONT

Se busco crear un __Strategy__ en las respuestas al front el cual permite utilizar una misma funcion pero con un comportamiento
dinamico de acuerdo a como sea la respuesta (si es exitosa o si tiene error)



