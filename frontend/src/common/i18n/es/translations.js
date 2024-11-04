export const TRANSLATIONS_ES = {

    PageName: "Getaway",

    PageTitles: {
        changePassword: "Cambiar Contraseña",
        register: "Registrarse",
        custom404: "404",
        error: "Error",
        experienceDetails: "{{experienceName}}",
        experienceForm: {
            create: "Crear Experiencia",
            edit: "Editar Experiencia",
        },
        experiences: "Experiencias",
        login: "Iniciar Sesión",
        reviewForm: {
            create: "Crear Reseña",
            edit: "Editar Reseña",
        },
        userEditProfile: "Editar Perfil",
        userExperiences: "Mis Experiencias",
        userFavourites: "Mis Favoritos",
        userProfile: "Mi Perfil",
        userReviews: "Mis Reseñas",
        userArticles: "Mis Articulos",
        userRecommendations: "Mis recomendados",
        userTrips: "Mis viajes",
        tripDetails: "{{tripName}}",
        agents: "Agentes",
        agentDetails: "{{agentName}}"
    },

    Categories: {
        aventura: "Aventura",
        gastronomia: "Gastronomía",
        hoteleria: "Hotelería",
        relax: "Relax",
        nocturno: "Vida nocturna",
        historico: "Histórico",
    },

    Carousel: {
        experienceEmpty: "Esta categoría aun no tiene suficientes experiencias cargadas"
    },

    Navbar: {
        register: "Crea una cuenta",
        createExperience: "Crear experiencia",
        createArticle: "Crear articulo",
        viewAgents: "Agentes",
        email: "Email",
        search: "Buscar",
        forgotPassword: "¿Olvidaste tu contraseña?",
        login: "Iniciar sesión",
        loginTitle: "Iniciar sesión en Getaway",
        loginDescription: "Experiencias nuevas todos los días",
        newUser: "¿Eres nuevo en Getaway?",
        password: "Contraseña",
        confirmPassword: "Confirmar contraseña",
        profile: "Mi perfil",
        experiences: "Mis experiencias",
        trips: "Mis viajes",
        favourites: "Mis favoritos",
        reviews: "Mis reseñas",
        articles: "Mis articulos",
        recommendations: "Mis recomendados",
        logout: "Cerrar sesión",
        resetPasswordTitle: "Ingresa tu email y recibe un enlace de recuperación",
        resetPasswordButton: "Enviar",
        createAccountPopUp: "Crea tu cuenta",
        createAccountDescription: "¡Ingresa tus datos para comenzar!",
        max: "(Máximo {{num}})",
        name: "Nombre",
        surname: "Apellido",
        createButton: "Crear cuenta",
        emailPlaceholder: "juan@ejemplo.com",
        namePlaceholder: "Juan",
        surnamePlaceholder: "Martínez",
        passwordPlaceholder: "Entre 8 y 25 caracteres y al menos un número",
        editProfilePopUp: "Editá tu cuenta",
        editPasswordPopUp: "Cambiar contraseña",
        editPassword: "Nueva contraseña",
        confirmEditPassword: "Confirmar nueva contraseña",
        changePassword: "Cambiar contraseña",
        editProfile: "Editar cuenta",
        error: "Menor a 50 caracteres"
    },

    Filters: {
        title: "Filtros",
        city: {
            field: "Ciudad",
            placeholder: "¿A dónde?",
        },
        price: {
            title: "Precio",
            min: "0",
        },
        scoreAssign: "Puntaje mínimo",
        btn: {
            submit: "Buscar",
            clear: "Limpiar filtros",
        },
    },

    Experience: {
        name: "Nombre",
        category: "Categoría",
        price: {
            name: "Precio",
            null: "Precio no listado",
            free: "Gratis",
            exist: "$ {{price}}",
        },
        information: "Descripción",
        mail: {
            field: "Email",
            placeholder: "juanmartinez@ejemplo.com",
        },
        url: {
            field: "Url",
            placeholder: "https://google.com",
        },
        province: "Provincia",
        city: "Ciudad",
        address: "Dirección",
        image: "Imagen",
        placeholder: "Escribe para buscar",
        reviews: "Reseñas {{reviewCount}}",
        notVisible: "La experiencia está oculta en este momento",
        imgTitle: "Selecciona una imagen para la experiencia",
        toast: {
            imageSuccess: "¡Imagen de la experiencia actualizada con éxito!",
            imageInvalidFormat: "El formato de la imagen es inválido",
            imageError: "Error del servidor al actualizar la imagen",
            favSuccess: "'{{experienceName}}' se ha agregado a tus favoritos",
            noFavSuccess: "'{{experienceName}}' se ha quitado de tus favoritos",
            favError: "Error del servidor al agregar '{{experienceName}}' a favoritos",
            noFavError: "Error del servidor al quitar '{{experienceName}}' a favoritos",
            favNotSigned: "Inicia sesión para guardar en favoritos",
            visibilitySuccess: "'{{experienceName}}' ahora se encuentra visible para todos los usuarios",
            noVisibilitySuccess: "Se ha ocultado '{{experienceName}}'",
            visibilityError: "Error del servidor al cambiar la visibilidad de '{{experienceName}}'",
            deleteSuccess: "'{{experienceName}}' se ha borrado exitosamente",
            deleteError: "Error del servidor al borrar '{{experienceName}}'",
            addTripSuccess: "'{{experienceName}}' agregada a '{{tripName}}'",
            removeTripSuccess: "'{{experienceName}}' eliminada de '{{tripName}}'",
            addTripError: "Error del servidor al agregar '{{experienceName}}' en '{{tripName}}'",
            removeTripError: "Error del servidor al eliminar '{{experienceName}}' en '{{tripName}}'",
            recommendedSuccess: "'{{experienceName}}' se ha recomendado",
            noRecommendedSuccess: "{{experienceName}}' se ha eliminado de recomendados",
            recommendedError: "Error del servidor al agregar '{{experienceName}}' de recomendados",
            noRecommendedError: "Error del servidor al quitar '{{experienceName}}' de recomendados",
        },
    },

    ExperienceDetail: {
        imageDefault: "Esta imagen no se corresponde con la experiencia",
        price: {
            null: "Precio no listado",
            free: "Gratis",
            exist: "$ {{price}}",
        },
        description: "Descripción",
        noData: "Información no brindada",
        url: "Sitio oficial",
        email: "Email",
        review: "Reseñas",
        writeReview: "Escribir Reseña",
        notVisible: "La experiencia está oculta en este momento",
        noReviews: "Esta experiencia no tiene reseñas aún. Sé el primero en realizar una!"
    },

    ExperienceForm: {
        title: "Crea tu experiencia",
        edit: "Edita tu experiencia",
        error: {
            name: {
                isRequired: "Este campo no puede estar vacío",
                pattern: "El nombre ingresado no posee un formato válido",
                length: "El nombre de la experiencia debe tener entre 3-50 caracteres",
            },
            category: {
                isRequired: "Este campo no puede estar vacío",
            },
            price: {
                max: "El precio debe ser menor a $9999999",
            },
            description: {
                pattern: "La descripción ingresada no posee un formato válido",
                isRequired: "Este campo no puede estar vacío",
                length: "La descripción debe tener un máximo de 500 caracteres",
            },
            mail: {
                pattern: "El email ingresado no es válido",
                isRequired: "Este campo no puede estar vacío",
                length: "El mail debe tener un máximo de 255 caracteres",
            },
            url: {
                pattern: "La URL ingresada no es válido",
                length: "La URL debe tener un máximo de 500 caracteres",
            },
            province: {
                isRequired: "Este campo no puede estar vacío",
            },
            city: {
                isRequired: "Este campo no puede estar vacío",
            },
            address: {
                pattern: "La dirección ingresada no es válido",
                isRequired: "Este campo no puede estar vacío",
                length: "La dirección debe tener entre 5-100 caracteres",
            },
        },
        toast: {
            forbidden: {
                noUser: "Inicia sesión para crear experiencias",
                notVerified: "Verifica tu cuenta para crear experiencias",
                notAllowed: "No tienes permisos para modificar esta experiencia"
            },
            createSuccess: "¡'{{experienceName}}' creada con éxito!",
            createError: "Error del servidor al crear la experiencia '{{experienceName}}'",
            updateSuccess: "¡'{{experienceName}}' actualizada con éxito!",
            updateError: "Error del servidor al actualizar la experiencia '{{experienceName}}'",
        },
    },

    User: {
        profile: {
            description: "Mi perfil",
            name: "Nombre: {{userName}}",
            surname: "Apellido: {{userSurname}}",
            email: "Email: {{userEmail}}",
            editBtn: "Editar perfil",
            verifyAccountBtn: "Verifica tu cuenta",
            photo: "Cambiar imagen de perfil",
            beAgent: "Quiero ser agente",
            beProvider: "Quiero ser proovedor"
        },
        experiences: {
            status: {
                title: "Estado",
                pending: "Pendiente",
                verified: "Aprobada"
            },
            title: "Mis experiencias",
            category: "Categoría",
            score: "Puntaje",
            price: "Precio",
            views: "Vistas",
            actions: "Acciones",
            reviewsCount: "Reseñas ({{count}})",
            deleteTitle: "Eliminar experiencia",
            confirmDelete: "¿Está seguro que desea eliminar la experiencia: {{experienceName}}?"
        },
        noExperiences: "Aún no has creado ninguna experiencia",
        experiencesTitle: "Mis experiencias",
        noFavs: "Aún no has agregado experiencias a favoritos",
        favsTitle: "Mis favoritos",
        noReviews: "Aún no has escrito ninguna reseña",
        reviewsTitle: "Mis reseñas",
        tripsTitle: "Mis viajes",
        noTrips: "Aún no has creado ningun viaje",
        articlesTitle: "Mis articulos",
        noArticles: "Aún no has escrito ningun articulo",
        recommendedTitle: "Mis recomendados",
        noRecommended: "Aún no has recomendado ninguna experiencia",
        imgTitle: "Selecciona una imagen de perfil",
        toast: {
            imageSuccess: "¡Imagen de perfil actualizada con éxito!",
            imageError: "Error del servidor al actualizar la imagen de perfil",
            imageInvalidFormat: "El formato de la imagen es incorrecto",
            passwordResetEmailSuccess: "Mail enviado exitosamente",
            passwordResetEmailError: "Error del servidor al enviar el mail",
            notSigned: "Inicia sesión para acceder a tu información de perfil",
            alreadySigned: "Ya iniciaste sesión",
            sessionExpired: "Tu sesión ha expirado",
            verify: {
                success: "Tu cuenta ha sido verificada exitosamente",
                error: "Token no válido",
                alreadyVerified: "Tu cuenta ya se encuentra verificada",
            },
            sendVerify: "Se ha enviado un mail a tu casilla para que verifiques tu cuenta",
            resendVerify: {
                success: "Mail enviado exitosamente",
                error: "Error del servidor al enviar el mail",
            },
            editProfile: {
                success:"¡Información de perfil actualizada exitosamente!",
                error: "Error del servidor al actualizar la información de perfil",
                forbidden: "Verifica tu cuenta para editar tu perfil",
            },
            experiences: {
                forbidden: "Crea al menos una experiencia para acceder a 'Mis Experiencias'",
            },
            reviews: {
                forbidden: "Verifica tu cuenta para acceder a 'Mis Reseñas'",
            },
        },
    },

    EmptyResult: "Parece que no hay ninguna experiencia que coincida con tu búsqueda",

    Button: {
        cancel: "Cancelar",
        create: "Guardar",
        confirm: "Confirmar",
    },

    Input: {
        optional: "(Opcional)",
        maxValue: "(Máximo {{value}})",
    },

    Copyright: "Getaway Copyright © {{year}} - Todos los derechos reservados",

    404: {
        title: "Error 404",
        description: "Parece que la página que estas buscando no existe",
    },

    Error: {
        whoops: "Whoops!",
        backBtn: "Inicio",
        title: "Error {{errorCode}}",
    },

    Pagination: {
        message: "Página {{currentPage}} de {{maxPage}}",
        alt: {
            nextPage: "Siguiente",
            beforePage: "Anterior",
        },
    },

    Order: {
        title: "Ordenar por: ",
        OrderByAZ: "A-Z",
        OrderByZA: "Z-A",
        OrderByRankAsc: "Menor puntaje",
        OrderByRankDesc: "Mayor puntaje",
        OrderByLowPrice: "Menor precio",
        OrderByHighPrice: "Mayor precio",
        OrderByViewsAsc: "Menor visitas",
        OrderByViewsDesc: "Mayor visitas",
        OrderByNewest: "Ultimos agregados", 
        OrderByOldest: "Primeros agregados",
        OrderByPendings: "Primero pendientes",
        OrderByApproved: "Primero aprobados",
        OrderByFavsAsc: "Menos favoritos",
        OrderByFavsDesc: "Mas favoritos",
    },

    Landing: {
        user: {
            viewed: "Últimas visitadas",
            recommendedByFavs: "Basado en tus favoritos",
            recommendedByReviews: "Basado en tus reseñas",
        },
        anonymous: {
            lastAdded: "Mas nuevas",
            aventura: "Mejores valoradas de aventura",
            gastronomia: "Mejores valoradas de gastronomía",
            hoteleria: "Mejores valoradas de hotelería",
            relax: "Mejores valoradas de relax",
            vida_nocturna: "Mejores valoradas de vida nocturna",
            historico: "Mejores valoradas de histórico",
        },
    },

    Register: {
        error: {
            email: {
                isRequired: "Este campo es obligatorio",
                length: "El mail debe tener un máximo de 255 caracteres",
                pattern: "El email ingresado no es válido",
            },
            name: {
                isRequired: "Este campo es obligatorio",
                length: "El nombre debe tener un máximo de 50 caracteres",
                pattern: "El nombre ingresado no es válido",
            },
            surname: {
                isRequired: "Este campo es obligatorio",
                length: "El apellido debe tener un máximo de 50 caracteres",
                pattern: "El apellido ingresado no es válido",
            },
            password: {
                isRequired: "Este campo es obligatorio",
                length: "La contraseña debe tener entre 8-25 caracteres",
                pattern: "La contraseña ingresado no es válida (debe contar con al menos un digito)",
            },
            passwordsMustMatch: "Las contraseñas no coinciden",
        },
        toast: {
            error: "Error del servidor al registrarse",
            alreadyExists: "Usuario ya registrado",
        }
    },

    Login: {
        toast: {
            success: "¡Bienvenido {{name}} {{surname}}!",
            successEmail: "¡Bienvenido {{email}}!",
            error: "Error del servidor al intentar iniciar sesión",
            verifySent: "Código de verificación enviado al email",
        },
        invalidCredentials: "El mail o contraseña ingresados son incorrectos"
    },

    ChangePassword: {
        title: "Ingresa tu nueva contraseña",
        invalidEmail: "El email ingresado no es válido",
        toast: {
            forbidden: "No puedes cambiar tu contraseña si ya iniciaste sesión",
            missPasswordToken: "Token no presente",
            success: "¡Contraseña cambiada exitosamente!",
            error: "Token no valido",
        },
    },

    Experiences: {
        search: {
            search: "Buscando ",
            category: "en ",
            name: " \"{{name}}\""
        }
    },

    Review: {
        create: "Escribe una reseña para {{name}}",
        edit: "Edita la reseña para {{name}}",
        form: {
            title: "Título",
            description: "Descripción",
            score: "Puntaje",
            error: {
                title: {
                    pattern: "El titulo ingresado no posee un formato válido",
                    isRequired: "Este campo no puede estar vacío",
                    length: "El titulo debe tener entre 3-50 caracteres",
                },
                description: {
                    pattern: "La descripción ingresada no posee un formato válido",
                    isRequired: "Este campo no puede estar vacío",
                    length: "La descripción debe tener entre 3-255 caracteres",
                },
                score: {
                    isRequired: "Este campo no puede estar vacío",
                },
            },
        },
        deleteModal: {
            title: "Eliminar reseña",
            confirmDelete: "¿Está seguro que desea eliminar la reseña: {{reviewTitle}}?",
        },
        toast: {
            deleteSuccess: "'{{reviewTitle}}' se ha borrado con éxito",
            deleteError: "Error del servidor al borrar la reseña '{{reviewTitle}}'",
            createSuccess: "¡'{{reviewTitle}}' creada con éxito!",
            createError: "Error del servidor al crear la reseña '{{reviewTitle}}'",
            updateSuccess: "¡'{{reviewTitle}}' actualizada con éxito!",
            updateError: "Error del servidor al actualizar la reseña '{{reviewTitle}}'",
            alreadyCreate: "Ya creaste una reseña para esta experiencia",
            forbidden: {
                noUser: "Inicia sesión para crear reseñas",
                notAllowed: "No tienes permisos para modificar esta reseña",
            },
        },
    },

    Testimonial: {
        create: "Escribe un testimonio para {{name}}",
        edit: "Edita el testimonio para {{name}}",
        deleteModal: {
            title: "Eliminar testimonio",
            confirmDelete: "¿Está seguro que desea eliminar el testimonio: {{title}}?",
        },
        toast: {
            deleteSuccess: "'{{title}}' se ha borrado con éxito",
            deleteError: "Error del servidor al borrar el testimonio '{{title}}'",
            createSuccess: "¡'{{title}}' creada con éxito!",
            createError: "Error del servidor al crear el testimonio: '{{title}}'",
            updateSuccess: "¡'{{title}}' actualizada con éxito!",
            updateError: "Error del servidor al actualizar el testimonio '{{title}}'",
            alreadyCreate: "Ya creaste un testimonio para este agente",
            forbidden: {
                noUser: "Inicia sesión para crear testimonios a los agentes",
                notAllowed: "No tienes permisos para modificar este testimonio",
            },
        },
    },

    Article: {
        create: "Escribe un nuevo articulo",
        edit: "Edita el articulo: {{title}}",
        form: {
            title: "Titulo",
            description: "Descripción",
            error: {
                title: {
                    pattern: "El titulo ingresado no posee un formato válido",
                    isRequired: "Este campo no puede estar vacío",
                    length: "El titulo debe tener entre 3-100 caracteres",
                },
                description: {
                    pattern: "La descripción ingresada no posee un formato válido",
                    isRequired: "Este campo no puede estar vacío",
                    length: "La descripción debe tener entre 3-100 caracteres",
                },
            },
        },
        deleteModal: {
            title: "Eliminar articulo",
            confirmDelete: "¿Está seguro que desea eliminar el articulo: {{title}}?",
        },
        toast: {
            deleteSuccess: "'{{title}}' se ha borrado con éxito",
            deleteError: "Error del servidor al borrar el articulo '{{title}}'",
            createSuccess: "¡'{{title}}' creada con éxito!",
            createError: "Error del servidor al crear el articulo '{{title}}'",
            updateSuccess: "¡'{{title}}' actualizada con éxito!",
            updateError: "Error del servidor al actualizar el articulo '{{title}}'",
            forbidden: {
                pageAccess: "No tienes permisos para ingresar a esta página"
            }
        },
    },

    Image: {
        error: {
            isRequired: "Este campo no puede estar vacío",
            size: "La imagen es muy grande",
            format: "Solo formatos .png, .jpg y .jpeg",
        },
    },

    AriaLabel: {
        fav: "Guardar favoritos",
        closeForm: "Borrar búsqueda",
        leftArrow: "Experiencia anterior",
        rightArrow: "Experiencia siguiente",
        cancel: "Cancelar",
        confirm: "Confirmar",
        save: "Guardar",
        order: "Ordenar",
        send: "Enviar",
        search: "Buscar",
        viewAgents: "Agentes",
        createExperience: "Crear experiencia",
        createReview: "Crear reseña",
        login: "Iniciar sesión",
        signOut: "Cerrar sesión",
        profileInfo: "Mi cuenta",
        register: "Crear cuenta",
        home: "Inicio",
        writeReview: "Escribir reseña",
        cleanFilter: "Limpiar filtros",
        editImage: "Editar imagen",
        editProfile: "Editar perfil",
        verifyAccount: "Verifica tu cuenta para editar tu información de perfil y crear experiencias y reseñas",
        visibility: "Visibilidad",
        editExperience: "Editar experiencia",
        deleteExperience: "Eliminar experiencia",
        editReview: "Editar reseña",
        deleteReview: "Eliminar reseña",
        showPassword: "Mostrar contraseña",
        beAgent: "Quiero ser agente",
        beProvider: "Quiero ser proovedor",
        addToTrip: "Agregar a viaje",
        editAgent: "Editar agente",
        selectProvince: "Eligir provincia",
        selectCity: "Elegir ciudad"
    },

    Admin: {
        pendingExperiences: "Solicitudes de nuevas experiencias",
        emptyExperiences: "No hay nuevas solicitudes de experiencias",
        pendingAgents: "Solicitudes de nuevos agentes",
        emptyAgents: "No hay nuevas solicitudes de agentes",
        modal: {
            approveExperienceTitle: "Aprobar experiencia",
            approveExperienceMessage: "¿Está seguro que desea aprobar la experiencia: {{experienceName}}?",
            denyExperienceTitle: "Rechazar experiencia",
            denyExperienceMessage: "¿Está seguro que desea rechazar la experiencia: {{experienceName}}?",
            approveAgentTitle: "Aprobar agente",
            approveAgentessage: "¿Está seguro que desea aprobar al agente: {{name}}?",
            denyAgentTitle: "Rechazar agente",
            denyAgentMessage: "¿Está seguro que desea rechazar al agente: {{name}}?",
        },
        toast: {
            approveExperience: "Experiencia '{{experienceName}}' aprobada",
            approveExperienceError: "Error del servidor al aprobar '{{experienceName}}'",
            denyExperience: "Experiencia '{{experienceName}}' rechazada",
            denyExperienceError: "Error del servidor al rechazar '{{experienceName}}'",
            approveAgent: "Agente '{{name}}' aprobado",
            approveAgenteError: "Error del servidor al aprobar '{{name}}'",
            denyAgent: "Agente '{{name}}' rechazado",
            denyAgentError: "Error del servidor al rechazar '{{name}}'",
            forbidden: "No tienes permisos para ingresar a esta página"
        }
    },

    Trips: {
        createTrip: "Crear nuevo viaje",
        name: "Nombre del viaje: ",
        startDate: "Fecha de inicio: ",
        endDate: "Fecha de fin: ",
        description: "Descripción: ",
        editTrip: "Editar viaje",
        viewDetails: "Ver detalle",
        noExperiences: "Aún no has agregado ninguna experiencia a tu viaje",
        toast: {
            createSuccess: "¡'{{name}}' creada con éxito!",
            createError:  "Error del servidor al crear el viaje '{{name}}'",
            updateSuccess: "¡'{{name}}' actualizada con éxito!",
            updateError: "Error del servidor al actualizar el viaje '{{name}}'",
            deleteSuccess: "'{{name}}' se ha borrado con éxito",
            deleteError: "Error del servidor al borrar el viaje '{{name}}'",
        },
        dropdown: {
            noTrips: "No tienes viajes creados",
        }
    },

    Agents: {
        title: "Agentes turísticos",
        noAgents: "Parece que todavia no hay ningun agente registrado",
        rating: "Puntaje",
        contactInfo: "Informacion de contacto",
        recommended: "Experiencias recomendadas",
        writeTestimonial: "Escribir testimonio",
        testimonials: "Testimonios",
        noTestimonials: "Este agente no tiene testimonios aún. Sé el primero en realizar uno!",
        viewProfile: "Ver perfil",
        imgTitle: "Selecciona una imagen de perfil de agente",
        recommend: "Recomendar",
        unrecommend: "No recomendar",
        form: {
            title: "Mi agente",
            name: "Nombre",
            email: "Email",
            phone: "Teléfono",
            agency: "Agencia",
            address: "Direccion",
            specialization: "Especialización",
            languages: "Idiomas",
            experience: "Años de experiencía",
            bio: "Sobre mi",
            twitter: "Twitter",
            instagram: "Instagram",
            error: {
                name: "Este campo no puede estar vacío",
                email: "Este campo no puede estar vacío",
                phone: "Este campo no puede estar vacío",
                address: "Este campo no puede estar vacío",
                agency: "",
                specialization: "",
                languages: "Este campo no puede estar vacío",
                experience: "Este campo no puede estar vacío",
                bio: "Este campo no puede estar vacío",
                twitter: "",
                instagram: "",
            }
        },
        table: {
            experience:"Experiencia",
            years: "años",
        },
        toast: {
            createAgent: {
                success:"¡Información de agente creada exitosamente! Ahora deberas esperar que un administrador apruebe tu solicitud",
                error: "Error del servidor al crear agente",
            },
            updateAgent: {
                success:"¡Información de agente actualizada exitosamente!",
                error: "Error del servidor al actualizar agente",
            },
        }
    },

    ConfirmEmail: {
        confirmEmail: "Te enviamos un código a tu email",
        email: "Email",
        emailPlaceholder: "example@example.com",
        code: "Código",
        resendCode: "Reenviar código",
        checkCode: "Verificar código",
        toast: {
            confirmedEmail: "Email confirmado",
            alreadyConfirmed: "Tu email ya se encuentra confirmado",
            pleaseTryAgain: "Por favor, intenta devuelta!",
            emailRequired: "Email requerido",
            codeResent: "Código reenviado"
        }
    }
};