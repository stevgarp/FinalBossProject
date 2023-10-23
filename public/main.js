const loadLoginTamplate = () => {
    const template = 
    `<h1>Iniciar Sesión</h1>
        <form id="inicio-Sesion">
            <label for="Correo">Correo de Usuario:</label>
            <input type="text" id="correo" name="correo" required>
            
            <label for="password">Contraseña:</label>
            <input type="password" id="contrasena" name="contrasena" required>
            
            <button type="submit">Iniciar Sesión</button>
        </form>
        <p>¿No tienes una cuenta? <a href="" id="register">Regístrate aquí</a></p>
        <div id="error"></div>`

    const body = document.querySelector('body');
    body.innerHTML = template;
};

const loadRegisterTemplate = ()=> {
    const template = `<h1>Registro de Usuarios</h1>
    <form id="register-form">
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" name="correo" required>
        
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="contrasena" required>

        <button type="submit" id="registroButton">Registrarse</button>
    </form>
        <p>¿Ya tienes una cuenta? <a href="#" id="login" >Inicia sesión aquí</a></p>
        <div id="error"></div>`;
        
    const body = document.querySelector('body');
    body.innerHTML = template;
    };

const loadRegisterCompleteTemplate = ()=> {
    const template = `<h1>Registro de Usuarios</h1>
    <form id="register-form-C">
        <label for="username">Nombre de Usuario:</label>
        <input type="text" id="username" name="nombre" required>

        <label for="apellido">apellido de Usuario:</label>
        <input type="text" id="lastname" name="apellido" required>

        <label for="userfecha">Fecha de Nacimiento:</label>
        <input type="date" id="userfecha" name="fechaNacimiento" required>

        <label for="gustos">Gustos:</label>
        <input type="text" id="gust" name="gustos" required>
   
        <button type="submit" id="registroButton">Registrarse</button>
    </form>
        <p>¿Ya tienes una cuenta? <a href="#" id="login" >Inicia sesión aquí</a></p>
        <div id="error"></div>`;
    const body = document.querySelector('body');
    body.innerHTML = template;
    };

const loadUserTemplate = () => {
    const template = `
    <h1>Mi Informacion</h1>
    <table border="1" id="dataU">
        <tr>
            <th>Nombre de Usuario</th>
            <th>Apellido de Usuario</th>
            <th>Fecha de Nacimiento</th>
            <th>Intereses y Preferencias de Contenido</th>
        </tr>
        
    </table>`
    const body = document.querySelector('body');
    body.innerHTML = template;
};

const gotoRegisterListener = () => {
    const registerLink = document.querySelector('#register');
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerPage();
    });
};

const gotoLoginListener = () => {
    const loginLink = document.querySelector('#login');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginPage();
    });
};

const addLoginListener = () => {
    const loginForm = document.querySelector('#inicio-Sesion');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        console.log(data);

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const responseData = await response.json();
        if (response.status >= 300) {
            const errorNode = document.querySelector('#error');
            errorNode.innerHTML = responseData;
        }else {
            localStorage.setItem('token', `Bearer ${responseData.signed}`);
            userPages(responseData.user);
        };
    });
};

const addRegisterListener = () => {
    const registerForm = document.querySelector('#register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const {correo, contrasena} = Object.fromEntries(formData.entries());

        const response = await fetch('/registrar-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({correo:correo, contrasena:contrasena}),
        });
        const responseData = await response.json();
        if (response.status >= 300) {
            const errorNode = document.querySelector('#error');
            errorNode.innerHTML = responseData;
        }else {
            registerComplete(responseData.user);
        };
    });
};

const addAllRegisterListener = (id) => {
    const registerForm = document.querySelector('#register-form-C');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const {nombre, apellido, fechaNacimiento, gustos} = Object.fromEntries(formData.entries());

        console.log({nombre: nombre, apellido: apellido, fechaNacimiento: fechaNacimiento, gustos: gustos});

        const response2 = await fetch('/usuario-completo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id, nombre: nombre, apellido: apellido, fechaNacimiento: fechaNacimiento, gustos: gustos}),
        });
        const responseData2 = await response2.text();
        if (response2.status >= 300) {
            const errorNode = document.querySelector('#error');
            errorNode.innerHTML = responseData2;
        }else {
            alert("registro con exito");
        };
    });
};

const getUser = async (id) => {
    const response = await fetch(`/usuario/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
        },
    });
    const responseData = await response.json();
    console.log(responseData);
    const table = document.querySelector('#dataU');
    responseData.forEach((user) => {
        const row = document.createElement('tr');
        const name = document.createElement('td');
        name.innerText = user.nombre;
        const lastname = document.createElement('td');
        lastname.innerText = user.apellido;
        const fechaNacimiento = document.createElement('td');
        fechaNacimiento.innerText = user.fecha_nacimiento;
        const gustos = document.createElement('td');
        gustos.innerText = user.gustos;
        row.appendChild(name);
        row.appendChild(lastname);
        row.appendChild(fechaNacimiento);
        row.appendChild(gustos);
        table.appendChild(row);
    });
};

const userPages = (id) => {
    loadUserTemplate();
    getUser(id);
};

const loginPage = () => {
    loadLoginTamplate();
    addLoginListener();
    gotoRegisterListener();
};


const registerPage = () => {
    loadRegisterTemplate();
    addRegisterListener();
    gotoLoginListener();
};

const registerComplete = (id) => {
    loadRegisterCompleteTemplate();
    addAllRegisterListener(id);
    gotoLoginListener();
};

window.onload = async () => {
    loginPage();
    };