# 📩 Email Sender Automático
Este proyecto es una implementacion completa de **envios automaticos** de emails cuando un usuario realiza una accion especifica en el sistema.En este caso use de ejemplo un sistema de reserva de turnos pero podes adaptarlo facilmente a la logica que vos necesites . Incluye un pequeño frontend para que lo levantes y pruebes el sistema.

**Una vez mas , si llegaste de tiktok mil gracias por bancar y si le dejas una ⭐ al repo se agradece de corazon.**


## 🖼️ Frontend Preview
<p align="center">
  <img src="https://github.com/user-attachments/assets/b476e79a-93d3-41b3-8999-8459b77f0d40" width="500" height="600" alt="imagen" />
</p>

## 📦 Cómo usarlo

**1. Cloná el repositorio <br/>**

    git clone git@github.com:Mateo-Alvarez1/email-notification.git
    cd email-notification
    
**2. Configurá las variables de entorno <br/>**
     Crea un archivo `.env` con los siguientes datos:

    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_HOST=localhost
    DB_PORT=5432

    MAIL_PASS=your_mail_pass  (Si quieres usar GMAIL tenes que configurar una app 👇)
    MAIL_USER=your_mail

**3. Instalá dependencias y corré el backend<br/>**

    cd server
    npm install
    npm run start:dev

**4. Corré el frontend<br/>**

    cd client
    npm install
    npm run dev

## ⚙️ Configurar para usarlo con gmail

**1. Dirigite a esta URL <br/>**

    https://myaccount.google.com/apppasswords
**2. Te abre una pestaña como esta: <br/>**
<p align="center">
<img width="500" height="600" alt="imagen" src="https://github.com/user-attachments/assets/0e6d4462-4da4-4d06-bf01-f9caf5785825" />
</p>

**3. Creas un nombre para tu app <br/>**
**4. Copiar la contraseña y pegarla en tu archivo `.env`<br/>**

## ⭐ ¿Te sirvió?
Seguime en tiktok que subo contenido sobre desarrollo , automatizaciones y experiencias
👉 @matualvarez_
