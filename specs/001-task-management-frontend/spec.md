# Feature Specification: Task Management Frontend

**Feature Branch**: `001-task-management-frontend`

**Created**: 2026-07-30

**Status**: Draft

**Input**: User description: "Especificación funcional — Frontend Angular para gestión de tareas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar y entender las tareas en tablero (Priority: P1)

Como usuario, quiero visualizar las tareas existentes en un tablero de tres columnas por estado para saber qué trabajo está pendiente, en progreso y completado.

**Why this priority**: La consulta es la capacidad base del producto y permite validar el estado de la información antes de ejecutar cualquier otra operación.

**Independent Test**: Con una colección con tareas, una colección vacía y una respuesta fallida, se puede comprobar que el usuario recibe respectivamente un tablero útil por estado, una invitación para crear una tarea y una opción de reintento.

**Acceptance Scenarios**:

1. **Given** el usuario entra a la aplicación, **When** las tareas todavía se están obteniendo, **Then** ve un indicador de carga y no ve el estado vacío al mismo tiempo.
2. **Given** existen tareas, **When** la carga termina correctamente, **Then** el usuario ve tres columnas visibles para Pendiente, En progreso y Completada, y cada tarea aparece en la columna que corresponde a su estado.
3. **Given** una columna no tiene tareas pero otras columnas sí, **When** el tablero se muestra, **Then** esa columna conserva su espacio y comunica que no contiene tareas sin ocultar las demás columnas.
4. **Given** no existen tareas, **When** la carga termina correctamente, **Then** el usuario ve un mensaje de tablero vacío que le invita a crear la primera tarea.
5. **Given** la carga falla, **When** el usuario ve la pantalla de error, **Then** recibe un mensaje comprensible y una acción para reintentar.

### User Story 2 - Crear una tarea válida (Priority: P1)

Como usuario, quiero crear una tarea con título, descripción y estado para añadir trabajo al tablero.

**Why this priority**: Crear información es necesario para que el gestor tenga utilidad operativa y completa el ciclo principal de gestión.

**Independent Test**: Se puede abrir el formulario, probar entradas válidas y no válidas, simular una respuesta exitosa y simular un rechazo conservando los datos ingresados.

**Acceptance Scenarios**:

1. **Given** el usuario abre el formulario de creación, **When** observa los campos, **Then** encuentra título, descripción y estado, con estado inicial pendiente.
2. **Given** el título está vacío, contiene solo espacios o supera 100 caracteres, **When** el usuario intenta guardar, **Then** ve un error junto al campo y no se envía la solicitud.
3. **Given** ya existe una tarea con el mismo título normalizado, **When** el usuario intenta crear otra tarea con ese título usando diferencias de mayúsculas, minúsculas o espacios externos, **Then** ve un error claro y no se envía una solicitud de creación duplicada.
4. **Given** la descripción supera 500 caracteres o el estado no es válido, **When** el usuario intenta guardar, **Then** ve el error correspondiente y la tarea no se crea.
5. **Given** el formulario es válido, **When** el usuario guarda, **Then** el control de guardado se deshabilita, se muestra progreso y se evita un segundo envío concurrente.
6. **Given** la creación termina correctamente, **When** el servidor confirma la tarea, **Then** la interfaz regresa automáticamente al tablero principal, la nueva tarea queda visible o claramente confirmada, el formulario deja de mostrarse y se muestra un mensaje de éxito.
7. **Given** la creación falla, **When** el servidor rechaza la solicitud, **Then** el formulario permanece abierto con los datos intactos y muestra un mensaje contextual.

### User Story 3 - Editar una tarea existente (Priority: P1)

Como usuario, quiero editar la información de una tarea para mantenerla actualizada.

**Why this priority**: Las tareas cambian y la edición evita que el tablero pierda vigencia.

**Independent Test**: Se puede seleccionar una tarea, comprobar que sus datos aparecen en el formulario, modificarla con datos válidos o inválidos y verificar los resultados de éxito y error.

**Acceptance Scenarios**:

1. **Given** existe una tarea, **When** el usuario selecciona editar, **Then** el formulario muestra sus valores actuales y no permite modificar su identificador ni sus fechas.
2. **Given** el usuario modifica el título, descripción o estado con datos válidos, **When** solicita guardar, **Then** ve una confirmación explícita antes de enviar la actualización.
3. **Given** la confirmación de actualización está abierta, **When** el usuario cancela, **Then** no se envía ninguna solicitud y el formulario conserva los cambios.
4. **Given** el usuario confirma la actualización, **When** el servidor responde correctamente, **Then** el tablero muestra la respuesta confirmada, el formulario se cierra y se muestra un mensaje de éxito.
5. **Given** los datos editados son inválidos, **When** el usuario intenta guardar, **Then** se muestran validaciones y no se envía la solicitud ni se abre la confirmación.
6. **Given** la tarea fue eliminada antes de guardar, **When** el servidor informa que no existe, **Then** se comunica la situación y el usuario puede actualizar el tablero.
7. **Given** la actualización falla por otra causa, **When** termina la solicitud, **Then** se conservan los cambios del formulario y la interfaz no presenta la operación como exitosa.

### User Story 4 - Eliminar una tarea de forma segura (Priority: P1)

Como usuario, quiero eliminar una tarea que ya no necesito mediante una confirmación explícita.

**Why this priority**: La eliminación es destructiva y debe proteger al usuario de pérdidas accidentales.

**Independent Test**: Se puede iniciar una eliminación, cancelar, confirmar, simular éxito y simular fallo comprobando que cada resultado conserva la integridad del tablero.

**Acceptance Scenarios**:

1. **Given** existe una tarea, **When** el usuario selecciona eliminar, **Then** ve una confirmación que identifica la tarea por su título y diferencia claramente cancelar de confirmar.
2. **Given** la confirmación está abierta, **When** el usuario cancela, **Then** no se envía ninguna solicitud y la tarea permanece sin cambios.
3. **Given** el usuario confirma, **When** la eliminación está en curso, **Then** la acción queda deshabilitada y se muestra progreso contextual sin bloquear innecesariamente toda la pantalla.
4. **Given** el servidor confirma la eliminación, **When** termina la operación, **Then** la tarea desaparece del tablero y se muestra un mensaje de éxito.
5. **Given** la eliminación falla, **When** termina la operación, **Then** la tarea continúa visible y se muestra un mensaje de error; si ya no existe, se informa y se puede actualizar el tablero.

### User Story 5 - Cambiar el estado arrastrando en el tablero (Priority: P1)

Como usuario, quiero cambiar el estado de una tarea arrastrándola entre columnas del tablero para reflejar su progreso de forma visual.

**Why this priority**: El estado expresa el flujo de trabajo y es una operación obligatoria del dominio.

**Independent Test**: Se puede arrastrar una tarea entre las columnas Pendiente, En progreso y Completada, confirmar o cancelar el cambio, observar el progreso de la tarea afectada y verificar confirmación o restauración ante una respuesta fallida.

**Acceptance Scenarios**:

1. **Given** una tarea tiene un estado válido, **When** el usuario la arrastra con el mouse a otra columna de estado permitido, **Then** se solicita confirmación antes de enviar la actualización.
2. **Given** la confirmación de cambio de estado está abierta, **When** el usuario cancela, **Then** la tarea permanece o vuelve a su columna original y no se envía la solicitud.
3. **Given** el usuario confirma el cambio de estado, **When** la actualización está en curso, **Then** la tarea afectada muestra progreso y no puede arrastrarse de nuevo hasta finalizar.
4. **Given** el servidor confirma la actualización, **When** termina la solicitud, **Then** la tarea queda ubicada en la columna confirmada y se muestra un mensaje de éxito.
5. **Given** la actualización de estado falla, **When** termina la solicitud, **Then** se conserva o restaura la columna anterior y se muestra un error.
6. **Given** el usuario no puede usar arrastre con mouse, **When** necesita cambiar el estado, **Then** dispone de una alternativa accesible por teclado que mantiene las mismas confirmaciones y reglas.
7. **Given** un estado no reconocido aparece en datos o entrada, **When** se intenta procesarlo, **Then** no se envía al servidor y se comunica el problema de forma segura.

### User Story 6 - Buscar y filtrar tareas (Priority: P2)

Como usuario, quiero buscar por nombre y filtrar tareas por estado y rango de fecha de creación con controles claros y profesionales para encontrar rápidamente las que necesito.

**Why this priority**: Mejora la consulta cuando crece el tablero, pero no debe retrasar las operaciones obligatorias.

**Independent Test**: Con una colección de tareas se puede buscar por nombre, filtrar por estado, seleccionar un rango de fecha de creación con controles tipo calendario, limpiar los filtros y comprobar estados vacíos distintos sin alterar la colección original ni romper la distribución del tablero.

**Acceptance Scenarios**:

1. **Given** existen tareas, **When** el usuario escribe un nombre o elige un estado, **Then** solo se muestran las tareas que coinciden sin cambiar la colección original.
2. **Given** la búsqueda por nombre contiene espacios externos o diferencias de mayúsculas, **When** se aplica, **Then** las coincidencias se mantienen previsibles e independientes de esos detalles.
3. **Given** existen tareas con fechas de creación distintas, **When** el usuario selecciona una fecha inicial, una fecha final o ambas mediante controles tipo calendario, **Then** solo se muestran las tareas creadas dentro del rango inclusivo elegido.
4. **Given** el usuario selecciona una fecha inicial posterior a la fecha final, **When** intenta aplicar el filtro, **Then** ve un error junto al rango y el tablero no se presenta como un resultado válido de filtro.
5. **Given** hay filtros activos por nombre, estado o rango de fecha, **When** el usuario los limpia, **Then** vuelve a ver la colección completa.
6. **Given** los filtros no producen coincidencias, **When** termina el filtrado, **Then** ve un mensaje diferente al estado global de lista vacía.
7. **Given** se crea, edita o elimina una tarea, **When** se actualiza el tablero, **Then** los filtros activos siguen funcionando con la colección vigente y comunican claramente si ocultan resultados.
8. **Given** el usuario observa la sección de filtros en escritorio o móvil, **When** interactúa con búsqueda, estado, fechas o limpieza, **Then** los controles tienen alineación consistente, etiquetas claras, estados de foco visibles y no se solapan.

### User Story 7 - Recibir retroalimentación accesible (Priority: P2)

Como usuario, quiero saber si una operación está cargando, terminó correctamente o falló para actuar con confianza.

**Why this priority**: La retroalimentación evita acciones duplicadas y permite recuperarse de errores sin perder información.

**Independent Test**: Para cada operación principal se pueden simular estados de carga, éxito y error, comprobando que la interfaz comunica el resultado y libera los controles al finalizar.

**Acceptance Scenarios**:

1. **Given** una operación está en curso, **When** el usuario observa la interfaz, **Then** ve un indicador comprensible y los controles que podrían duplicarla están deshabilitados.
2. **Given** una operación de creación, actualización, eliminación o cambio de estado requiere confirmación, **When** el usuario la inicia, **Then** ve un diálogo modal claro con acciones diferenciadas para confirmar o cancelar.
3. **Given** una operación termina correctamente, **When** el resultado se confirma, **Then** se muestra un mensaje modal breve de éxito sin depender únicamente del color.
4. **Given** ocurre un error de validación, servidor, red o tiempo de espera, **When** la interfaz lo procesa, **Then** muestra un mensaje modal seguro, contextual y con una acción de recuperación cuando corresponde.
5. **Given** cualquier operación termina con éxito o error, **When** finaliza, **Then** ningún indicador de carga queda activo indefinidamente.

### Edge Cases

- La API no está disponible, responde lentamente, agota el tiempo o devuelve una estructura inesperada.
- Una tarea se elimina en otro proceso antes de editarla, eliminarla o cambiar su estado.
- El usuario envía varias veces el formulario, la eliminación o el cambio de estado.
- El usuario arrastra una tarea a la misma columna, cancela una confirmación de arrastre o suelta la tarea fuera de una columna válida.
- El usuario necesita cambiar estado sin usar mouse.
- El título está vacío, contiene solo espacios o supera 100 caracteres.
- El usuario intenta crear una tarea con un título que ya existe usando diferencias de espacios o mayúsculas.
- La descripción supera 500 caracteres, falta o contiene texto muy largo.
- El estado recibido o seleccionado no pertenece a los valores permitidos.
- El usuario cierra el formulario con cambios sin guardar.
- Una mutación termina correctamente pero una actualización posterior del tablero falla.
- Un tablero previamente fallido se recupera al reintentar.
- No existen coincidencias mientras hay filtros activos.
- El rango de fecha de creación está incompleto, no tiene tareas coincidentes o contiene una fecha inicial posterior a la final.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El producto MUST permitir consultar las tareas existentes y mostrar un estado de carga durante la consulta inicial.
- **FR-002**: El producto MUST mostrar las tareas en un tablero con tres columnas visibles: Pendiente, En progreso y Completada; cada tarjeta MUST mostrar título, descripción cuando exista, estado legible y acciones disponibles.
- **FR-003**: El producto MUST mostrar un estado vacío con orientación para crear la primera tarea cuando no existan tareas y la carga haya terminado.
- **FR-004**: El producto MUST mostrar un error comprensible y una acción de reintento cuando no pueda cargar las tareas.
- **FR-005**: El producto MUST permitir abrir un formulario de creación con título, descripción y estado.
- **FR-006**: El producto MUST rechazar títulos vacíos, compuestos solo por espacios o de más de 100 caracteres.
- **FR-007**: El producto MUST rechazar descripciones de más de 500 caracteres y estados fuera de `pending`, `in_progress` y `done`.
- **FR-008**: El producto MUST impedir solicitudes de creación o edición cuando el formulario sea inválido.
- **FR-009**: El producto MUST conservar los datos ingresados cuando una creación o edición falle.
- **FR-010**: El producto MUST reflejar una tarea creada o editada solo después de una confirmación exitosa; después de crear correctamente, MUST regresar al tablero principal sin dejar el formulario de creación activo.
- **FR-011**: El producto MUST permitir editar una tarea sin permitir modificar su identificador ni sus fechas administradas por el servidor.
- **FR-012**: El producto MUST exigir confirmación explícita antes de eliminar una tarea e identificarla por su título.
- **FR-013**: El producto MUST dejar una tarea visible si la eliminación falla y MUST actualizar el tablero cuando el recurso ya no exista.
- **FR-014**: El producto MUST permitir cambiar el estado arrastrando una tarea entre columnas válidas del tablero y MUST impedir cambios concurrentes sobre la misma tarea.
- **FR-015**: El producto MUST conservar o restaurar la columna anterior si el cambio de estado se cancela o falla.
- **FR-016**: El producto MUST representar los estados para el usuario como Pendiente, En progreso y Completada.
- **FR-017**: El producto MUST diferenciar errores de datos inválidos, recurso inexistente, error interno, red, tiempo de espera y error inesperado mediante mensajes seguros.
- **FR-018**: El producto MUST evitar mostrar trazas técnicas o información sensible al usuario.
- **FR-019**: El producto MUST mostrar progreso visible y accesible para carga inicial, guardado, eliminación, confirmación y cambio de estado por arrastre.
- **FR-020**: El producto MUST liberar los estados de carga después de éxito o error y MUST evitar envíos duplicados.
- **FR-021**: El producto MUST ofrecer acciones con nombres descriptivos, etiquetas visibles en campos y navegación usable con teclado.
- **FR-022**: El producto MUST mantener la información y las acciones utilizables en pantallas de escritorio y móviles sin desplazamiento horizontal innecesario.
- **FR-023**: El producto MUST obtener, crear, actualizar y eliminar tareas mediante el servicio externo existente, respetando su contrato de operaciones y confirmando los resultados antes de cambiar la interfaz.
- **FR-024**: El producto MUST enviar en creación y actualización únicamente los datos permitidos: título, descripción opcional y estado válido; identificadores y fechas son administrados por el servidor.
- **FR-025**: El producto MUST permitir buscar por nombre o título de tarea, filtrar por estado y filtrar por rango de fecha de creación mediante controles tipo calendario con presentación visual consistente y amigable.
- **FR-026**: El producto MUST permitir limpiar filtros y MUST distinguir un resultado filtrado sin coincidencias de una colección global vacía.
- **FR-027**: El producto MUST conservar la consistencia de los filtros después de crear, editar o eliminar tareas, comunicando claramente cuando los filtros activos oculten resultados.
- **FR-028**: El producto MUST actualizar las especificaciones, documentación y pruebas relevantes cuando una decisión funcional cambie este alcance.
- **FR-029**: El producto MUST impedir la creación de tareas con títulos duplicados dentro de la colección conocida, comparando títulos recortados y sin distinguir mayúsculas de minúsculas.
- **FR-030**: El producto MUST validar que la fecha inicial del rango de creación no sea posterior a la fecha final y MUST mostrar un mensaje recuperable cuando el rango sea inválido.
- **FR-031**: El producto MUST solicitar confirmación explícita antes de enviar cualquier actualización de tarea, incluyendo edición de datos y cambio de estado por arrastre.
- **FR-032**: El producto MUST presentar confirmaciones, éxitos y errores mediante diálogos modales claros, accesibles y consistentes.
- **FR-033**: El producto MUST ofrecer una alternativa accesible por teclado para cambiar el estado cuando el usuario no pueda usar arrastre con mouse.

### Key Entities *(include if feature involves data)*

- **Task**: Trabajo administrable con `id`, `title`, `description` opcional, `status`, `createdAt` y `updatedAt`.
- **TaskStatus**: Estado controlado con los valores `pending`, `in_progress` y `done`, representados al usuario como Pendiente, En progreso y Completada.
- **TaskMutation**: Operación de creación, edición, eliminación o cambio de estado que debe mostrar progreso, resultado y recuperación.
- **TaskBoard**: Vista derivada que agrupa tareas en columnas por estado y permite moverlas entre columnas válidas.
- **TaskFilter**: Criterio opcional de búsqueda por nombre o título, estado y rango de fecha de creación que produce una vista derivada sin cambiar la colección original.
- **UserAlert**: Mensaje modal breve de confirmación, éxito, error o información asociado a una operación y orientado a la recuperación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En pruebas de aceptación, el usuario puede completar la consulta inicial y distinguir entre carga, tablero disponible, tablero vacío y error en el 100% de los escenarios definidos.
- **SC-002**: En pruebas de aceptación, el usuario puede crear, editar, eliminar y cambiar el estado de una tarea válida en un máximo de 3 minutos por operación, sin asistencia externa.
- **SC-003**: El 100% de los intentos con título vacío, título de solo espacios, título mayor a 100 caracteres, descripción mayor a 500 caracteres o estado inválido se bloquea antes de enviar datos.
- **SC-004**: El 100% de las operaciones fallidas de creación, edición, eliminación y cambio de estado conserva la información o estado previo requerido y comunica una recuperación apropiada.
- **SC-005**: En pruebas con al menos 50 tareas, la búsqueda por nombre y el filtrado por estado o rango de fecha de creación permiten encontrar una tarea conocida en menos de 10 segundos y diferencian correctamente cero coincidencias de una lista vacía global.
- **SC-006**: En pruebas de interacción, ningún usuario puede provocar dos solicitudes concurrentes para la misma creación, eliminación o actualización mediante clics repetidos.
- **SC-007**: En revisión manual de escritorio y móvil, todas las acciones principales, campos y mensajes permanecen utilizables sin solapamientos ni desplazamiento horizontal innecesario.
- **SC-008**: En revisión de accesibilidad, todas las operaciones principales pueden ejecutarse con teclado y cada estado de carga, éxito y error tiene una comunicación textual comprensible.
- **SC-009**: En pruebas de contrato, el 100% de las solicitudes usa la operación y la ruta esperadas, y el 100% de los estados enviados pertenece al conjunto permitido.
- **SC-010**: El README permite a una persona nueva instalar, configurar, ejecutar y probar el frontend siguiendo únicamente sus instrucciones.
- **SC-011**: En pruebas de aceptación, el 100% de los intentos de crear una tarea con un título ya existente, normalizado por espacios y mayúsculas, se bloquea sin generar una segunda tarea visible.
- **SC-012**: En pruebas de aceptación con al menos 12 tareas distribuidas en los tres estados, el usuario puede cambiar el estado de una tarea arrastrándola a otra columna y confirmando la acción en menos de 10 segundos.
- **SC-013**: En revisión visual de escritorio y móvil, la sección de filtros y el tablero mantienen alineación, espaciado y legibilidad sin solapamientos en el 100% de los controles principales.
- **SC-014**: En pruebas de interacción, cancelar una confirmación de actualización o de cambio de estado evita el 100% de las solicitudes correspondientes y conserva la tarea en su estado previo.

## Assumptions

- La API REST existente es la fuente de verdad para identificadores, fechas y confirmación de mutaciones.
- El usuario utiliza la aplicación sin autenticación, perfiles, roles ni permisos dentro de este alcance.
- El entorno de desarrollo proporciona una URL configurable para la API y el backend puede ejecutarse de forma independiente.
- Las listas son suficientemente pequeñas para consulta y filtrado del lado del cliente; no se requiere paginación en la primera versión.
- Los mensajes se presentarán en español, siguiendo los textos y etiquetas definidos en esta especificación.
- La unicidad de título se evalúa contra la colección de tareas cargada en pantalla y el backend sigue siendo la autoridad final si rechaza un duplicado concurrente.
- Los filtros por rango de fecha usan las fechas de creación administradas por el servidor y aplican rangos inclusivos por día calendario.
- El cambio de estado por tablero permite mover una tarea a cualquiera de las tres columnas válidas, siempre con confirmación previa y restauración ante cancelación o error.
- Las confirmaciones modales reemplazan las confirmaciones personalizadas previas para edición, eliminación y cambio de estado.
- El filtrado y la búsqueda son una mejora posterior y no deben retrasar la entrega de listar, crear, editar, eliminar y cambiar estado.
- Las pruebas pueden simular respuestas exitosas, errores HTTP, red y tiempo de espera sin depender de un backend real.
- La interfaz mantendrá separadas la coordinación de operaciones y la presentación, conforme a la constitución del proyecto.
