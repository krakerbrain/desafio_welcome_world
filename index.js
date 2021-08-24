// Importar Módulos
const http = require("http");
const url = require("url");
const fs = require("fs");

//1. Crear un servidor en Node con el módulo http.
http
  .createServer((req, res) => {
    // Constantes para obtener datos desde los formularios
    const params = url.parse(req.url, true).query;
    const archivo = params.archivo;
    const contenido = params.contenido;
    const nombre = params.nombre;
    const nuevoNombre = params.nuevoNombre;

    // 7. Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato
    // “dd/mm/yyyy”. Considera que si el día o el mes es menor a 10 concatenar un “0” a la
    // izquierda. (Opcional)

    let dia = new Date().getDate();
    let mes = new Date().getMonth() + 1;

    let nuevoDia = "0";
    let nuevoMes = "0";

    if (dia < 10) {
      nuevoDia = nuevoDia.concat(dia);
    } else {
      nuevoDia = dia;
    }

    if (mes < 10) {
      nuevoMes = nuevoMes.concat(mes);
    } else {
      nuevoMes = mes;
    }

    let fechaHoy = `${nuevoDia}/${nuevoMes}/${new Date().getFullYear()}`;

    //2. Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida.

    if (req.url.includes("/crear")) {
      //6. Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
      fs.writeFile(`${archivo}.txt`, `${fechaHoy}\n\n ${contenido}`, () => {
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        res.write("Archivo creado con éxito!");
        res.end();
      });
    }
    // 3. Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es
    //declarado en los parámetros de la consulta recibida.

    if (req.url.includes("/leer")) {
      fs.readFile(`${archivo}.txt`, (err, data) => {
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        res.write(data);
        res.end();
      });
    }
    //4. Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es
    //declarado en los parámetros de la consulta recibida.

    if (req.url.includes("/renombrar")) {
      fs.rename(`${nombre}.txt`, `${nuevoNombre}.txt`, (err, data) => {
        //8. En la ruta para renombrar, devuelve un mensaje de éxito incluyendo el nombre
        //anterior del archivo y su nuevo nombre de forma dinámica . (Opcional)
        res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
        res.write(`Archivo ${nombre}.txt renombrado como ${nuevoNombre}.txt`);
        res.end();
      });
    }
    //5. Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los
    //parámetros de la consulta recibida.

    if (req.url.includes("/eliminar")) {
      res.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
      //   9. En el mensaje de respuesta de la ruta para eliminar un archivo, devuelve el siguiente
      //   mensaje: “Tu solicitud para eliminar el archivo <nombre_archivo> se está
      //   procesando”, y luego de 3 segundos envía el mensaje de éxito mencionando el
      //   nombre del archivo eliminado. (Opcional)

      fs.unlink(`${archivo}.txt`, (err, data) => {
        res.write(`Tu solicitud para eliminar el archivo ${archivo}.txt se está procesando<br>`);
        setTimeout(() => {
          res.write(`Archivo ${archivo}.txt ha sido eliminado con éxito`);
          res.end();
        }, 3000);
      });
    }
  })
  .listen(8080, () => console.log("Escuchando el puerto 8080"));
